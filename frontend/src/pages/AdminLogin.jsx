import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated as admin
  React.useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin');
    } else if (isAuthenticated && user?.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Check if user has admin role after successful login
        // Note: The user object is updated by the AuthContext after login
        // We'll handle the redirect in useEffect
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          <h1>Admin Portal</h1>
          <p>Sign in to access the administrative dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your admin email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In to Admin Portal'}
          </button>
        </form>

        <div className="login-footer">
          <div className="divider">
            <span>Not an admin?</span>
          </div>
          <div className="auth-links">
            <Link to="/login" className="auth-link">
              User Login
            </Link>
            <span className="separator">|</span>
            <Link to="/" className="auth-link">
              Back to Home
            </Link>
          </div>
        </div>

        <div className="admin-info">
          <h3>Admin Access Only</h3>
          <p>This portal is restricted to authorized administrators only. If you're not an admin, please use the regular user login.</p>
          <ul>
            <li>Manage property listings and approvals</li>
            <li>Monitor user accounts and bookings</li>
            <li>Access system analytics and reports</li>
            <li>Configure system settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;