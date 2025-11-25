import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminPackageBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`/api/packages/bookings/${id}`)
      .then((r) => r.json())
      .then((d) => setBooking(d.data))
      .catch((err) => setMessage('Failed to load booking: ' + err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const res = await fetch(`/api/packages/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message || 'Updated');
        setBooking(data.data);
      } else setMessage('Failed: ' + (data.message || 'unknown'));
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found.</div>;

  return (
    <div>
      <h2>Booking Detail</h2>
      <div><strong>Package:</strong> {booking.packageId?.title}</div>
      <div><strong>User:</strong> {booking.userId?.email || booking.userId}</div>
      <div><strong>People:</strong> {booking.numberOfPeople}</div>
      <div><strong>Contact:</strong> {booking.contactEmail} / {booking.contactPhone}</div>
      <div><strong>Total:</strong> ${booking.totalPrice}</div>
      <div><strong>Status:</strong> {booking.status}</div>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => updateStatus('confirmed')} style={{ marginRight: 8 }}>Approve</button>
        <button onClick={() => updateStatus('cancelled')} style={{ marginRight: 8 }}>Reject</button>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
