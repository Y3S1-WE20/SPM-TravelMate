import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// PayPal SDK setup
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

// Generate PayPal access token
const generateAccessToken = async () => {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error generating PayPal access token:', error);
    throw error;
  }
};

// Create PayPal order
export const createPayPalOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    
    // Validate booking exists
    const booking = await Booking.findById(bookingId).populate('propertyId');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Get property owner
    const property = await Property.findById(booking.propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    const accessToken = await generateAccessToken();
    
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: bookingId,
        description: `Booking for ${booking.propertyTitle}`,
        amount: {
          currency_code: 'USD',
          value: amount.toFixed(2)
        }
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/booking/success`,
        cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`,
        brand_name: 'TravelMate',
        user_action: 'PAY_NOW'
      }
    };
    
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(orderData)
    });
    
    const order = await response.json();
    
    if (order.id) {
      // Create payment record
      const payment = new Payment({
        bookingId: booking._id,
        userId: booking.userId,
        propertyOwnerId: property.owner,
        propertyId: property._id,
        amount: amount,
        currency: 'USD',
        paypalOrderId: order.id,
        status: 'pending',
        guestEmail: booking.guestInfo?.email,
        guestName: `${booking.guestInfo?.firstName} ${booking.guestInfo?.lastName}`
      });
      
      await payment.save();
      
      res.json({
        success: true,
        data: {
          orderId: order.id,
          paymentId: payment._id
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
