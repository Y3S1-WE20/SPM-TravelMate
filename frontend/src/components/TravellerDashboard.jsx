import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import StatCard from './StatCard';
import DataTable from './DataTable';
import ProfileSettings from './ProfileSettings';
import MyReviews from './MyReviews';
import './Dashboard.css';

const TravellerDashboard = () => {
  const { user, logout, api } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserBookings();
    fetchUserFavorites();
  }, [user, navigate, bookingFilter]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchUserBookings = async () => {
    const userId = user._id || user.id;
    if (!userId) return;

    try {
      setLoading(true);
      const statusFilter = bookingFilter === 'all' ? '' : bookingFilter;
      const response = await api.get(`/api/users/${userId}/bookings?status=${statusFilter}&limit=50`);
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      try {
        const statusFilter = bookingFilter === 'all' ? '' : bookingFilter;
        const response = await api.get(`/api/bookings?email=${user.email}&status=${statusFilter}&limit=50`);
        setBookings(response.data.data || []);
      } catch (fallbackError) {
        console.error('Error fetching bookings with email:', fallbackError);
        setBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    const userId = user._id || user.id;
    if (!userId) return;

    try {
      setFavoritesLoading(true);
      const response = await api.get(`/api/users/${userId}/favorites`);
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const removeFromFavorites = async (propertyId) => {
    const userId = user._id || user.id;
    if (!userId) return;

    try {
      await api.delete(`/api/users/${userId}/favorites/${propertyId}`);
      setFavorites(prev => prev.filter(property => property._id !== propertyId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Failed to remove from favorites. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'checked-in': return '#17a2b8';
      case 'checked-out': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#007bff';
    }
  };

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
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'bookings', label: 'My Bookings', icon: '📅', badge: bookings.length },
    { id: 'favorites', label: 'My Favorites', icon: '❤️', badge: favorites.length },
    { id: 'reviews', label: 'My Reviews', icon: '⭐' },
    { id: 'profile', label: 'Profile Settings', icon: '⚙️' }
  ];

  const headerActions = [
    {
      label: 'Explore Hotels',
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
      key: 'bookingReference',
      label: 'Booking ID',
      width: '15%',
      render: (value) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
          {value}
        </span>
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
      label: 'Total',
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
      width: '15%',
      render: (value) => (
        <span className={`status-badge ${value?.toLowerCase()}`}>
          {value || 'Unknown'}
        </span>
      )
    }
  ];

  const favoriteColumns = [
    {
      key: 'images',
      label: 'Property',
      width: '40%',
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
      label: 'Price per Night',
      width: '20%',
      render: (value) => (
        <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
          {formatCurrency(value)}
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
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (value) => (
        <span className={`status-badge ${value?.toLowerCase()}`}>
          {value || 'Available'}
        </span>
      )
    }
  ];

  const favoriteActions = [
    {
      label: 'View Details',
      icon: '👁️',
      variant: 'btn-primary',
      onClick: (property) => navigate(`/property/${property._id}`)
    },
    {
      label: 'Remove',
      icon: '🗑️',
      variant: 'btn-error',
      onClick: (property) => removeFromFavorites(property._id)
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

  // Calculate stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalSpent = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <DashboardLayout
      title={`Welcome back, ${user.firstName || user.username}!`}
      subtitle="Manage your bookings, favorites, and travel plans"
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
          {/* User Info Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Your Travel Profile</h3>
            </div>
            <div className="card-content">
              <div className="stats-grid">
                <StatCard
                  title="Total Bookings"
                  value={totalBookings}
                  icon="📅"
                  variant="primary"
                />
                <StatCard
                  title="Confirmed Trips"
                  value={confirmedBookings}
                  icon="✅"
                  variant="success"
                />
                <StatCard
                  title="Total Spent"
                  value={totalSpent}
                  icon="💰"
                  variant="info"
                />
                <StatCard
                  title="Favorite Properties"
                  value={favorites.length}
                  icon="❤️"
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
                  onClick={() => navigate('/')}
                  className="btn btn-primary"
                  style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>🔍</span>
                  Explore New Hotels
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="btn btn-success"
                  style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>📅</span>
                  View My Bookings
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className="btn btn-warning"
                  style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>❤️</span>
                  Manage Favorites
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="btn btn-info"
                  style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>⭐</span>
                  Write Reviews
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'bookings' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DataTable
            title="My Bookings"
            columns={bookingColumns}
            data={bookings}
            loading={loading}
            filters={bookingFilters}
            emptyMessage="You haven't made any bookings yet. Start exploring amazing hotels!"
            emptyIcon="📅"
          />
        </motion.div>
      )}

      {activeTab === 'favorites' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DataTable
            title="My Favorite Properties"
            columns={favoriteColumns}
            data={favorites}
            loading={favoritesLoading}
            actions={favoriteActions}
            emptyMessage="You haven't added any properties to favorites yet. Start exploring!"
            emptyIcon="❤️"
          />
        </motion.div>
      )}

      {activeTab === 'reviews' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">My Reviews</h3>
              <p className="card-subtitle">Share your experiences and help other travelers</p>
            </div>
            <div className="card-content">
              <MyReviews />
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Profile Settings</h3>
              <p className="card-subtitle">Update your personal information and preferences</p>
            </div>
            <div className="card-content">
              <ProfileSettings onUpdated={() => window.location.reload()} />
            </div>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default TravellerDashboard;