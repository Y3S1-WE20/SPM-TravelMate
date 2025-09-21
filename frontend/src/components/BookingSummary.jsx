import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaBed, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle, FaPrint, FaHome } from 'react-icons/fa';
import './BookingSummary.css';

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Get booking data from location state or redirect if no data
    if (location.state && location.state.bookingData) {
      setBookingData(location.state.bookingData);
    } else {
      // If no booking data, redirect to home
      navigate('/');
    }
  }, [location.state, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleBackHome = () => {
    navigate('/');
  };

  if (!bookingData) {
    return (
      <div className="booking-summary-container">
        <div className="loading">Loading booking summary...</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="booking-summary-container">
      <div className="booking-summary-content">
        {/* Header */}
        <div className="summary-header">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h1>Booking Confirmed!</h1>
          <p className="confirmation-message">
            Thank you for your booking. We've sent a confirmation email to {bookingData.guestInfo.email}
          </p>
          <div className="booking-reference">
            <strong>Booking Reference: #{bookingData.bookingId || 'TM' + Date.now().toString().slice(-6)}</strong>
          </div>
        </div>

        {/* Property Information */}
        <div className="summary-section">
          <h2>Property Details</h2>
          <div className="property-info">
            {bookingData.propertyImage && (
              <div className="property-image">
                <img src={bookingData.propertyImage} alt={bookingData.propertyTitle} />
              </div>
            )}
            <div className="property-details">
              <h3>{bookingData.propertyTitle}</h3>
              <p><FaMapMarkerAlt /> {bookingData.propertyLocation || 'Location details will be provided upon confirmation'}</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="summary-section">
          <h2>Booking Details</h2>
          <div className="booking-details-grid">
            <div className="detail-item">
              <FaCalendarAlt className="detail-icon" />
              <div>
                <strong>Check-in</strong>
                <p>{formatDate(bookingData.checkIn)}</p>
                <small>From 3:00 PM</small>
              </div>
            </div>
            <div className="detail-item">
              <FaCalendarAlt className="detail-icon" />
              <div>
                <strong>Check-out</strong>
                <p>{formatDate(bookingData.checkOut)}</p>
                <small>Until 11:00 AM</small>
              </div>
            </div>
            <div className="detail-item">
              <FaBed className="detail-icon" />
              <div>
                <strong>Accommodation</strong>
                <p>{bookingData.rooms} Room{bookingData.rooms > 1 ? 's' : ''}</p>
                <small>{bookingData.numberOfNights} night{bookingData.numberOfNights > 1 ? 's' : ''}</small>
              </div>
            </div>
            <div className="detail-item">
              <FaUsers className="detail-icon" />
              <div>
                <strong>Guests</strong>
                <p>{bookingData.adults} Adult{bookingData.adults > 1 ? 's' : ''}</p>
                {bookingData.children > 0 && <small>{bookingData.children} Child{bookingData.children > 1 ? 'ren' : ''}</small>}
              </div>
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div className="summary-section">
          <h2>Guest Information</h2>
          <div className="guest-info">
            <div className="guest-details">
              <h3>{bookingData.guestInfo.firstName} {bookingData.guestInfo.lastName}</h3>
              <p><FaEnvelope /> {bookingData.guestInfo.email}</p>
              <p><FaPhone /> {bookingData.guestInfo.phoneNumber}</p>
              <p><FaMapMarkerAlt /> {bookingData.guestInfo.country}</p>
              
              {bookingData.guestInfo.specialRequests && (
                <div className="special-requests">
                  <strong>Special Requests:</strong>
                  <p>{bookingData.guestInfo.specialRequests}</p>
                </div>
              )}
              
              <div className="preferences">
                <p><strong>Booking for:</strong> {bookingData.guestInfo.bookingFor}</p>
                <p><strong>Room preference:</strong> {bookingData.guestInfo.smokingPreference}</p>
                {bookingData.guestInfo.arrivalTime && (
                  <p><strong>Expected arrival:</strong> {bookingData.guestInfo.arrivalTime}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="summary-section">
          <h2>Cost Summary</h2>
          <div className="cost-breakdown">
            <div className="cost-item">
              <span>Room rate ({bookingData.numberOfNights} night{bookingData.numberOfNights > 1 ? 's' : ''})</span>
              <span>{formatCurrency(bookingData.totalCost)}</span>
            </div>
            <div className="cost-item taxes">
              <span>Taxes & fees</span>
              <span>Included</span>
            </div>
            <div className="cost-total">
              <span><strong>Total Amount</strong></span>
              <span><strong>{formatCurrency(bookingData.totalCost)}</strong></span>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="summary-section">
          <h2>Important Information</h2>
          <div className="important-info">
            <ul>
              <li>Your booking is confirmed and guaranteed</li>
              <li>A confirmation email has been sent to your email address</li>
              <li>Please bring a valid ID and credit card for check-in</li>
              <li>Cancellation policy: Free cancellation up to 24 hours before check-in</li>
              <li>For any changes or questions, please contact us at support@travelmate.com</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="summary-actions">
          <button className="btn btn-secondary" onClick={handlePrint}>
            <FaPrint /> Print Confirmation
          </button>
          <button className="btn btn-primary" onClick={handleBackHome}>
            <FaHome /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;