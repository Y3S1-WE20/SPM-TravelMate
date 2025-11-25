import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminPackageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/packages/bookings/all')
      .then((r) => r.json())
      .then((d) => {
        setBookings(d.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div>
      <h2>Package Bookings</h2>
      {bookings.length === 0 && <p>No bookings found.</p>}
      <ul>
        {bookings.map((b) => (
          <li key={b._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
            <div><strong>Package:</strong> {b.packageId?.title || b.packageId}</div>
            <div><strong>User:</strong> {b.userId?.email || b.userId}</div>
            <div><strong>People:</strong> {b.numberOfPeople}</div>
            <div><strong>Status:</strong> {b.status}</div>
            <div><Link to={`/admin/package-bookings/${b._id}`}>View / Manage</Link></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
