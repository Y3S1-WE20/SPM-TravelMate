import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './GroupBookingForm.css';

export default function GroupBookingForm({ pkg }) {
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [message, setMessage] = useState(null);
  const [responseSnippet, setResponseSnippet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    const totalPrice = numberOfPeople * pkg.pricePerPerson;
    
    if (!pkg || !pkg._id) {
      setMessage({ text: 'Booking failed: package id is missing.', type: 'error' });
      console.error('GroupBookingForm: pkg or pkg._id is missing', pkg);
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setResponseSnippet(null);

    try {
      const url = `/api/packages/${pkg._id}/book`;
      console.log('Posting booking to', url, 'body:', { numberOfPeople, contactEmail, contactPhone, totalPrice });
      const body = { numberOfPeople, contactEmail, contactPhone, totalPrice };
      // include userId if available so backend can associate booking with a user
      if (user && user._id) body.userId = user._id;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ text: '🎉 Booking created successfully! We will contact you shortly to confirm your booking.', type: 'success' });
          // Reset form on success
          setNumberOfPeople(1);
          setContactEmail('');
          setContactPhone('');
        } else {
          setMessage({ text: 'Booking failed: ' + (data.message || `status ${res.status}`), type: 'error' });
        }
      } else {
        const text = await res.text();
        const snippet = text.slice(0, 2000);
        setResponseSnippet(snippet);
        setMessage({ text: `Booking failed: server returned non-JSON response (status ${res.status}). Showing snippet.`, type: 'error' });
      }
    } catch (err) {
      const msg = err.message || String(err);
      setMessage({ text: 'Booking failed: ' + msg, type: 'error' });
      console.error('GroupBookingForm error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = numberOfPeople * pkg.pricePerPerson;

  return (
    <div className="booking-form-container">
      <div className="booking-header">
        <h3>Book This Package</h3>
        <div className="price-summary">
          <span className="price-label">Total Price</span>
          <span className="total-price">${totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={submit} className="booking-form">
        <div className="form-section">
          <h4 className="section-title">Group Details</h4>
          
          <div className="form-group">
            <label className="form-label">
              Number of People
              <span className="required">*</span>
            </label>
            <div className="input-with-info">
              <input
                type="number"
                min="1"
                max={pkg.capacity || 50}
                value={numberOfPeople}
                onChange={e => setNumberOfPeople(Number(e.target.value))}
                className="form-input"
                required
                disabled={isSubmitting}
              />
              {pkg.capacity && (
                <span className="capacity-info">Max: {pkg.capacity} people</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4 className="section-title">Contact Information</h4>
          
          <div className="form-group">
            <label className="form-label">
              Contact Email
              <span className="required">*</span>
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              className="form-input"
              placeholder="your.email@example.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Contact Phone
              <span className="required">*</span>
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              className="form-input"
              placeholder="+1 (555) 123-4567"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="price-breakdown">
          <h4 className="section-title">Price Breakdown</h4>
          <div className="breakdown-item">
            <span>${pkg.pricePerPerson} × {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
          <div className="breakdown-total">
            <span>Total Amount</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <button 
          type="submit" 
          className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="button-spinner"></div>
              Processing Booking...
            </>
          ) : (
            `Confirm Booking - $${totalPrice.toLocaleString()}`
          )}
        </button>

        <div className="booking-note">
          <p>📞 You'll receive a confirmation email and our team will contact you within 24 hours to finalize your booking details.</p>
        </div>
      </form>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {responseSnippet && (
        <div className="response-snippet">
          <div className="snippet-header">
            <strong>Server Response Snippet</strong>
            <span>(first 2000 characters)</span>
          </div>
          <pre>{responseSnippet}</pre>
        </div>
      )}
    </div>
  );
}