import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaHome, FaBed, FaCar, FaRoute, FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';
import logo from '../assets/logo1.png';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setIsProfileDropdownOpen(false);
  };

  const handleAdminDashboard = () => {
    navigate('/admin');
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="logo" className="h-6 w-6 object-contain mr-2" />
          <span className="logo-text">TravelMate</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link 
            to="/" 
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
          >
            <FaHome className="nav-icon" />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/" 
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
          >
            <FaBed className="nav-icon" />
            <span>Accommodations</span>
          </Link>
          
          <Link 
            to="/add-property" 
            className={`nav-item ${isActive('/add-property') ? 'active' : ''}`}
            style={{ display: isAuthenticated && user?.role === 'hotel owner' ? 'flex' : 'none' }}
          >
            <FaCar className="nav-icon" />
            <span>List Property</span>
          </Link>
          
          <Link 
            to="/vehicles" 
            className={`nav-item ${isActive('/vehicles') ? 'active' : ''}`}
          >
            <FaCar className="nav-icon" />
            <span>Vehicles</span>
          </Link>
          
          <Link 
            to="/tours" 
            className={`nav-item ${isActive('/tours') ? 'active' : ''}`}
          >
            <FaRoute className="nav-icon" />
            <span>Tours</span>
          </Link>
          
          {isAuthenticated && user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
            >
              <FaUserCircle className="nav-icon" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Auth Section */}
        <div className="auth-section">
          {isAuthenticated ? (
            <div className="user-profile">
              <button className="profile-btn" onClick={toggleProfileDropdown}>
                <FaUserCircle className="profile-icon" />
                <span className="username">{user?.firstName || user?.username}</span>
              </button>
              
              {isProfileDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user?.firstName} {user?.lastName}</p>
                    <p className="user-role">{user?.role}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleDashboard}>
                    <FaTachometerAlt className="dropdown-icon" />
                    Dashboard
                  </button>
                  {user?.role === 'admin' && (
                    <button className="dropdown-item" onClick={handleAdminDashboard}>
                      <FaUserCircle className="dropdown-icon" />
                      Admin Panel
                    </button>
                  )}
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="sign-in-btn" onClick={handleSignIn}>Sign In</button>
              <button className="sign-up-btn" onClick={handleSignUp}>Sign Up</button>
              <button 
                className="admin-login-btn"
                onClick={() => navigate('/admin-login')}
                title="Admin Portal"
              >
                Admin
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link 
          to="/" 
          className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FaHome className="nav-icon" />
          <span>Home</span>
        </Link>
        
        <Link 
          to="/" 
          className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FaBed className="nav-icon" />
          <span>Accommodations</span>
        </Link>
        
        <Link 
          to="/add-property" 
          className={`mobile-nav-item ${isActive('/add-property') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ display: isAuthenticated && user?.role === 'hotel owner' ? 'flex' : 'none' }}
        >
          <FaCar className="nav-icon" />
          <span>List Property</span>
        </Link>
        
        <Link 
          to="/vehicles" 
          className={`mobile-nav-item ${isActive('/vehicles') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FaCar className="nav-icon" />
          <span>Vehicles</span>
        </Link>
        
        <Link 
          to="/tours" 
          className={`mobile-nav-item ${isActive('/tours') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FaRoute className="nav-icon" />
          <span>Tours</span>
        </Link>
        
        {isAuthenticated && (
          <Link 
            to="/dashboard" 
            className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaTachometerAlt className="nav-icon" />
            <span>Dashboard</span>
          </Link>
        )}
        
        {isAuthenticated && user?.role === 'admin' && (
          <Link 
            to="/admin" 
            className={`mobile-nav-item ${isActive('/admin') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaUserCircle className="nav-icon" />
            <span>Admin</span>
          </Link>
        )}

        <div className="mobile-auth-section">
          {isAuthenticated ? (
            <div className="mobile-user-info">
              <div className="mobile-user-details">
                <p className="mobile-username">{user?.firstName || user?.username}</p>
                <p className="mobile-user-role">{user?.role}</p>
              </div>
              <button className="mobile-logout-btn" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                <FaSignOutAlt className="logout-icon" />
                Logout
              </button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <button className="sign-in-btn" onClick={() => { handleSignIn(); setIsMobileMenuOpen(false); }}>
                Sign In
              </button>
              <button className="sign-up-btn" onClick={() => { handleSignUp(); setIsMobileMenuOpen(false); }}>
                Sign Up
              </button>
              <button 
                className="admin-login-btn" 
                onClick={() => { navigate('/admin-login'); setIsMobileMenuOpen(false); }}
              >
                Admin Portal
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;