import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaHome, FaBed, FaCar, FaRoute, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <FaMapMarkerAlt className="logo-icon" />
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
          >
            <FaCar className="nav-icon" />
            <span>List Property</span>
          </Link>
          
          <Link 
            to="/tours" 
            className={`nav-item ${isActive('/tours') ? 'active' : ''}`}
          >
            <FaRoute className="nav-icon" />
            <span>Tours</span>
          </Link>
          
          <Link 
            to="/admin" 
            className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
          >
            <FaUserCircle className="nav-icon" />
            <span>Dashboard</span>
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <button className="sign-in-btn">Sign In</button>
          <button className="sign-up-btn">Sign Up</button>
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
        >
          <FaCar className="nav-icon" />
          <span>List Property</span>
        </Link>
        
        <Link 
          to="/tours" 
          className={`mobile-nav-item ${isActive('/tours') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FaRoute className="nav-icon" />
          <span>Tours</span>
        </Link>
        
        <Link 
          to="/admin" 
          className={`mobile-nav-item ${isActive('/admin') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FaUserCircle className="nav-icon" />
          <span>Dashboard</span>
        </Link>

        <div className="mobile-auth-buttons">
          <button className="sign-in-btn" onClick={() => setIsMobileMenuOpen(false)}>
            Sign In
          </button>
          <button className="sign-up-btn" onClick={() => setIsMobileMenuOpen(false)}>
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;