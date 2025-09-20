import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddPropertyForm from '../components/AddPropertyForm';

function Dashboard() {
  const { user, logout, api } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('all');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    console.log('Dashboard: User object:', user);
    console.log('Dashboard: User ID (_id):', user._id);
    console.log('Dashboard: User ID (id):', user.id);
    console.log('Dashboard: Using userId:', user._id || user.id);
    fetchUserBookings();
    fetchUserFavorites();
  }, [user, navigate, bookingFilter]);

  const fetchUserBookings = async () => {
    const userId = user._id || user.id;
    if (!userId) return;
    
    try {
      setLoading(true);
      const statusFilter = bookingFilter === 'all' ? '' : bookingFilter;
      console.log('Dashboard: Fetching bookings for userId:', userId);
      // Use user-specific endpoint if available, otherwise fall back to email
      const response = await api.get(`/api/users/${userId}/bookings?status=${statusFilter}&limit=50`);
      console.log('Dashboard: Bookings response:', response.data);
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      // Fallback to email-based fetching for backward compatibility
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
      // Update local state
      setFavorites(prev => prev.filter(property => property._id !== propertyId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Failed to remove from favorites. Please try again.');
    }
  };

  if (!user) {
    return null;
  }

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

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ 
          margin: 0,
          color: '#333'
        }}>
          TravelMate Dashboard
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        marginBottom: '20px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '15px 25px',
              border: 'none',
              background: activeTab === 'overview' ? '#007bff' : 'transparent',
              color: activeTab === 'overview' ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '15px 25px',
              border: 'none',
              background: activeTab === 'bookings' ? '#007bff' : 'transparent',
              color: activeTab === 'bookings' ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            My Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            style={{
              padding: '15px 25px',
              border: 'none',
              background: activeTab === 'favorites' ? '#007bff' : 'transparent',
              color: activeTab === 'favorites' ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            My Favorites ({favorites.length})
          </button>
          {user.role === 'hotel owner' && (
            <button
              onClick={() => setActiveTab('properties')}
              style={{
                padding: '15px 25px',
                border: 'none',
                background: activeTab === 'properties' ? '#007bff' : 'transparent',
                color: activeTab === 'properties' ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Manage Properties
            </button>
          )}
          {user.role === 'hotel owner' && (
            <button
              onClick={() => setActiveTab('booking-management')}
              style={{
                padding: '15px 25px',
                border: 'none',
                background: activeTab === 'booking-management' ? '#007bff' : 'transparent',
                color: activeTab === 'booking-management' ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Booking Management
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* User Info Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px'
          }}>
            <h2 style={{ 
              marginTop: 0,
              marginBottom: '20px',
              color: '#333'
            }}>
              Welcome back, {user.firstName || user.username}!
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#666' }}>Username</h4>
                <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>{user.username}</p>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#666' }}>Email</h4>
                <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>{user.email}</p>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#666' }}>Role</h4>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: user.role === 'hotel owner' ? '#28a745' : user.role === 'admin' ? '#dc3545' : '#007bff',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>
                  {user.role}
                </span>
              </div>
              
              {(user.firstName || user.lastName) && (
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#666' }}>Full Name</h4>
                  <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Role-based Content */}
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              marginTop: 0,
              marginBottom: '20px',
              color: '#333'
            }}>
              {user.role === 'hotel owner' ? 'Hotel Management' : 
               user.role === 'admin' ? 'Admin Panel' : 
               'Travel Planning'}
            </h3>
            
            {user.role === 'hotel owner' && (
              <div>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  Manage your hotel listings, bookings, and guest reviews.
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '15px'
                }}>
                  <button 
                    onClick={() => setActiveTab('properties')}
                    style={{
                      padding: '15px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    📋 Manage Properties
                  </button>
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    style={{
                      padding: '15px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    📊 View Bookings
                  </button>
                  <button style={{
                    padding: '15px',
                    backgroundColor: '#ffc107',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    ⭐ Manage Reviews
                  </button>
                </div>
              </div>
            )}
            
            {user.role === 'admin' && (
              <div>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  Manage users, hotels, and system settings.
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '15px'
                }}>
                  <button 
                    onClick={() => navigate('/admin')}
                    style={{
                      padding: '15px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    👥 Admin Dashboard
                  </button>
                  <button style={{
                    padding: '15px',
                    backgroundColor: '#6f42c1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    🏨 Manage Hotels
                  </button>
                  <button style={{
                    padding: '15px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    ⚙️ System Settings
                  </button>
                </div>
              </div>
            )}
            
            {user.role === 'user' && (
              <div>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  Discover amazing hotels and plan your perfect trip.
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '15px'
                }}>
                  <button 
                    onClick={() => navigate('/')}
                    style={{
                      padding: '15px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🔍 Search Hotels
                  </button>
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    style={{
                      padding: '15px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    📅 My Bookings
                  </button>
                  <button style={{
                    padding: '15px',
                    backgroundColor: '#ffc107',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    ❤️ Favorites
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: 0, color: '#333' }}>My Bookings</h3>
            <select
              value={bookingFilter}
              onChange={(e) => setBookingFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No bookings found.</p>
              <button 
                onClick={() => navigate('/')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Explore Hotels
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '20px'
            }}>
              {bookings.map((booking) => (
                <div key={booking._id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px',
                    alignItems: 'start'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                        {booking.propertyId?.title || 'Property Details Not Available'}
                      </h4>
                      <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '14px' }}>
                        📍 {booking.propertyId?.city}, {booking.propertyId?.address}
                      </p>
                      <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                        Booking ID: {booking.bookingReference}
                      </p>
                    </div>
                    
                    <div>
                      <h5 style={{ margin: '0 0 8px 0', color: '#666' }}>Check-in & Check-out</h5>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                        📅 {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </p>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                        {booking.nights} night{booking.nights > 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div>
                      <h5 style={{ margin: '0 0 8px 0', color: '#666' }}>Guests</h5>
                      <p style={{ margin: '0', fontSize: '14px' }}>
                        👥 {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div>
                      <h5 style={{ margin: '0 0 8px 0', color: '#666' }}>Total Amount</h5>
                      <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                        {formatCurrency(booking.totalAmount)}
                      </p>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: getStatusColor(booking.status),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #e2e8f0',
                    fontSize: '12px',
                    color: '#999'
                  }}>
                    Booked on: {formatDate(booking.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
            My Favorite Properties
          </h3>
          
          {favoritesLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div>Loading favorites...</div>
            </div>
          ) : favorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>You haven't added any properties to your favorites yet.</p>
              <button 
                onClick={() => navigate('/properties')}
                style={{
                  marginTop: '15px',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {favorites.map((property) => (
                <div key={property._id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease'
                }}>
                  {property.images && property.images[0] && (
                    <img 
                      src={property.images[0]}
                      alt={property.title}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{property.title}</h4>
                    <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                      📍 {property.city}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '15px'
                    }}>
                      <span style={{ 
                        fontSize: '18px', 
                        fontWeight: 'bold', 
                        color: '#007bff' 
                      }}>
                        ${property.pricePerNight}/night
                      </span>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => navigate(`/property/${property._id}`)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => removeFromFavorites(property._id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hotel Owner Properties Tab */}
      {activeTab === 'properties' && user.role === 'hotel owner' && (
        <HotelManagement userId={user._id || user.id} api={api} />
      )}

      {/* Hotel Owner Booking Management Tab */}
      {activeTab === 'booking-management' && user.role === 'hotel owner' && (
        <BookingManagement userId={user._id || user.id} api={api} />
      )}
    </div>
  );
}

// Hotel Management Component
const HotelManagement = ({ userId, api }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    fetchOwnerProperties();
  }, [userId]);

  const fetchOwnerProperties = async () => {
    try {
      setLoading(true);
      console.log('HotelManagement: Fetching properties for userId:', userId);
      const response = await api.get(`/api/properties/owner/${userId}`);
      console.log('HotelManagement: Properties response:', response.data);
      setProperties(response.data.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await api.delete(`/api/properties/${propertyId}`);
      setProperties(prev => prev.filter(p => p._id !== propertyId));
      alert('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'pending': return '#ffc107';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div>Loading your properties...</div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: 0, color: '#333' }}>
          My Properties ({properties.length})
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showAddForm ? 'Cancel' : '+ Add New Property'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ 
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h4 style={{ marginTop: 0 }}>Add New Property</h4>
          <AddPropertyForm onSuccess={() => {
            setShowAddForm(false);
            fetchOwnerProperties();
          }} />
        </div>
      )}

      {properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>You haven't added any properties yet.</p>
          <button 
            onClick={() => setShowAddForm(true)}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Add Your First Property
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {properties.map((property) => (
            <div key={property._id} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              {property.images && property.images[0] && (
                <img 
                  src={property.images[0]}
                  alt={property.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
              )}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{property.title}</h4>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: getStatusColor(property.status),
                    textTransform: 'capitalize'
                  }}>
                    {property.status}
                  </span>
                </div>
                
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                  📍 {property.city} • {property.propertyType}
                </p>
                
                <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', lineHeight: '1.4' }}>
                  {property.description.length > 100 
                    ? `${property.description.substring(0, 100)}...`
                    : property.description
                  }
                </p>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <span style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#007bff' 
                  }}>
                    LKR {property.pricePerNight}/night
                  </span>
                  {property.discount > 0 && (
                    <span style={{
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {property.discount}% OFF
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setEditingProperty(property)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      flex: '1'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(property._id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      flex: '1'
                    }}
                  >
                    Delete
                  </button>
                </div>

                {property.adminNotes && (
                  <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#856404'
                  }}>
                    <strong>Admin Notes:</strong> {property.adminNotes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <PropertyEditModal 
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
          onUpdate={() => {
            setEditingProperty(null);
            fetchOwnerProperties();
          }}
          api={api}
        />
      )}
    </div>
  );
};

// Booking Management Component for Hotel Owners
const BookingManagement = ({ userId, api }) => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchOwnerProperties();
  }, [userId]);

  useEffect(() => {
    fetchAllBookings();
  }, [properties, selectedProperty]);

  const fetchOwnerProperties = async () => {
    try {
      console.log('BookingManagement: Fetching properties for userId:', userId);
      const response = await api.get(`/api/properties/owner/${userId}`);
      console.log('BookingManagement: Properties response:', response.data);
      setProperties(response.data.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      let bookings = [];
      
      if (properties.length === 0) {
        console.log('BookingManagement: No properties found, no bookings to fetch');
        setAllBookings([]);
        return;
      }
      
      if (selectedProperty === 'all') {
        // Fetch bookings for all properties
        console.log('BookingManagement: Fetching bookings for all properties:', properties.length);
        const allPromises = properties.map(property => 
          api.get(`/api/properties/${property._id}/bookings`)
        );
        const responses = await Promise.all(allPromises);
        bookings = responses.flatMap(response => response.data.data || []);
      } else {
        // Fetch bookings for selected property
        console.log('BookingManagement: Fetching bookings for property:', selectedProperty);
        const response = await api.get(`/api/properties/${selectedProperty}/bookings`);
        bookings = response.data.data || [];
      }
      
      console.log('BookingManagement: Found bookings:', bookings.length);
      setAllBookings(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/api/properties/bookings/${bookingId}/status`, {
        status: newStatus
      });
      
      // Refresh bookings
      fetchAllBookings();
      
      alert(`Booking ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredBookings = allBookings.filter(booking => {
    if (selectedProperty === 'all') return true;
    return booking.property._id === selectedProperty;
  });

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>Booking Management</h2>
        <select
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        >
          <option value="all">All Properties</option>
          {properties.map(property => (
            <option key={property._id} value={property._id}>
              {property.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          Loading bookings...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          No bookings found for the selected property.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: '15px'
        }}>
          {filteredBookings.map(booking => (
            <div key={booking._id} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr auto',
                gap: '20px',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                    {booking.property?.title || 'Property Not Found'}
                  </h4>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                    Guest: {booking.user?.fullName || 'N/A'}
                  </p>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    Email: {booking.user?.email || 'N/A'}
                  </p>
                  {booking.user?.phone && (
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      Phone: {booking.user.phone}
                    </p>
                  )}
                </div>
                
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                    <strong>Check-in:</strong> {formatDate(booking.checkIn)}
                  </p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                    <strong>Check-out:</strong> {formatDate(booking.checkOut)}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    <strong>Guests:</strong> {booking.guests}
                  </p>
                </div>
                
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                    <strong>Total:</strong> ${booking.totalAmount}
                  </p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                    <strong>Booked:</strong> {formatDate(booking.createdAt)}
                  </p>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: getStatusColor(booking.status)
                  }}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(booking._id, 'completed')}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Property Edit Modal Component
const PropertyEditModal = ({ property, onClose, onUpdate, api }) => {
  const [formData, setFormData] = useState({
    title: property.title,
    description: property.description,
    pricePerNight: property.pricePerNight,
    discount: property.discount || 0,
    contactNumber: property.contactNumber,
    email: property.email
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/api/properties/${property._id}`, formData);
      alert('Property updated successfully');
      onUpdate();
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h3 style={{ marginTop: 0 }}>Edit Property: {property.title}</h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Title:
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Description:
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                minHeight: '100px'
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Price per Night (LKR):
              </label>
              <input
                type="number"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({...formData, pricePerNight: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
                required
                min="0"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Discount (%):
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: parseInt(e.target.value) || 0})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Contact Number:
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Email:
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: saving ? 'not-allowed' : 'pointer',
                flex: '1'
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                flex: '1'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;