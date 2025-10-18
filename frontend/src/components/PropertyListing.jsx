import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import PropertyDetailModal from './PropertyDetailModal';
import './PropertyListing.css';
 
// Import icons (you'll need to install react-icons: npm install react-icons)
import { FaBed, FaCity, FaMoneyBillWave } from 'react-icons/fa';
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
  const [email, setEmail] = useState('');

  useEffect(() => {
    // filters change should trigger fetchProperties; fetchProperties itself is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchProperties();
  }, [filters]);

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
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover Your Perfect Travel Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Find amazing accommodations, vehicles, and tour packages for your next adventure
          </motion.p>
          
          {/* Call to Action Buttons */}
          <motion.div 
            className="hero-cta-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button 
              className="cta-btn primary" 
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join TravelMate Today
            </motion.button>
            <motion.button 
              className="cta-btn secondary" 
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Already a Member? Sign In
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Popular Destinations */}
      <motion.section 
        className="popular-destinations"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Popular Destinations in Sri Lanka
        </motion.h2>
          <motion.div 
            className="destinations-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
          <motion.div 
            className="destination-card" 
            onClick={() => handleCityFilter('Colombo')}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="destination-image"
              style={{
                backgroundImage: `url('/images/destinations/colombo-urban.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '160px',
                borderRadius: '8px'
              }}
            />
            <h3>Colombo</h3>
            <p>Urban experiences</p>
          </motion.div>
          
          <motion.div 
            className="destination-card" 
            onClick={() => handleCityFilter('Kandy')}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="destination-image"
              style={{
                backgroundImage: `url('/images/destinations/kandy-cultural.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '160px',
                borderRadius: '8px'
              }}
            />
            <h3>Kandy</h3>
            <p>Cultural heart</p>
          </motion.div>
          
          <motion.div 
            className="destination-card" 
            onClick={() => handleCityFilter('Galle')}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="destination-image"
              style={{
                backgroundImage: `url('/images/destinations/galle-historic.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '160px',
                borderRadius: '8px'
              }}
            />
            <h3>Galle</h3>
            <p>Historic charm</p>
          </motion.div>
          
          <motion.div 
            className="destination-card" 
            onClick={() => handleCityFilter('Ella')}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="destination-image"
              style={{
                backgroundImage: `url('/images/destinations/ella-mountain.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '160px',
                borderRadius: '8px'
              }}
            />
            <h3>Ella</h3>
            <p>Mountain views</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Property Listing */}
      <motion.section 
        className="property-listing-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Featured Properties</h2>
          <p>Discover your perfect stay in Sri Lanka</p>
        </motion.div>
        
        <motion.div 
          className="filters-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
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
        </motion.div>

        <motion.div 
          className="properties-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {properties.length > 0 ? (
            properties.map(property => (
              <motion.div
                key={property._id}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <PropertyCard 
                  property={property} 
                  onCardClick={handleCardClick}
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="no-properties"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3>No properties found</h3>
              <p>Try adjusting your filters or check back later for new listings.</p>
            </motion.div>
          )}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why TravelMate?
        </motion.h2>
        <motion.div 
          className="features-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <motion.div 
            className="feature-card"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="feature-icon">
              <MdCancel />
            </div>
            <h3>FREE cancellation on most rooms</h3>
            <p>Book now, pay at the property with flexible cancellation options</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="feature-icon">
              <IoIosPaper />
            </div>
            <h3>30k+ reviews from fellow travellers</h3>
            <p>Get trusted information from guests like you</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="feature-icon">
              <MdApartment />
            </div>
            <h3>More properties in Sri Lanka</h3>
            <p>Hotels, guest houses, apartments, and more…</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="feature-icon">
              <FaHeadset />
            </div>
            <h3>Trusted customer service</h3>
            <p>We're always here to help, 24/7</p>
          </motion.div>
        </motion.div>
      </motion.section>

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