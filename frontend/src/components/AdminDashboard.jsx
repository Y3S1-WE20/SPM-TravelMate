import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyTable from './PropertyTable';
import BookingTable from './BookingTable';
import StatsDashboard from './StatsDashboard';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [bookingStats, setBookingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [bookingFilter, setBookingFilter] = useState('all'); // all, pending, confirmed, cancelled, completed
  const [vehicleReservations, setVehicleReservations] = useState([]);

  useEffect(() => {
    fetchProperties();
    fetchStats();
    if (activeTab === 'bookings') {
      fetchBookings();
      fetchBookingStats();
    }
    if (activeTab === 'vehicleReservations') {
      fetchVehicleReservations();
    }
  }, [filter, bookingFilter, activeTab]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const statusFilter = filter === 'all' ? '' : filter;
      const response = await axios.get(`http://localhost:5001/api/properties?status=${statusFilter}`);
      setProperties(response.data.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/properties/stats/summary');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const statusFilter = bookingFilter === 'all' ? '' : bookingFilter;
      const response = await axios.get(`http://localhost:5001/api/bookings?status=${statusFilter}&limit=50`);
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingStats = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/bookings/stats/summary');
      setBookingStats(response.data.data);
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    }
  };

  const fetchVehicleReservations = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/vehicles/reservations/all');
      if (res.data.success) setVehicleReservations(res.data.reservations);
    } catch (err) {
      console.error('Error fetching vehicle reservations', err);
    }
  };

  const handleStatusUpdate = async (propertyId, status, notes = '') => {
    try {
      await axios.patch(`http://localhost:5001/api/properties/${propertyId}/status`, {
        status,
        adminNotes: notes
      });
      
      // Refresh data
      fetchProperties();
      fetchStats();
    } catch (error) {
      console.error('Error updating property status:', error);
      alert('Failed to update property status');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    // Find the property to get its title for the confirmation
    const property = properties.find(p => p._id === propertyId);
    const propertyTitle = property ? property.title : 'this property';
    
    if (window.confirm(`Are you sure you want to permanently delete "${propertyTitle}"?\n\nThis action cannot be undone and will remove all associated data including images.`)) {
      try {
        await axios.delete(`http://localhost:5001/api/properties/${propertyId}`);
        
        // Refresh data
        fetchProperties();
        fetchStats();
        alert('Property deleted successfully');
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5001/api/bookings/${bookingId}/status`, { status: newStatus });
      await fetchBookings();
      await fetchBookingStats();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5001/api/bookings/${bookingId}`);
        await fetchBookings();
        await fetchBookingStats();
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  if (loading && activeTab === 'properties') {
    return <div className="loading">Loading properties...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'properties' ? 'active' : ''}
          onClick={() => setActiveTab('properties')}
        >
          Property Management
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Booking Management
        </button>
        <button 
          className={activeTab === 'vehicleReservations' ? 'active' : ''}
          onClick={() => setActiveTab('vehicleReservations')}
        >
          Vehicle Reservations
        </button>
      </div>

      {activeTab === 'dashboard' && stats && (
        <StatsDashboard stats={stats} bookingStats={bookingStats} />
      )}

      {activeTab === 'properties' && (
        <div className="property-management">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-primary" onClick={() => window.location.href = '/admin/add-vehicle'}>Add Vehicle</button>
          </div>
          <div className="filter-controls">
            <label>Filter by status:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Properties</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <PropertyTable 
            properties={properties} 
            onStatusUpdate={handleStatusUpdate}
            onDeleteProperty={handleDeleteProperty}
            showActions={true}
          />
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="booking-management">
          <div className="filter-controls">
            <label>Filter by status:</label>
            <select value={bookingFilter} onChange={(e) => setBookingFilter(e.target.value)}>
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div className="loading">Loading bookings...</div>
          ) : (
            <BookingTable 
              bookings={bookings}
              onStatusUpdate={handleBookingStatusUpdate}
              onDeleteBooking={handleDeleteBooking}
            />
          )}
        </div>
      )}

      {activeTab === 'vehicleReservations' && (
        <div className="vehicle-reservations">
          <h2>Vehicle Reservations</h2>
          {vehicleReservations.length === 0 ? (
            <p>No vehicle reservations yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vehicle</th>
                  <th>Guest</th>
                  <th>Pick-up</th>
                  <th>Drop-off</th>
                  <th>Days</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vehicleReservations.map(r => (
                  <tr key={r._id}>
                    <td>{r._id}</td>
                    <td>{r.vehicleTitle}</td>
                    <td>{r.guestInfo.firstName} {r.guestInfo.lastName}<br/>{r.guestInfo.email}</td>
                    <td>{new Date(r.pickUpDate).toLocaleDateString()}</td>
                    <td>{new Date(r.dropOffDate).toLocaleDateString()}</td>
                    <td>{r.totalDays}</td>
                    <td>{r.totalCost}</td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;