import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from './DashboardLayout';
import StatCard from './StatCard';
import DataTable from './DataTable';
import StatsDashboard from './StatsDashboard';
import './Dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [bookingStats, setBookingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, _setFilter] = useState('all');
  const [bookingFilter, _setBookingFilter] = useState('all');
  const [vehicleReservations, setVehicleReservations] = useState([]);

  useEffect(() => {
    // Intentionally not including fetch functions in deps to avoid re-creating them;
    // they are stable in this component's lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchProperties();
    fetchStats();
    if (activeTab === 'bookings') {
      fetchBookings();
      fetchBookingStats();
    }
    if (activeTab === 'vehicles') {
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
    const property = properties.find(p => p._id === propertyId);
    const propertyTitle = property ? property.title : 'this property';

    if (window.confirm(`Are you sure you want to permanently delete "${propertyTitle}"?\n\nThis action cannot be undone and will remove all associated data including images.`)) {
      try {
        await axios.delete(`http://localhost:5001/api/properties/${propertyId}`);
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'properties', label: 'Property Management', icon: '🏨', badge: properties.length },
    { id: 'bookings', label: 'Booking Management', icon: '📅', badge: bookings.length },
    { id: 'vehicles', label: 'Vehicle Reservations', icon: '🚗', badge: vehicleReservations.length }
  ];

  const headerActions = [
    {
      label: 'Add Vehicle',
      icon: '➕',
      variant: 'btn-success',
      onClick: () => window.location.href = '/admin/add-vehicle'
    }
  ];

  const propertyColumns = [
    { key: 'title', label: 'Property Title', width: '25%' },
    { key: 'owner', label: 'Owner', width: '20%', render: (value) => value?.username || 'N/A' },
    { key: 'city', label: 'Location', width: '15%' },
    { key: 'price', label: 'Price (LKR)', width: '15%', render: (value) => value?.toLocaleString() || 'N/A' },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (value) => (
        <span className={`status-badge ${value?.toLowerCase()}`}>
          {value || 'Unknown'}
        </span>
      )
    }
  ];

  const propertyActions = [
    {
      label: 'Approve',
      icon: '✅',
      variant: 'btn-success',
      onClick: (property) => handleStatusUpdate(property._id, 'approved'),
      disabled: (property) => property.status === 'approved'
    },
    {
      label: 'Reject',
      icon: '❌',
      variant: 'btn-error',
      onClick: (property) => handleStatusUpdate(property._id, 'rejected'),
      disabled: (property) => property.status === 'rejected'
    },
    {
      label: 'Delete',
      icon: '🗑️',
      variant: 'btn-error',
      onClick: (property) => handleDeleteProperty(property._id)
    }
  ];

  const bookingColumns = [
    { key: 'bookingReference', label: 'Booking ID', width: '15%' },
    { key: 'propertyId', label: 'Property', width: '25%', render: (value) => value?.title || 'N/A' },
    { key: 'guestInfo', label: 'Guest', width: '20%', render: (value) => `${value?.firstName || ''} ${value?.lastName || ''}`.trim() || 'N/A' },
    { key: 'checkIn', label: 'Check-in', width: '15%', render: (value) => new Date(value).toLocaleDateString() },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (value) => (
        <span className={`status-badge ${value?.toLowerCase()}`}>
          {value || 'Unknown'}
        </span>
      )
    }
  ];

  const bookingActions = [
    {
      label: 'Confirm',
      icon: '✅',
      variant: 'btn-success',
      onClick: (booking) => handleBookingStatusUpdate(booking._id, 'confirmed'),
      disabled: (booking) => booking.status === 'confirmed'
    },
    {
      label: 'Cancel',
      icon: '❌',
      variant: 'btn-error',
      onClick: (booking) => handleBookingStatusUpdate(booking._id, 'cancelled'),
      disabled: (booking) => booking.status === 'cancelled'
    },
    {
      label: 'Delete',
      icon: '🗑️',
      variant: 'btn-error',
      onClick: (booking) => handleDeleteBooking(booking._id)
    }
  ];

  const vehicleColumns = [
    { key: '_id', label: 'ID', width: '15%' },
    { key: 'vehicleTitle', label: 'Vehicle', width: '20%' },
    { key: 'guestInfo', label: 'Guest', width: '25%', render: (value) => `${value?.firstName || ''} ${value?.lastName || ''}`.trim() || 'N/A' },
    { key: 'pickUpDate', label: 'Pick-up', width: '15%', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'dropOffDate', label: 'Drop-off', width: '15%', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'totalCost', label: 'Total (LKR)', width: '10%', render: (value) => value?.toLocaleString() || 'N/A' }
  ];

  const propertyFilters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Properties' },
        { value: 'pending', label: 'Pending Approval' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' }
      ]
    }
  ];

  const bookingFilters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Bookings' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'checked-in', label: 'Checked In' },
        { value: 'checked-out', label: 'Checked Out' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    }
  ];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Manage properties, bookings, and system operations"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerActions={headerActions}
    >
      {activeTab === 'overview' && stats && (
        <div className="fade-in">
          <StatsDashboard stats={stats} bookingStats={bookingStats} />

          {/* Quick Stats Overview */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Quick Overview</h3>
            </div>
            <div className="card-content">
              <div className="stats-grid">
                <StatCard
                  title="Total Properties"
                  value={stats.total}
                  icon="🏨"
                  variant="primary"
                />
                <StatCard
                  title="Pending Approvals"
                  value={stats.pending}
                  icon="⏳"
                  variant="warning"
                />
                <StatCard
                  title="Active Properties"
                  value={stats.approved}
                  icon="✅"
                  variant="success"
                />
                <StatCard
                  title="Total Revenue"
                  value={bookingStats?.totalRevenue || 0}
                  icon="💰"
                  variant="info"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'properties' && (
        <div className="fade-in">
          <DataTable
            title="Property Management"
            columns={propertyColumns}
            data={properties}
            loading={loading}
            actions={propertyActions}
            filters={propertyFilters}
            emptyMessage="No properties found"
            emptyIcon="🏨"
          />
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="fade-in">
          <DataTable
            title="Booking Management"
            columns={bookingColumns}
            data={bookings}
            loading={loading}
            actions={bookingActions}
            filters={bookingFilters}
            emptyMessage="No bookings found"
            emptyIcon="📅"
          />
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="fade-in">
          <DataTable
            title="Vehicle Reservations"
            columns={vehicleColumns}
            data={vehicleReservations}
            loading={false}
            emptyMessage="No vehicle reservations found"
            emptyIcon="🚗"
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;