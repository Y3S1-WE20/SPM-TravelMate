import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyDetailModal.css';

// Feature icons mapping
const featureIcons = {
  'Free WiFi': '📶',
  'Breakfast': '🍳',
  'Free pool access': '🏊',
  'Parking': '🅿️',
  'Air Conditioning': '❄️',
  'Swimming Pool': '🏊‍♂️',
  'Gym': '💪',
  'Spa': '💆',
  'Pet Friendly': '🐾',
  'Medical staff on call': '🏥',
  'Lunch included': '🍽️',
  'Dinner included': '🍽️',
  'Welcome drink': '🍹',
  'Free Premium Wifi': '📶',
  'Express check-in': '⚡'
};

const PropertyDetailModal = ({ property, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleBookNow = () => {
    onClose(); // Close the modal first
    navigate(`/booking/${property._id}`);
  };

  // Handle keyboard navigation and body scroll
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Handle ESC key to close modal
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  // Reset image index when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property]);

  if (!isOpen || !property) return null;

  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex(prev => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex(prev => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const getAvailableDates = () => {
    if (!property.availability || property.availability.length === 0) {
      return [];
    }
    
    return property.availability
      .filter(a => a.available)
      .map(a => new Date(a.date).toLocaleDateString())
      .sort();
  };

  const calculateDiscountedPrice = () => {
    if (property.discount > 0) {
      return property.pricePerNight * (1 - property.discount / 100);
    }
    return null;
  };

  const discountedPrice = calculateDiscountedPrice();
  const availableDates = getAvailableDates();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="property-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Image Gallery */}
        <div className="modal-image-section">
          {property.images && property.images.length > 0 ? (
            <div className="modal-image-container">
              <img 
                src={property.images[currentImageIndex]} 
                alt={property.title}
                className="modal-main-image"
              />
              {property.images.length > 1 && (
                <>
                  <button className="modal-carousel-btn prev-btn" onClick={prevImage}>
                    ‹
                  </button>
                  <button className="modal-carousel-btn next-btn" onClick={nextImage}>
                    ›
                  </button>
                  <div className="modal-image-counter">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </>
              )}
              
              {/* Image thumbnails */}
              {property.images.length > 1 && (
                <div className="image-thumbnails">
                  {property.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="modal-image-placeholder">
              No Images Available
            </div>
          )}

          {property.discount > 0 && (
            <div className="modal-discount-badge">
              -{property.discount}%
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="modal-content-section">
          <div className="modal-header">
            <h2 className="modal-title">{property.title}</h2>
            <div className="modal-property-type">{property.propertyType}</div>
          </div>

          <div className="modal-location">
            <span className="location-icon">📍</span>
            <span>{property.address}, {property.city}</span>
          </div>

          <div className="modal-description">
            <h3>Description</h3>
            <p>{property.description}</p>
          </div>

          {/* Price Section */}
          <div className="modal-price-section">
            <h3>Pricing</h3>
            <div className="price-display">
              {discountedPrice ? (
                <>
                  <span className="original-price">LKR {property.pricePerNight}</span>
                  <span className="discounted-price">LKR {Math.round(discountedPrice)}</span>
                  <span className="price-note">per night</span>
                </>
              ) : (
                <>
                  <span className="current-price">LKR {property.pricePerNight}</span>
                  <span className="price-note">per night</span>
                </>
              )}
            </div>
          </div>

          {/* Features Section */}
          {property.features && property.features.length > 0 && (
            <div className="modal-features-section">
              <h3>Property Features</h3>
              <div className="modal-features-grid">
                {property.features.map((feature, index) => (
                  <div key={index} className="modal-feature-item">
                    <span className="feature-icon">{featureIcons[feature] || '✅'}</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability Section */}
          <div className="modal-availability-section">
            <h3>Availability</h3>
            {availableDates.length > 0 ? (
              <div className="available-dates">
                <p className="dates-intro">Available dates:</p>
                <div className="dates-grid">
                  {availableDates.slice(0, 10).map((date, index) => (
                    <span key={index} className="date-tag">{date}</span>
                  ))}
                  {availableDates.length > 10 && (
                    <span className="more-dates">+{availableDates.length - 10} more dates</span>
                  )}
                </div>
              </div>
            ) : (
              <p className="no-availability">No available dates at the moment</p>
            )}
          </div>

          {/* Owner Information */}
          <div className="modal-owner-section">
            <h3>Property Owner</h3>
            <div className="owner-info">
              <div className="owner-detail">
                <strong>Name:</strong> {property.ownerName}
              </div>
              <div className="owner-detail">
                <strong>Contact:</strong> {property.contactNumber}
              </div>
              <div className="owner-detail">
                <strong>Email:</strong> {property.email}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button className="btn-book-now" onClick={handleBookNow}>
              Book Now - LKR {discountedPrice ? Math.round(discountedPrice) : property.pricePerNight}
            </button>
            <button 
              className="btn-contact-owner"
              onClick={() => window.open(`tel:${property.contactNumber}`, '_self')}
            >
              📞 Call Owner
            </button>
            <button 
              className="btn-email-owner"
              onClick={() => window.open(`mailto:${property.email}?subject=Inquiry about ${property.title}`, '_self')}
            >
              ✉️ Email Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailModal;
