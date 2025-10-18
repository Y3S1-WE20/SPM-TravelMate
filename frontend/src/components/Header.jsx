import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaBed, FaCar, FaRoute, FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
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
    <motion.header 
      className="modern-header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="header-container">
        {/* Logo */}
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <img src={logo} alt="logo" className="h-6 w-6 object-contain mr-2" />
          <span className="logo-text">TravelMate</span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link 
              to="/" 
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
            >
              <FaHome className="nav-icon" />
              <span>Home</span>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              to="/" 
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
            >
              <FaBed className="nav-icon" />
              <span>Accommodations</span>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: isAuthenticated && user?.role === 'hotel owner' ? 'block' : 'none' }}
          >
            <Link 
              to="/add-property" 
              className={`nav-item ${isActive('/add-property') ? 'active' : ''}`}
            >
              <FaCar className="nav-icon" />
              <span>List Property</span>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              to="/vehicles" 
              className={`nav-item ${isActive('/vehicles') ? 'active' : ''}`}
            >
              <FaCar className="nav-icon" />
              <span>Vehicles</span>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link 
              to="/tours" 
              className={`nav-item ${isActive('/tours') ? 'active' : ''}`}
            >
              <FaRoute className="nav-icon" />
              <span>Tours</span>
            </Link>
          </motion.div>
          
          {isAuthenticated && user?.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link 
                to="/admin" 
                className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
              >
                <FaUserCircle className="nav-icon" />
                <span>Admin</span>
              </Link>
            </motion.div>
          )}
        </nav>

        {/* Auth Section */}
        <motion.div 
          className="auth-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {isAuthenticated ? (
            <div className="user-profile">
              <motion.button 
                className="profile-btn" 
                onClick={toggleProfileDropdown}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserCircle className="profile-icon" />
                <span className="username">{user?.firstName || user?.username}</span>
              </motion.button>
              
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div 
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="user-info">
                      <p className="user-name">{user?.firstName} {user?.lastName}</p>
                      <p className="user-role">{user?.role}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <motion.button 
                      className="dropdown-item" 
                      onClick={handleDashboard}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    >
                      <FaTachometerAlt className="dropdown-icon" />
                      Dashboard
                    </motion.button>
                    {user?.role === 'admin' && (
                      <motion.button 
                        className="dropdown-item" 
                        onClick={handleAdminDashboard}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      >
                        <FaUserCircle className="dropdown-icon" />
                        Admin Panel
                      </motion.button>
                    )}
                    <motion.button 
                      className="dropdown-item logout" 
                      onClick={handleLogout}
                      whileHover={{ backgroundColor: "rgba(255,0,0,0.1)" }}
                    >
                      <FaSignOutAlt className="dropdown-icon" />
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="auth-buttons">
              <motion.button 
                className="sign-in-btn" 
                onClick={handleSignIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              <motion.button 
                className="sign-up-btn" 
                onClick={handleSignUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
              <motion.button 
                className="admin-login-btn"
                onClick={() => navigate('/admin-login')}
                title="Admin Portal"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Admin
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button 
          className="mobile-menu-btn" 
          onClick={toggleMobileMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav 
            className="mobile-nav open"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
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
      </motion.nav>
      )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;