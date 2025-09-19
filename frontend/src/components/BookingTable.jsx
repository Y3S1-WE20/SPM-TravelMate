import React, { useState } from 'react';
import './BookingTable.css';

const BookingTable = ({ bookings, onStatusUpdate, onDeleteBooking, showActions = false }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmNotes, setConfirmNotes] = useState('');

  const handleStatusChange = (bookingId, status) => {
    if (status === 'confirmed') {
      const booking = bookings.find(b => b._id === bookingId);
      setSelectedBooking(booking);
      setConfirmNotes('');
    } else {
      onStatusUpdate(bookingId, status);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedBooking) {
      onStatusUpdate(selectedBooking._id, 'confirmed', confirmNotes);
      setSelectedBooking(null);
      setConfirmNotes('');
    }
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setConfirmNotes('');
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      cancelled: 'status-cancelled',
      completed: 'status-completed'
    };
    
    return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `LKR ${amount.toLocaleString()}`;
  };

  return (
    <div className="booking-table-container">
      <table className="booking-table">
        <thead>
          <tr>
            <th>Booking Ref</th>
            <th>Guest Name</th>
            <th>Property</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Guests</th>
            <th>Nights</th>
            <th>Total Cost</th>
            <th>Status</th>
            <th>Booking Date</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking._id}>
              <td className="booking-reference">
                <strong>{booking.bookingReference}</strong>
              </td>
              <td>
                <div className="guest-info">
                  <div className="guest-name">
                    {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                  </div>
                  <div className="guest-email">{booking.guestInfo.email}</div>
                  <div className="guest-phone">{booking.guestInfo.phoneNumber}</div>
                </div>
              </td>
              <td>
                <div className="property-info">
                  {booking.propertyImage && (
                    <img 
                      src={booking.propertyImage} 
                      alt={booking.propertyTitle} 
                      className="property-thumbnail"
                    />
                  )}
                  <div className="property-details">
                    <div className="property-title">{booking.propertyTitle}</div>
                    <div className="property-location">{booking.guestInfo.country}</div>
                  </div>
                </div>
              </td>
              <td>{formatDate(booking.checkIn)}</td>
              <td>{formatDate(booking.checkOut)}</td>
              <td>
                <div className="guest-count">
                  <div>{booking.adults} Adult{booking.adults > 1 ? 's' : ''}</div>
                  {booking.children > 0 && (
                    <div>{booking.children} Child{booking.children > 1 ? 'ren' : ''}</div>
                  )}
                  <div>{booking.rooms} Room{booking.rooms > 1 ? 's' : ''}</div>
                </div>
              </td>
              <td>{booking.numberOfNights}</td>
              <td className="cost-amount">{formatCurrency(booking.totalCost)}</td>
              <td>{getStatusBadge(booking.status)}</td>
              <td>{formatDate(booking.bookingDate)}</td>
              {showActions && (
                <td>
                  <div className="booking-actions">
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          className="btn-confirm"
                          onClick={() => handleStatusChange(booking._id, 'confirmed')}
                        >
                          ✓ Confirm
                        </button>
                        <button 
                          className="btn-cancel"
                          onClick={() => handleStatusChange(booking._id, 'cancelled')}
                        >
                          ✗ Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button 
                        className="btn-complete"
                        onClick={() => handleStatusChange(booking._id, 'completed')}
                      >
                        ✓ Complete
                      </button>
                    )}
                    <button 
                      className="btn-delete-booking"
                      onClick={() => onDeleteBooking(booking._id)}
                      title="Delete Booking"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {bookings.length === 0 && (
        <div className="no-bookings">No bookings found</div>
      )}

      {/* Confirm Modal */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Booking</h3>
            <p>Confirm booking for <strong>{selectedBooking.guestInfo.firstName} {selectedBooking.guestInfo.lastName}</strong>?</p>
            <div className="booking-summary">
              <p><strong>Property:</strong> {selectedBooking.propertyTitle}</p>
              <p><strong>Dates:</strong> {formatDate(selectedBooking.checkIn)} - {formatDate(selectedBooking.checkOut)}</p>
              <p><strong>Total:</strong> {formatCurrency(selectedBooking.totalCost)}</p>
            </div>
            <textarea
              placeholder="Add confirmation notes (optional)..."
              value={confirmNotes}
              onChange={(e) => setConfirmNotes(e.target.value)}
              rows="3"
            />
            <div className="modal-actions">
              <button onClick={closeModal}>Cancel</button>
              <button 
                className="btn-confirm-booking"
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;