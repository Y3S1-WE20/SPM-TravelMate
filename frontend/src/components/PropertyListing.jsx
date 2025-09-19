import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import PropertyDetailModal from './PropertyDetailModal';
import './PropertyListing.css';
 
// Import icons (you'll need to install react-icons: npm install react-icons)
import { FaBed, FaMoneyBillWave, FaStar, FaHeadset, FaUmbrellaBeach, FaMountain, FaCity, FaTree } from 'react-icons/fa';
import { MdCancel, MdApartment, MdHouse } from 'react-icons/md';
import { IoIosPaper } from 'react-icons/io';

const HomePage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: ''
  });
  const [heroSearch, setHeroSearch] = useState({
    location: '',
    propertyType: '',
    checkInDate: ''
  });
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchProperties();
  }, [filters, heroSearch.checkInDate]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.city) params.append('city', filters.city);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      
      const response = await axios.get(`http://localhost:5001/api/properties/public?${params}`);
      let filteredProperties = response.data.data;
      
      // Apply date filtering if hero search has a check-in date
      if (heroSearch.checkInDate) {
        filteredProperties = filterPropertiesByDate(filteredProperties, heroSearch.checkInDate);
      }
      
      setProperties(filteredProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCityFilter = (cityName) => {
    setFilters(prev => ({
      ...prev,
      city: cityName
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      propertyType: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  const handleHeroSearchChange = (e) => {
    const { name, value } = e.target;
    setHeroSearch(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHeroSearch = () => {
    // Update main filters with hero search values
    setFilters(prev => ({
      ...prev,
      city: heroSearch.location,
      propertyType: heroSearch.propertyType
    }));
    
    // Scroll to properties section
    document.querySelector('.property-listing-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const filterPropertiesByDate = (properties, checkInDate) => {
    if (!checkInDate) return properties;
    
    const selectedDate = new Date(checkInDate);
    return properties.filter(property => {
      if (!property.availability || property.availability.length === 0) {
        return false;
      }
      
      return property.availability.some(avail => {
        const availDate = new Date(avail.date);
        return avail.available && availDate >= selectedDate;
      });
    });
  };

  const handleCardClick = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  if (loading) {
    return <div className="loading">Loading properties...</div>;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Perfect Travel Experience</h1>
          <p>Find amazing accommodations, vehicles, and tour packages for your next adventure</p>
          
          {/* Call to Action Buttons */}
          <div className="hero-cta-buttons">
            <button 
              className="cta-btn primary" 
              onClick={() => navigate('/register')}
            >
              Join TravelMate Today
            </button>
            <button 
              className="cta-btn secondary" 
              onClick={() => navigate('/login')}
            >
              Already a Member? Sign In
            </button>
          </div>
          
          {/* Modern Finder Box */}
          <div className="hero-search-widget">
            <h3>Find Your Perfect Stay</h3>
            <div className="search-form">
              <div className="search-field">
                <label><FaCity className="field-icon" /> Location</label>
                <input
                  type="text"
                  name="location"
                  value={heroSearch.location}
                  onChange={handleHeroSearchChange}
                  placeholder="Where are you going?"
                  className="hero-input"
                />
              </div>
              
              <div className="search-field">
                <label><MdHouse className="field-icon" /> Property Type</label>
                <select
                  name="propertyType"
                  value={heroSearch.propertyType}
                  onChange={handleHeroSearchChange}
                  className="hero-select"
                >
                  <option value="">All Types</option>
                  <option value="Apartment">🏠 Apartment</option>
                  <option value="Villa">🏘️ Villa</option>
                  <option value="Lodge">🏡 Lodge</option>
                  <option value="Room">🚪 Room</option>
                  <option value="Cottage">🏕️ Cottage</option>
                  <option value="House">🏠 House</option>
                  <option value="Bungalow">🏖️ Bungalow</option>
                  <option value="Studio">🏢 Studio</option>
                </select>
              </div>
              
              <div className="search-field">
                <label><FaBed className="field-icon" /> Check-in Date</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={heroSearch.checkInDate}
                  onChange={handleHeroSearchChange}
                  className="hero-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <button 
                className="hero-search-btn"
                onClick={handleHeroSearch}
              >
                <FaStar className="search-icon" />
                Find Properties
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="popular-destinations">
        <h2>Popular Destinations in Sri Lanka</h2>
        <div className="destinations-grid">
          <div className="destination-card" onClick={() => handleCityFilter('Colombo')}>
            <div className="destination-image colombo"></div>
            <h3>Colombo</h3>
            <p>Urban experiences</p>
          </div>
          
          <div className="destination-card" onClick={() => handleCityFilter('Kandy')}>
            <div className="destination-image kandy"></div>
            <h3>Kandy</h3>
            <p>Cultural heart</p>
          </div>
          
          <div className="destination-card" onClick={() => handleCityFilter('Galle')}>
            <div className="destination-image galle"></div>
            <h3>Galle</h3>
            <p>Historic charm</p>
          </div>
          
          <div className="destination-card" onClick={() => handleCityFilter('Ella')}>
            <div className="destination-image ella"></div>
            <h3>Ella</h3>
            <p>Mountain views</p>
          </div>
        </div>
      </section>

      {/* Property Listing */}
      <section className="property-listing-section">
        <div className="section-header">
          <h2>Featured Properties</h2>
          <p>Discover your perfect stay in Sri Lanka</p>
        </div>
        
        <div className="filters-section">
          <div className="filter-header">
            <h3><FaBed className="filter-icon" /> Filter Properties</h3>
            <p>Find your perfect accommodation</p>
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label><FaCity className="input-icon" /> Location</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Search by city"
                className="modern-input"
              />
            </div>
            
            <div className="filter-group">
              <label><MdHouse className="input-icon" /> Property Type</label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="modern-select"
              >
                <option value="">All Types</option>
                <option value="Apartment">🏠 Apartment</option>
                <option value="Villa">🏘️ Villa</option>
                <option value="Lodge">🏡 Lodge</option>
                <option value="Room">🚪 Room</option>
                <option value="Cottage">🏕️ Cottage</option>
                <option value="House">🏠 House</option>
                <option value="Bungalow">🏖️ Bungalow</option>
                <option value="Studio">🏢 Studio</option>
              </select>
            </div>
            
            <div className="filter-group price-filter">
              <label><FaMoneyBillWave className="input-icon" /> Price Range (LKR)</label>
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min Price"
                  className="modern-input"
                  min="0"
                />
                <span className="price-separator">to</span>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max Price"
                  className="modern-input"
                  min="0"
                />
              </div>
            </div>
            
            <div className="filter-actions">
              <button className="btn-clear-filters" onClick={clearFilters}>
                Clear All
              </button>
              <div className="results-count">
                {properties.length} properties found
              </div>
            </div>
          </div>
        </div>

        <div className="properties-grid">
          {properties.length > 0 ? (
            properties.map(property => (
              <PropertyCard 
                key={property._id} 
                property={property} 
                onCardClick={handleCardClick}
              />
            ))
          ) : (
            <div className="no-properties">
              <h3>No properties found</h3>
              <p>Try adjusting your filters or check back later for new listings.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why TravelMate?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <MdCancel />
            </div>
            <h3>FREE cancellation on most rooms</h3>
            <p>Book now, pay at the property with flexible cancellation options</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <IoIosPaper />
            </div>
            <h3>30k+ reviews from fellow travellers</h3>
            <p>Get trusted information from guests like you</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <MdApartment />
            </div>
            <h3>More properties in Sri Lanka</h3>
            <p>Hotels, guest houses, apartments, and more…</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaHeadset />
            </div>
            <h3>Trusted customer service</h3>
            <p>We're always here to help, 24/7</p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Subscribe to our newsletter</h2>
          <p>Get the latest deals and travel inspiration delivered to your inbox</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>TravelMate</h3>
            <p>Your perfect travel companion in Sri Lanka</p>
          </div>
          
          <div className="footer-section">
            <h4>Discover</h4>
            <ul>
              <li><a href="#">Hotels</a></li>
              <li><a href="#">Apartments</a></li>
              <li><a href="#">Vacation Rentals</a></li>
              <li><a href="#">Experiences</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>About</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">How it works</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TravelMate. All rights reserved.</p>
        </div>
      </footer>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default HomePage;