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

  // Enhanced animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }),
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -50, rotate: -10 },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.header
      className="modern-header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <div className="header-container">
        {/* Logo */}
        <motion.div
          className="logo"
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <motion.img
            src={logo}
            alt="logo"
            className="h-6 w-6 object-contain mr-2"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          />
          <motion.span
            className="logo-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            TravelMate
          </motion.span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <motion.div
            custom={0}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/"
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <FaHome className="nav-icon" />
              </motion.div>
              <span>Home</span>
            </Link>
          </motion.div>

          <motion.div
            custom={1}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/"
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <FaBed className="nav-icon" />
              </motion.div>
              <span>Accommodations</span>
            </Link>
          </motion.div>

          <motion.div
            custom={2}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            style={{ display: isAuthenticated && user?.role === 'hotel owner' ? 'block' : 'none' }}
          >
            <Link
              to="/add-property"
              className={`nav-item ${isActive('/add-property') ? 'active' : ''}`}
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <FaCar className="nav-icon" />
              </motion.div>
              <span>List Property</span>
            </Link>
          </motion.div>

          <motion.div
            custom={3}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/vehicles"
              className={`nav-item ${isActive('/vehicles') ? 'active' : ''}`}
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <FaCar className="nav-icon" />
              </motion.div>
              <span>Vehicles</span>
            </Link>
          </motion.div>

          <motion.div
            custom={4}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/tours"
              className={`nav-item ${isActive('/tours') ? 'active' : ''}`}
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <FaRoute className="nav-icon" />
              </motion.div>
              <span>Tours</span>
            </Link>
          </motion.div>

          {isAuthenticated && user?.role === 'admin' && (
            <motion.div
              custom={5}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/admin"
                className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaUserCircle className="nav-icon" />
                </motion.div>
                <span>Admin</span>
              </Link>
            </motion.div>
          )}
        </nav>

        {/* Auth Section */}
        <motion.div
          className="auth-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {isAuthenticated ? (
            <div className="user-profile">
              <motion.button
                className="profile-btn"
                onClick={toggleProfileDropdown}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaUserCircle className="profile-icon" />
                </motion.div>
                <span className="username">{user?.firstName || user?.username}</span>
                <motion.div
                  animate={{ rotate: isProfileDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="dropdown-arrow"
                >
                  ▼
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <motion.div
                      className="user-info"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className="user-name">{user?.firstName} {user?.lastName}</p>
                      <p className="user-role">{user?.role}</p>
                    </motion.div>
                    <div className="dropdown-divider"></div>
                    <motion.button
                      className="dropdown-item"
                      onClick={handleDashboard}
                      whileHover={{
                        backgroundColor: "rgba(102, 126, 234, 0.1)",
                        x: 5
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaTachometerAlt className="dropdown-icon" />
                      </motion.div>
                      Dashboard
                    </motion.button>
                    {user?.role === 'admin' && (
                      <motion.button
                        className="dropdown-item"
                        onClick={handleAdminDashboard}
                        whileHover={{
                          backgroundColor: "rgba(102, 126, 234, 0.1)",
                          x: 5
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          whileHover={{ rotate: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FaUserCircle className="dropdown-icon" />
                        </motion.div>
                        Admin Panel
                      </motion.button>
                    )}
                    <motion.button
                      className="dropdown-item logout"
                      onClick={handleLogout}
                      whileHover={{
                        backgroundColor: "rgba(229, 62, 62, 0.1)",
                        x: 5,
                        color: "#e53e3e"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaSignOutAlt className="dropdown-icon" />
                      </motion.div>
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              className="auth-buttons"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <motion.button
                className="sign-in-btn"
                onClick={handleSignIn}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                Sign In
              </motion.button>
              <motion.button
                className="sign-up-btn"
                onClick={handleSignUp}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(118, 75, 162, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                Sign Up
              </motion.button>
              <motion.button
                className="admin-login-btn"
                onClick={() => navigate('/admin-login')}
                title="Admin Portal"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                Admin
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(255,255,255,0.1)"
          }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: isMobileMenuOpen ? 180 : 0,
            backgroundColor: isMobileMenuOpen ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0)"
          }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <motion.div
            animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            className="mobile-nav open"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
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
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;