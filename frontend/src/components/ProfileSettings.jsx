import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfileSettings = ({ onUpdated }) => {
  const { user, updateProfile } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const result = await updateProfile(profileForm);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setShowEditForm(false);
        if (onUpdated) onUpdated();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Profile update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    // Validate password length
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      setLoading(false);
      return;
    }

    try {
      const result = await updateProfile({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setShowPasswordForm(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        if (onUpdated) onUpdated();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Password change failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: 20, color: '#333' }}>Profile Settings</h3>
      
      {message && (
        <div style={{ 
          marginBottom: 20, 
          color: message.type === 'success' ? '#155724' : '#721c24', 
          background: message.type === 'success' ? '#d4edda' : '#f8d7da', 
          padding: 12, 
          borderRadius: 4,
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 15, marginBottom: 20 }}>
        <button 
          onClick={() => {
            setShowEditForm(!showEditForm);
            setShowPasswordForm(false);
            setMessage(null);
          }}
          style={{ 
            padding: '12px 20px', 
            background: showEditForm ? '#6c757d' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {showEditForm ? 'Cancel Edit' : '✏️ Edit Profile Details'}
        </button>
        
        <button 
          onClick={() => {
            setShowPasswordForm(!showPasswordForm);
            setShowEditForm(false);
            setMessage(null);
          }}
          style={{ 
            padding: '12px 20px', 
            background: showPasswordForm ? '#6c757d' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {showPasswordForm ? 'Cancel' : '🔒 Change Password'}
        </button>
      </div>

      {/* Profile Edit Form */}
      {showEditForm && (
        <div style={{ 
          border: '1px solid #e9ecef', 
          borderRadius: 8, 
          padding: 20, 
          backgroundColor: '#f8f9fa',
          marginBottom: 20 
        }}>
          <h4 style={{ marginTop: 0, marginBottom: 15, color: '#495057' }}>Edit Profile Information</h4>
          <form onSubmit={handleProfileSubmit}>
            <div style={{ display: 'flex', gap: 15, marginBottom: 15 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', color: '#495057' }}>
                  First Name
                </label>
                <input 
                  name="firstName" 
                  value={profileForm.firstName} 
                  onChange={handleProfileChange} 
                  placeholder="First name" 
                  style={{ 
                    width: '100%', 
                    padding: 10, 
                    border: '1px solid #ced4da', 
                    borderRadius: 4,
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', color: '#495057' }}>
                  Last Name
                </label>
                <input 
                  name="lastName" 
                  value={profileForm.lastName} 
                  onChange={handleProfileChange} 
                  placeholder="Last name" 
                  style={{ 
                    width: '100%', 
                    padding: 10, 
                    border: '1px solid #ced4da', 
                    borderRadius: 4,
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }} 
                />
              </div>
            </div>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', color: '#495057' }}>
                Email Address
              </label>
              <input 
                name="email" 
                type="email"
                value={profileForm.email} 
                onChange={handleProfileChange} 
                placeholder="Email address" 
                style={{ 
                  width: '100%', 
                  padding: 10, 
                  border: '1px solid #ced4da', 
                  borderRadius: 4,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }} 
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                type="submit" 
                disabled={loading} 
                style={{ 
                  padding: '10px 20px', 
                  background: loading ? '#6c757d' : '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 4,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Change Form */}
      {showPasswordForm && (
        <div style={{ 
          border: '1px solid #e9ecef', 
          borderRadius: 8, 
          padding: 20, 
          backgroundColor: '#fff3cd',
          marginBottom: 20 
        }}>
          <h4 style={{ marginTop: 0, marginBottom: 15, color: '#856404' }}>Change Password</h4>
          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', color: '#856404' }}>
                Current Password
              </label>
              <input 
                name="currentPassword" 
                type="password"
                value={passwordForm.currentPassword} 
                onChange={handlePasswordChange} 
                placeholder="Enter your current password" 
                required
                style={{ 
                  width: '100%', 
                  padding: 10, 
                  border: '1px solid #ffeaa7', 
                  borderRadius: 4,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }} 
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', color: '#856404' }}>
                New Password
              </label>
              <input 
                name="newPassword" 
                type="password"
                value={passwordForm.newPassword} 
                onChange={handlePasswordChange} 
                placeholder="Enter new password (min 6 characters)" 
                required
                style={{ 
                  width: '100%', 
                  padding: 10, 
                  border: '1px solid #ffeaa7', 
                  borderRadius: 4,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }} 
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: '500', color: '#856404' }}>
                Confirm New Password
              </label>
              <input 
                name="confirmPassword" 
                type="password"
                value={passwordForm.confirmPassword} 
                onChange={handlePasswordChange} 
                placeholder="Confirm your new password" 
                required
                style={{ 
                  width: '100%', 
                  padding: 10, 
                  border: '1px solid #ffeaa7', 
                  borderRadius: 4,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }} 
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                type="submit" 
                disabled={loading} 
                style={{ 
                  padding: '10px 20px', 
                  background: loading ? '#6c757d' : '#ffc107', 
                  color: loading ? 'white' : '#212529', 
                  border: 'none', 
                  borderRadius: 4,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {loading ? 'Changing...' : '🔑 Change Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
