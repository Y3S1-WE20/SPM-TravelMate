import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import './BookingPage.css';

const BookingPage = () => {
  const { id: propertyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [sdkLoadFailed, setSdkLoadFailed] = useState(false);
  
  // Availability Selection State
  const [availabilityData, setAvailabilityData] = useState({
    checkIn: '',
    checkOut: '',
    rooms: 1,
    adults: 2,
    children: 0
  });
  
  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phoneNumber: '',
    bookingFor: 'myself',
    smokingPreference: 'non-smoking',
    specialRequests: '',
    arrivalTime: ''
  });
  
  const [totalCost, setTotalCost] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // PayPal configuration
  const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

  // Explicitly request the buttons component and currency so the SDK loads the right features
  const paypalOptions = {
    "client-id": paypalClientId,
    components: 'buttons',
    currency: "USD",
    intent: "capture"
  };

  // Debug PayPal configuration and runtime availability
  useEffect(() => {
    // Log presence of client id when user reaches payment step
    if (bookingStep === 3) {
      console.log('PayPal Client ID:', paypalClientId ? 'Present' : 'Missing');
      if (paypalClientId) console.log('PayPal Client ID (first 10 chars):', paypalClientId.substring(0, 10));

      // Check if the PayPal JS SDK has been attached to window
      if (typeof window !== 'undefined') {
        console.log('window.paypal available:', !!window.paypal);
        if (!window.paypal) {
          console.warn('PayPal SDK not found on window. The SDK script may have failed to load.');
        }
      }
    }
  }, [bookingStep, paypalClientId]);

  const fetchProperty = useCallback(async () => {
    try {
      console.log('Fetching property with ID:', propertyId); // Debug log
      const response = await axios.get(`http://localhost:5001/api/properties/${propertyId}`);
      console.log('Property response:', response.data); // Debug log
      setProperty(response.data.data);
    } catch (error) {
      console.error('Error fetching property:', error);
      console.error('Error details:', error.response?.data); // More detailed error log
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [propertyId, navigate]);

  const calculateCost = useCallback(() => {
    if (!availabilityData.checkIn || !availabilityData.checkOut || !property) {
      setTotalCost(0);
      setNumberOfNights(0);
      return;
    }

    const checkIn = new Date(availabilityData.checkIn);
    const checkOut = new Date(availabilityData.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (nights <= 0) {
      setTotalCost(0);
      setNumberOfNights(0);
      return;
    }

    setNumberOfNights(nights);
    
    const basePrice = property.discount > 0 
      ? property.pricePerNight * (1 - property.discount / 100)
      : property.pricePerNight;
    
    const roomCost = basePrice * availabilityData.rooms * nights;
    setTotalCost(roomCost);
  }, [availabilityData, property]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (propertyId) {
      console.log('PropertyID from URL:', propertyId);
      fetchProperty();
    } else {
      console.error('No property ID found in URL params');
      setLoading(false);
    }
  }, [propertyId, fetchProperty]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    calculateCost();
  }, [calculateCost]);
 

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setAvailabilityData(prev => ({
      ...prev,
      [name]: name === 'rooms' || name === 'adults' || name === 'children' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    return availabilityData.checkIn && 
           availabilityData.checkOut && 
           availabilityData.rooms > 0 && 
           availabilityData.adults > 0 &&
           numberOfNights > 0;
  };

  const validateStep2 = () => {
    return personalInfo.firstName && 
           personalInfo.lastName && 
           personalInfo.email && 
           personalInfo.country && 
           personalInfo.phoneNumber;
  };

  const handleNext = () => {
    if (bookingStep === 1 && validateStep1()) {
      setBookingStep(2);
    }
  };

  const handleBack = () => {
    if (bookingStep === 2) {
      setBookingStep(1);
    }
  };

  const handleSubmitBooking = async () => {
    if (!validateStep2()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      const bookingData = {
        userId: user?._id,
        propertyId: property._id,
        propertyTitle: property.title,
        propertyImage: property.images[0] || '',
        checkIn: availabilityData.checkIn,
        checkOut: availabilityData.checkOut,
        rooms: availabilityData.rooms,
        adults: availabilityData.adults,
        children: availabilityData.children,
        numberOfNights,
        totalCost,
        guestInfo: personalInfo,
        bookingDate: new Date().toISOString(),
        status: 'pending'
      };

      console.log('Submitting booking data:', bookingData);

      const response = await axios.post('http://localhost:5001/api/bookings', bookingData);
      
      if (response.data.success) {
        // Store booking ID for payment
        setCurrentBookingId(response.data.data._id);
        // Move to payment step
        setBookingStep(3);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert(`Error submitting booking: ${error.response?.data?.message || 'Please try again.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  // PayPal order creation
  const createOrder = async (data, actions) => {
    try {
      setPaymentProcessing(true);
      const response = await axios.post('http://localhost:5001/api/payments/create-order', {
        bookingId: currentBookingId,
        amount: totalCost
      });

      if (response.data.success) {
        return response.data.data.orderId;
      }
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      alert('Error creating payment order. Please try again.');
      // if the SDK failed earlier mark it
      if (error.response?.status === 503 || error.message?.includes('Network Error')) {
        setSdkLoadFailed(true);
      }
      throw error;
    }
  };

  // Fallback: create order and redirect to hosted PayPal checkout
  const handleHostedCheckout = async () => {
    try {
      setPaymentProcessing(true);
      const resp = await axios.post('http://localhost:5001/api/payments/create-order', {
        bookingId: currentBookingId,
        amount: totalCost
      });
      if (resp.data.success && resp.data.data.approveUrl) {
        // Redirect user to PayPal hosted checkout
        window.location.href = resp.data.data.approveUrl;
      } else {
        alert('Unable to start hosted PayPal checkout. Please try again later.');
      }
    } catch (err) {
      console.error('Hosted checkout error:', err);
      alert('Error initiating PayPal hosted checkout. Please try again later.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // PayPal payment approval
  const onApprove = async (data, actions) => {
    try {
      setPaymentProcessing(true);
      console.log('onApprove payload:', data);

      // Notify backend that PayPal approved the payment
      const payload = {
        appointmentId: currentBookingId,
        paypalOrderId: data.orderID,
        payerId: data.payerID,
        amount: parseFloat((totalCost / 300).toFixed(2)), // amount in USD used for PayPal order
        userId: user?._id || null
      };

      const endpoint = '/api/payments/complete';
      const response = await axios.post(`http://localhost:5001${endpoint}`, payload);

      console.log('Backend completion response:', response.data);

      if (response.data.success) {
        alert('Payment successful! Your booking has been confirmed. You will receive a confirmation email shortly.');
        navigate('/dashboard');
      } else {
        console.error('Payment completion failed on server:', response.data);
        alert('Payment completed by PayPal but server failed to record it. Please contact support.');
      }
    } catch (error) {
      console.error('Error completing payment with backend:', error);
      alert('Error processing payment. Please contact support.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // PayPal error handler
  const onError = (err) => {
    console.error('PayPal error:', err);
    alert('Payment failed. Please try again or use a different payment method.');
    setPaymentProcessing(false);
  };

  // PayPal cancel handler
  const onCancel = () => {
    alert('Payment cancelled. You can try again when ready.');
    setPaymentProcessing(false);
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinCheckOutDate = () => {
    if (!availabilityData.checkIn) return getTodayDate();
    const checkIn = new Date(availabilityData.checkIn);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="booking-loading">
        <div className="loading-spinner"></div>
        <p>Loading property details...</p>
        <p style={{ fontSize: '14px', color: '#666' }}>Property ID: {propertyId}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="booking-error">
        <h2>Property not found</h2>
        <p>The property you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/')} className="btn-back-home">
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Property Summary */}
        <div className="property-summary">
          <div className="property-summary-image">
            {property.images && property.images.length > 0 ? (
              <img src={property.images[0]} alt={property.title} />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>
          
          <div className="property-summary-details">
            <h2>{property.title}</h2>
            <p className="property-type">{property.propertyType}</p>
            <p className="property-location">📍 {property.address}, {property.city}</p>
            
            {numberOfNights > 0 && (
              <div className="cost-breakdown">
                <h3>Cost Breakdown</h3>
                <div className="cost-item">
                  <span>LKR {property.discount > 0 
                    ? Math.round(property.pricePerNight * (1 - property.discount / 100))
                    : property.pricePerNight} × {numberOfNights} nights × {availabilityData.rooms} room(s)</span>
                  <span>LKR {totalCost.toLocaleString()}</span>
                </div>
                <div className="cost-total">
                  <strong>Total: LKR {totalCost.toLocaleString()}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="booking-form">
          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step ${bookingStep >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-title">Availability</span>
            </div>
            <div className={`step ${bookingStep >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-title">Personal Information</span>
            </div>
          </div>

          {/* Step 1: Availability Selection */}
          {bookingStep === 1 && (
            <div className="booking-step">
              <h3>Select Your Stay Details</h3>
              
              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label>Check-in Date *</label>
                    <input
                      type="date"
                      name="checkIn"
                      value={availabilityData.checkIn}
                      onChange={handleAvailabilityChange}
                      min={getTodayDate()}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Check-out Date *</label>
                    <input
                      type="date"
                      name="checkOut"
                      value={availabilityData.checkOut}
                      onChange={handleAvailabilityChange}
                      min={getMinCheckOutDate()}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Number of Rooms *</label>
                    <select
                      name="rooms"
                      value={availabilityData.rooms}
                      onChange={handleAvailabilityChange}
                      required
                    >
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Adults *</label>
                    <select
                      name="adults"
                      value={availabilityData.adults}
                      onChange={handleAvailabilityChange}
                      required
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Children</label>
                    <select
                      name="children"
                      value={availabilityData.children}
                      onChange={handleAvailabilityChange}
                    >
                      {[0,1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num} Child{num > 1 ? 'ren' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {numberOfNights > 0 && (
                  <div className="stay-summary">
                    <p><strong>Total Length of Stay: {numberOfNights} night{numberOfNights > 1 ? 's' : ''}</strong></p>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button 
                  className="btn-next"
                  onClick={handleNext}
                  disabled={!validateStep1()}
                >
                  Continue to Personal Information
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {bookingStep === 2 && (
            <div className="booking-step">
              <h3>Personal Information</h3>
              
              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={personalInfo.firstName}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={personalInfo.lastName}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Country/Region *</label>
                    <select
                      name="country"
                      value={personalInfo.country}
                      onChange={handlePersonalInfoChange}
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={personalInfo.phoneNumber}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Who are you booking for? *</label>
                  <select
                    name="bookingFor"
                    value={personalInfo.bookingFor}
                    onChange={handlePersonalInfoChange}
                    required
                  >
                    <option value="myself">I'm the main guest</option>
                    <option value="someone-else">I'm booking for someone else</option>
                    <option value="business">Business/Work trip</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Smoking Preference</label>
                  <select
                    name="smokingPreference"
                    value={personalInfo.smokingPreference}
                    onChange={handlePersonalInfoChange}
                  >
                    <option value="non-smoking">Non-smoking room</option>
                    <option value="smoking">Smoking room</option>
                    <option value="no-preference">No preference</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Your Arrival Time (Optional)</label>
                  <select
                    name="arrivalTime"
                    value={personalInfo.arrivalTime}
                    onChange={handlePersonalInfoChange}
                  >
                    <option value="">Select arrival time</option>
                    <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                    <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
                    <option value="evening">Evening (5:00 PM - 9:00 PM)</option>
                    <option value="late">Late night (After 9:00 PM)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Requests (Optional)</label>
                  <textarea
                    name="specialRequests"
                    value={personalInfo.specialRequests}
                    onChange={handlePersonalInfoChange}
                    rows="3"
                    placeholder="Any special requests or requirements..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-back" onClick={handleBack}>
                  Back to Availability
                </button>
                <button 
                  className="btn-submit"
                  onClick={handleSubmitBooking}
                  disabled={!validateStep2() || submitting}
                >
                  {submitting ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {bookingStep === 3 && (
            <div className="step-3-payment">
              <h3>💳 Payment</h3>
              <p className="payment-subtitle">Complete your booking with secure PayPal payment</p>
              
              <div className="payment-summary">
                <h4>Booking Summary</h4>
                <div className="summary-item">
                  <span>Property:</span>
                  <span>{property.title}</span>
                </div>
                <div className="summary-item">
                  <span>Check-in:</span>
                  <span>{new Date(availabilityData.checkIn).toLocaleDateString()}</span>
                </div>
                <div className="summary-item">
                  <span>Check-out:</span>
                  <span>{new Date(availabilityData.checkOut).toLocaleDateString()}</span>
                </div>
                <div className="summary-item">
                  <span>Nights:</span>
                  <span>{numberOfNights}</span>
                </div>
                <div className="summary-item">
                  <span>Rooms:</span>
                  <span>{availabilityData.rooms}</span>
                </div>
                <div className="summary-item">
                  <span>Guests:</span>
                  <span>{availabilityData.adults} adults, {availabilityData.children} children</span>
                </div>
                <div className="summary-item total">
                  <span>Total Amount:</span>
                  <span className="total-amount">LKR {totalCost.toLocaleString()}</span>
                </div>
                <div className="summary-item" style={{ fontSize: '0.9em', color: '#666' }}>
                  <span>PayPal Amount:</span>
                  <span>≈ ${(totalCost / 300).toFixed(2)} USD</span>
                </div>
              </div>

              <div className="payment-section">
                <h4>Pay with PayPal</h4>
                
                {!paypalClientId ? (
                  <div className="payment-error" style={{ 
                    padding: '20px', 
                    background: '#fff3cd', 
                    border: '1px solid #ffc107',
                    borderRadius: '8px',
                    marginBottom: '15px'
                  }}>
                    <h5 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ PayPal Configuration Error</h5>
                    <p style={{ color: '#856404', marginBottom: '10px' }}>
                      PayPal payment is currently unavailable. Please contact support or try again later.
                    </p>
                    <p style={{ color: '#666', fontSize: '0.9em' }}>
                      Error: PayPal Client ID is not configured.
                    </p>
                  </div>
                ) : (
                  <>
                    {paymentProcessing && (
                      <div className="payment-processing">
                        <p>Processing payment...</p>
                      </div>
                    )}
                    
                    {(!sdkLoadFailed) ? (
                      <PayPalScriptProvider 
                        options={paypalOptions}
                        deferLoading={false}
                      >
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                          onCancel={onCancel}
                          style={{
                            layout: "vertical",
                            color: "gold",
                            shape: "rect",
                            label: "paypal"
                          }}
                          disabled={paymentProcessing}
                          forceReRender={[totalCost]}
                        />
                      </PayPalScriptProvider>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#333' }}>PayPal SDK unavailable — use hosted checkout</p>
                        <button className="btn-paypal-hosted" onClick={handleHostedCheckout} disabled={paymentProcessing}>
                          {paymentProcessing ? 'Redirecting...' : 'Pay on PayPal'}
                        </button>
                      </div>
                    )}
                    
                    <div style={{ 
                      marginTop: '15px', 
                      padding: '15px', 
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      fontSize: '0.9em',
                      color: '#666'
                    }}>
                      <p style={{ marginBottom: '10px' }}>
                        <strong>Having trouble with PayPal?</strong>
                      </p>
                      <ul style={{ marginLeft: '20px', marginBottom: '0' }}>
                        <li>Make sure you have a PayPal sandbox account</li>
                        <li>Try refreshing the page (F5)</li>
                        <li>Check your internet connection</li>
                        <li>Clear browser cache and try again</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>

              <div className="payment-security-notice">
                <p>🔒 Your payment is secure and encrypted</p>
                <p>✓ Money-back guarantee | ✓ Secure transaction | ✓ Instant confirmation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;