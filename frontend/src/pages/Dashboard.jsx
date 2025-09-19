import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

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
              <button style={{
                padding: '15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                📋 Manage Listings
              </button>
              <button style={{
                padding: '15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
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
              <button style={{
                padding: '15px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                👥 Manage Users
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
              <button style={{
                padding: '15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                🔍 Search Hotels
              </button>
              <button style={{
                padding: '15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
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
    </div>
  );
}

export default Dashboard;