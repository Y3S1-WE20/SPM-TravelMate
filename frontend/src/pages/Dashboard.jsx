import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddPropertyForm from '../components/AddPropertyForm';

function Dashboard() {
  const { user, logout, api } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchUserBookings();
  }, [user, navigate, bookingFilter]);

  const fetchUserBookings = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      const statusFilter = bookingFilter === 'all' ? '' : bookingFilter;
      const response = await api.get(`/api/bookings?email=${user.email}&status=${statusFilter}&limit=50`);
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
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

      {/* Hotel Owner Properties Tab */}
      {activeTab === 'properties' && user.role === 'hotel owner' && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
            Add New Property
          </h3>
          <AddPropertyForm />
        </div>
      )}
    </div>
  );
}

export default Dashboard;