import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import StatCard from './StatCard';
import DataTable from './DataTable';
import AddPropertyForm from './AddPropertyForm';
import './Dashboard.css';

const HotelOwnerDashboard = () => {
  const { user, logout, api } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter] = useState('all');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchOwnerProperties = useCallback(async () => {
    const userId = user._id || user.id;
    if (!userId) return;

    try {
      setLoading(true);
      const response = await api.get(`/api/properties/owner/${userId}`);
      setProperties(response.data.data || []);
    } catch (error) {
      console.error('Error fetching owner properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [user, api]);

  const fetchOwnerBookings = useCallback(async () => {
    const userId = user._id || user.id;
    if (!userId) return;

    try {
      const statusFilter = bookingFilter === 'all' ? '' : bookingFilter;
      const response = await api.get(`/api/users/${userId}/bookings?status=${statusFilter}&limit=50`);
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
      setBookings([]);
    }
  }, [user, api, bookingFilter]);

  const fetchOwnerStats = useCallback(async () => {
    const userId = user._id || user.id;
    if (!userId) return;

    try {
      // Calculate stats from properties and bookings data
      const totalProperties = properties.length;
      const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in').length;
      const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const averageRating = properties.length > 0
        ? properties.reduce((sum, p) => sum + (p.averageRating || 0), 0) / properties.length
        : 0;

      setStats({
        totalProperties,
        activeBookings,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10
      });
    } catch (error) {
      console.error('Error calculating owner stats:', error);
      setStats({
        totalProperties: properties.length,
        activeBookings: bookings.filter(b => b.status === 'confirmed').length,
        totalRevenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        averageRating: 0
      });
    }
  }, [user, properties, bookings]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOwnerProperties();
    fetchOwnerBookings();
  }, [user, navigate, bookingFilter, fetchOwnerProperties, fetchOwnerBookings]);

  useEffect(() => {
    // Calculate stats after properties and bookings are loaded
    fetchOwnerStats();
  }, [properties, bookings, fetchOwnerStats]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'properties', label: 'My Properties', icon: '🏨', badge: properties.length },
    { id: 'bookings', label: 'Booking Management', icon: '📅', badge: bookings.length },
    { id: 'add-property', label: 'Add Property', icon: '➕' }
  ];

  const headerActions = [
    {
      label: 'View All Properties',
      icon: '🔍',
      variant: 'btn-primary',
      onClick: () => navigate('/')
    },
    {
      label: 'Logout',
      icon: '🚪',
      variant: 'btn-secondary',
      onClick: handleLogout
    }
  ];

  const propertyColumns = [
    {
      key: 'images',
      label: 'Property',
      width: '30%',
      render: (value, item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={value && value.length > 0 ? `http://localhost:5001${value[0]}` : '/placeholder.jpg'}
            alt={item.title}
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
          <div>
            <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              📍 {item.city}, {item.address}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price/Night',
      width: '15%',
      render: (value) => (
        <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (value) => (
        <span className={`status-badge ${value?.toLowerCase()}`}>
          {value || 'Unknown'}
        </span>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      width: '15%',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>⭐</span>
          <span>{value || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Listed',
      width: '15%',
      render: (value) => (
        <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
          {formatDate(value)}
        </span>
      )
    }
  ];

  const propertyActions = [
    {
      label: 'Edit',
      icon: '✏️',
      variant: 'btn-secondary',
      onClick: (property) => navigate(`/edit-property/${property._id}`)
    },
    {
      label: 'View',
      icon: '👁️',
      variant: 'btn-primary',
      onClick: (property) => navigate(`/property/${property._id}`)
    }
  ];

  const bookingColumns = [
    {
      key: 'propertyId',
      label: 'Property',
      width: '25%',
      render: (value) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
            {value?.title || 'Property Details Not Available'}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
            📍 {value?.city}, {value?.address}
          </div>
        </div>
      )
    },
    {
      key: 'guestInfo',
      label: 'Guest',
      width: '20%',
      render: (value) => (
        <div>
          <div style={{ fontWeight: '600' }}>
            {value?.firstName} {value?.lastName}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
            {value?.email}
          </div>
        </div>
      )
    },
    {
      key: 'checkIn',
      label: 'Check-in / Check-out',
      width: '20%',
      render: (value, item) => (
        <div>
          <div style={{ fontSize: '0.875rem' }}>
            📅 {formatDate(value)} - {formatDate(item.checkOut)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
            {item.nights} night{item.nights > 1 ? 's' : ''}
          </div>
        </div>
      )
    },
    {
      key: 'guests',
      label: 'Guests',
      width: '10%',
      render: (value) => (
        <span>👥 {value} guest{value > 1 ? 's' : ''}</span>
      )
    },
    {
      key: 'totalAmount',
      label: 'Revenue',
      width: '15%',
      render: (value) => (
        <span style={{ fontWeight: '600', color: 'var(--success-color)' }}>
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => (
        <span className={`status-badge ${value?.toLowerCase()}`}>
          {value || 'Unknown'}
        </span>
      )
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
      title={`Welcome back, ${user.firstName || user.username}!`}
      subtitle="Manage your properties and track your business performance"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerActions={headerActions}
    >
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Business Overview */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Business Overview</h3>
              <p className="card-subtitle">Your hotel performance at a glance</p>
            </div>
            <div className="card-content">
              <div className="stats-grid">
                <StatCard
                  title="Total Properties"
                  value={stats?.totalProperties || properties.length}
                  icon="🏨"
                  variant="primary"
                />
                <StatCard
                  title="Active Bookings"
                  value={stats?.activeBookings || bookings.filter(b => b.status === 'confirmed').length}
                  icon="📅"
                  variant="success"
                />
                <StatCard
                  title="Total Revenue"
                  value={stats?.totalRevenue || bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)}
                  icon="💰"
                  variant="info"
                />
                <StatCard
                  title="Average Rating"
                  value={stats?.averageRating || 0}
                  icon="⭐"
                  variant="warning"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="card-content">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <button
                  onClick={() => setActiveTab('add-property')}
                  className="btn btn-primary"
                  style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>🏨</span>
                  Add New Property
                </button>
                <button
                  onClick={() => setActiveTab('properties')}
                  className="btn btn-success"
                  style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>📋</span>
                  Manage Properties
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="btn btn-warning"
                  style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>📊</span>
                  View Bookings
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-info"
                  style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>🔍</span>
                  View Public Site
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
            </div>
            <div className="card-content">
              {bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <div className="empty-title">No Recent Bookings</div>
                  <div className="empty-description">
                    Your properties haven't received any bookings yet. Start by adding more properties or improving your listings.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {bookings.slice(0, 5).map((booking, index) => (
                    <div
                      key={booking._id}
                      style={{
                        padding: '12px',
                        border: '1px solid var(--gray-200)',
                        borderRadius: '8px',
                        background: 'var(--gray-50)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontWeight: '600' }}>
                            {booking.propertyId?.title}
                          </span>
                          <span style={{ marginLeft: '8px', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                            by {booking.guestInfo?.firstName} {booking.guestInfo?.lastName}
                          </span>
                        </div>
                        <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: '4px' }}>
                        📅 {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)} • {formatCurrency(booking.totalAmount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'properties' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DataTable
            title="My Properties"
            columns={propertyColumns}
            data={properties}
            loading={loading}
            actions={propertyActions}
            emptyMessage="You haven't listed any properties yet. Start by adding your first property!"
            emptyIcon="🏨"
          />
        </motion.div>
      )}

      {activeTab === 'bookings' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DataTable
            title="Booking Management"
            columns={bookingColumns}
            data={bookings}
            loading={false}
            filters={bookingFilters}
            emptyMessage="No bookings found for your properties."
            emptyIcon="📅"
          />
        </motion.div>
      )}

      {activeTab === 'add-property' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Add New Property</h3>
              <p className="card-subtitle">List a new property on TravelMate</p>
            </div>
            <div className="card-content">
              <AddPropertyForm onSuccess={() => {
                fetchOwnerProperties();
                fetchOwnerStats();
                setActiveTab('properties');
              }} />
            </div>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default HotelOwnerDashboard;