import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// PayPal SDK setup
// NOTE: read PayPal credentials at runtime inside functions to avoid issues when modules
// are imported before env is fully injected in some environments. This keeps values
// fresh and avoids stale undefined values captured at import time.

// Generate PayPal access token
const generateAccessToken = async () => {
  try {
  // Trim credentials to avoid whitespace issues
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
    // Debug: log presence of credentials (don't log secrets)
    console.log('DEBUG PayPal env: clientId present=', !!clientId, 'clientId(first10)=', clientId ? clientId.substring(0,10) : null, 'secret present=', !!clientSecret);
    
    if (!clientId || !clientSecret) {
      console.error('PayPal credentials are missing in backend environment');
      throw new Error('PayPal credentials are not configured properly');
    }
    
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    
    const data = await response.json();
    
    // Check if response was successful
    if (!response.ok) {
      console.error('PayPal token generation failed:', {
        status: response.status,
        statusText: response.statusText,
        error: data
      });
      throw new Error(`PayPal API error: ${data.error || response.statusText} - ${data.error_description || ''}`);
    }
    
    // Validate access token exists
    if (!data.access_token) {
      console.error('No access token in PayPal response:', data);
      throw new Error('PayPal did not return an access token');
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Error generating PayPal access token:', error.message);
    throw error;
  }
};

// Create PayPal order
export const createPayPalOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    console.log('Creating PayPal order for bookingId:', bookingId, 'amount:', amount);
    
    // Validate booking exists
    const booking = await Booking.findById(bookingId).populate('propertyId');
    if (!booking) {
      console.error('Booking not found for id:', bookingId);
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    console.log('Booking found:', booking._id);
    
    // Get property owner
    const property = await Property.findById(booking.propertyId);
    if (!property) {
      console.error('Property not found for id:', booking.propertyId);
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    console.log('Property found:', property._id);
    
  const accessToken = await generateAccessToken();
  console.log('✅ PayPal access token generated successfully');
    
    // Convert LKR to USD (approximate rate: 1 USD = 300 LKR)
    const LKR_TO_USD_RATE = 300;
    const amountInUSD = (amount / LKR_TO_USD_RATE);
    
    console.log(`Converting ${amount} LKR to ${amountInUSD.toFixed(2)} USD`);
    
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: bookingId,
        description: `Booking for ${booking.propertyTitle}`,
        amount: {
          currency_code: 'USD',
          value: amountInUSD.toFixed(2)
        }
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?payment=success`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?payment=cancelled`,
        brand_name: 'TravelMate',
        user_action: 'PAY_NOW'
      }
    };
    
    const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'production' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    let response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(orderData)
    });
    
    let order = await response.json();
    
    // Log response for debugging
    if (!response.ok) {
      console.error('PayPal order creation failed:', {
        status: response.status,
        statusText: response.statusText,
        error: order
      });
    } else {
      console.log('✅ PayPal order created:', order.id);
    }

    // Handle transient invalid_token errors by regenerating token and retrying once
    if ((order && order.error === 'invalid_token') || response.status === 401) {
      console.warn('PayPal returned invalid_token. Regenerating access token and retrying...');
      try {
        const newAccessToken = await generateAccessToken();
        console.log('✅ New access token generated for retry');
        response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newAccessToken}`
          },
          body: JSON.stringify(orderData)
        });
        order = await response.json();
        
        if (!response.ok) {
          console.error('PayPal order creation retry failed:', {
            status: response.status,
            statusText: response.statusText,
            error: order
          });
        } else {
          console.log('✅ PayPal order created on retry:', order.id);
        }
      } catch (retryErr) {
        console.error('Retry creating PayPal order failed:', retryErr);
      }
    }
    
    if (order.id) {
      // Create payment record
      const payment = new Payment({
        bookingId: booking._id,
        userId: booking.userId,
        // Use ownerId from Property, fallback to booking.userId if invalid
        propertyOwnerId: (property.ownerId && mongoose.Types.ObjectId.isValid(property.ownerId)) 
          ? property.ownerId 
          : booking.userId,
        propertyId: property._id,
        amount: amount,
        currency: 'USD',
        paypalOrderId: order.id,
        status: 'pending',
        guestEmail: booking.guestInfo?.email,
        guestName: `${booking.guestInfo?.firstName} ${booking.guestInfo?.lastName}`
      });
      
      await payment.save();
      // Find approval link (hosted PayPal checkout)
      const approveLink = Array.isArray(order.links)
        ? (order.links.find(l => l.rel === 'approve') || order.links.find(l => l.rel === 'approve_url') || null)
        : null;

      res.json({
        success: true,
        data: {
          orderId: order.id,
          paymentId: payment._id,
          approveUrl: approveLink?.href || null,
          rawOrder: order
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating PayPal order',
        error: order
      });
    }
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
};

// Capture PayPal payment
export const capturePayPalPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Find payment record
    const payment = await Payment.findOne({ paypalOrderId: orderId })
      .populate('bookingId')
      .populate('userId', 'firstName lastName email')
      .populate('propertyOwnerId', 'firstName lastName email');
      
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }
    
    const accessToken = await generateAccessToken();
    const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const captureData = await response.json();
    
    if (captureData.status === 'COMPLETED') {
      // Update payment record
      payment.status = 'completed';
      payment.paymentDate = new Date();
      payment.paypalPayerId = captureData.payer?.payer_id;
      payment.paypalPaymentId = captureData.purchase_units[0]?.payments?.captures[0]?.id;
      payment.paypalResponse = captureData;
      await payment.save();
      
      // Update booking status to confirmed
      const booking = await Booking.findById(payment.bookingId);
      if (booking) {
        booking.status = 'confirmed';
        await booking.save();
      }
      
      // Add payment to user's profile if logged in
      if (payment.userId) {
        await User.findByIdAndUpdate(payment.userId, {
          $push: { 
            paymentHistory: {
              paymentId: payment._id,
              amount: payment.amount,
              date: payment.paymentDate,
              bookingId: payment.bookingId,
              status: 'completed'
            }
          }
        });
      }
      
      // Add payment to property owner's profile
      await User.findByIdAndUpdate(payment.propertyOwnerId, {
        $push: {
          receivedPayments: {
            paymentId: payment._id,
            amount: payment.ownerPayout,
            date: payment.paymentDate,
            bookingId: payment.bookingId,
            propertyId: payment.propertyId,
            status: 'completed'
          }
        },
        $inc: {
          totalEarnings: payment.ownerPayout
        }
      });
      
      res.json({
        success: true,
        message: 'Payment captured successfully',
        data: {
          payment,
          booking,
          captureDetails: captureData
        }
      });
    } else {
      payment.status = 'failed';
      payment.paypalResponse = captureData;
      await payment.save();
      
      res.status(400).json({
        success: false,
        message: 'Payment capture failed',
        data: captureData
      });
    }
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
};

// Complete payment (frontend-side approval payload)
export const completePayment = async (req, res) => {
  try {
    const body = req.body || {};

    // Defensive read of fields
    const apptObj = body.appointmentId || body.bookingId || body.apptId;
    const orderId = body.paypalOrderId || body.orderId || body.paypal_order_id;
    const amount = body.amount;
    const userId = body.userId || body.user || null;

    console.log('[COMPLETE] Received payment completion payload:', {
      appointmentId: apptObj,
      paypalOrderId: orderId,
      amount,
      userId
    });

    if (!apptObj) {
      return res.status(400).json({ success: false, message: 'appointmentId missing in request payload' });
    }
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'paypalOrderId missing in request payload' });
    }
    if (amount == null) {
      return res.status(400).json({ success: false, message: 'amount missing in request payload' });
    }

    // Parse appointment/booking id
    let bookingId;
    try { bookingId = apptObj; } catch (e) { bookingId = apptObj; }

    // Check if payment already exists for this order
    const existing = await Payment.findOne({ paypalOrderId: orderId });
    if (existing && existing.status === 'completed') {
      console.log('Payment already completed for order ID:', orderId);
      return res.json({ 
        success: true, 
        message: 'Payment already completed', 
        paymentId: existing._id,
        bookingId: existing.bookingId 
      });
    }

    // Check if captureDetails are provided (frontend already captured)
    let capData = body.captureDetails;
    
    if (!capData || capData.status !== 'COMPLETED') {
      // If not captured by frontend, try to capture on backend
      console.log('Capturing PayPal order on backend:', orderId);
      const accessToken = await generateAccessToken();
      const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'production' 
        ? 'https://api-m.paypal.com' 
        : 'https://api-m.sandbox.paypal.com';
        
      const capRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      capData = await capRes.json();
      console.log('PayPal capture response:', capRes.status, capData?.status || capData);

      // Handle already captured case (422 error)
      if (capData.name === 'UNPROCESSABLE_ENTITY' && 
          capData.details?.[0]?.issue === 'ORDER_ALREADY_CAPTURED') {
        console.log('Order already captured by frontend, retrieving order details...');
        
        // Get order details instead
        const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        capData = await orderRes.json();
        console.log('Retrieved order details:', capData?.status);
      }

      if (capData.status !== 'COMPLETED') {
        console.error('PayPal capture/retrieval failed:', capData);
        
        // Update existing payment if it exists
        if (existing) {
          existing.status = 'failed';
          existing.paypalResponse = capData;
          await existing.save();
        }
        
        return res.status(400).json({ 
          success: false, 
          message: 'PayPal capture did not complete', 
          data: capData 
        });
      }
    } else {
      console.log('Using capture details from frontend, status:', capData.status);
    }

    // Get booking and property info
    let booking = null;
    try { 
      booking = await Booking.findById(bookingId).populate('propertyId');
      console.log('Booking found:', booking?._id);
    } catch (e) { 
      console.error('Error fetching booking:', e.message);
    }

    let property = null;
    let propertyOwnerId = null;
    
    if (booking && booking.propertyId) {
      // If propertyId is already populated (object), use it directly
      if (booking.propertyId._id) {
        property = booking.propertyId;
        propertyOwnerId = property.ownerId || property.owner;
      } else {
        // Otherwise fetch the property
        try { 
          property = await Property.findById(booking.propertyId);
          propertyOwnerId = property?.ownerId || property?.owner;
          console.log('Property found:', property?._id, 'Owner:', propertyOwnerId);
        } catch (e) { 
          console.error('Error fetching property:', e.message);
        }
      }
    }

    // Validate required fields
    if (!propertyOwnerId) {
      console.error('Property owner ID not found for booking:', bookingId);
      return res.status(400).json({ 
        success: false, 
        message: 'Property owner information is missing. Cannot complete payment.' 
      });
    }

    if (!property?._id) {
      console.error('Property ID not found for booking:', bookingId);
      return res.status(400).json({ 
        success: false, 
        message: 'Property information is missing. Cannot complete payment.' 
      });
    }

    // Update or create payment record
    let payment;
    if (existing) {
      // Update existing payment
      payment = existing;
      payment.status = 'completed';
      payment.paymentDate = new Date();
      payment.paypalPayerId = capData.payer?.payer_id;
      payment.paypalPaymentId = capData.purchase_units?.[0]?.payments?.captures?.[0]?.id;
      payment.paypalResponse = capData;
      
      // Ensure required fields are set
      if (!payment.propertyOwnerId && propertyOwnerId) {
        payment.propertyOwnerId = propertyOwnerId;
      }
      if (!payment.propertyId && property?._id) {
        payment.propertyId = property._id;
      }
      
      await payment.save();
      console.log('✅ Payment updated with id:', payment._id);
    } else {
      // Create new payment record
      payment = new Payment({
        bookingId: booking?._id || bookingId,
        userId: booking?.userId || userId || null,
        propertyOwnerId: propertyOwnerId,
        propertyId: property._id,
        amount: amount,
        currency: 'USD',
        paypalOrderId: orderId,
        status: 'completed',
        paymentDate: new Date(),
        paypalPayerId: capData.payer?.payer_id,
        paypalPaymentId: capData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        paypalResponse: capData,
        guestEmail: booking?.guestInfo?.email || null,
        guestName: booking ? `${booking.guestInfo?.firstName || ''} ${booking.guestInfo?.lastName || ''}`.trim() : null,
        paymentMethod: 'PayPal',
        ownerPayout: amount * 0.85 // 85% to owner, 15% platform fee
      });

      try {
        payment = await payment.save();
        console.log('✅ Payment saved with id:', payment._id);
      } catch (dbErr) {
        console.error('Error saving payment:', dbErr);
        console.error('Payment data that failed:', {
          bookingId: payment.bookingId,
          propertyOwnerId: payment.propertyOwnerId,
          propertyId: payment.propertyId,
          amount: payment.amount
        });
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to save payment: ' + dbErr.message, 
          error: dbErr.message 
        });
      }
    }

    // Update booking status to confirmed
    if (booking) {
      try {
        booking.status = 'confirmed';
        await booking.save();
        console.log('✅ Booking status updated to confirmed for', booking._id);
      } catch (e) {
        console.warn('Could not update booking status:', e.message);
      }
    }

    // Update user payment history
    if (payment.userId) {
      try {
        await User.findByIdAndUpdate(payment.userId, {
          $push: { 
            paymentHistory: { 
              paymentId: payment._id, 
              amount: payment.amount, 
              date: payment.paymentDate, 
              bookingId: payment.bookingId, 
              status: 'completed' 
            } 
          }
        });
        console.log('✅ User payment history updated');
      } catch (e) {
        console.warn('Could not update user payment history:', e.message);
      }
    }

    // Update owner receivedPayments and totals
    if (payment.propertyOwnerId) {
      try {
        await User.findByIdAndUpdate(payment.propertyOwnerId, {
          $push: { 
            receivedPayments: { 
              paymentId: payment._id, 
              amount: payment.ownerPayout || payment.amount, 
              date: payment.paymentDate, 
              bookingId: payment.bookingId, 
              propertyId: payment.propertyId, 
              status: 'completed' 
            } 
          },
          $inc: { totalEarnings: payment.ownerPayout || 0 }
        });
        console.log('✅ Owner payment history updated');
      } catch (e) {
        console.warn('Could not update owner payments:', e.message);
      }
    }

    return res.json({ 
      success: true, 
      message: 'Payment completed successfully', 
      paymentId: payment._id, 
      bookingId: payment.bookingId,
      transactionId: orderId 
    });
  } catch (error) {
    console.error('completePayment error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Payment completion failed', 
      error: error.message 
    });
  }
};

// Get payment details
export const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId)
      .populate('bookingId')
      .populate('userId', 'firstName lastName email')
      .populate('propertyOwnerId', 'firstName lastName email')
      .populate('propertyId', 'title city images');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details',
      error: error.message
    });
  }
};

// Get user's payment history
export const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    
    let filter = { userId };
    if (status) filter.status = status;
    
    const payments = await Payment.find(filter)
      .populate('bookingId')
      .populate('propertyId', 'title city images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Payment.countDocuments(filter);
    
    res.json({
      success: true,
      data: payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

// Get property owner's received payments
export const getOwnerPayments = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    
    let filter = { propertyOwnerId: ownerId };
    if (status) filter.status = status;
    
    const payments = await Payment.find(filter)
      .populate('bookingId')
      .populate('propertyId', 'title city images')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Payment.countDocuments(filter);
    
    // Calculate total earnings
    const earnings = await Payment.aggregate([
      { $match: { propertyOwnerId: mongoose.Types.ObjectId(ownerId), status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$ownerPayout' } } }
    ]);
    
    res.json({
      success: true,
      data: payments,
      totalEarnings: earnings[0]?.total || 0,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching owner payments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

export default {
  createPayPalOrder,
  capturePayPalPayment,
  getPayment,
  getUserPayments,
  getOwnerPayments
};
