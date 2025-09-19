import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

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

const PropertyCard = ({ property, onCardClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on carousel buttons or book now button
    if (e.target.closest('.carousel-btn') || e.target.closest('.book-now-btn')) {
      return;
    }
    if (onCardClick) {
      onCardClick(property);
    }
  };

  const getNextAvailableDate = () => {
    if (!property.availability || property.availability.length === 0) {
      return 'Not available';
    }
    
    const availableDates = property.availability
      .filter(a => a.available)
      .map(a => new Date(a.date))
      .sort((a, b) => a - b);
    
    return availableDates.length > 0 
      ? availableDates[0].toLocaleDateString() 
      : 'Not available';
  };

  const calculateDiscountedPrice = () => {
    if (property.discount > 0) {
      return property.pricePerNight * (1 - property.discount / 100);
    }
    return null;
  };

  const discountedPrice = calculateDiscountedPrice();

  return (
    <div className="property-card" onClick={handleCardClick}>
      {/* Image Carousel */}
      <div className="property-image-container">
        {property.images && property.images.length > 0 ? (
          <>
            <img 
              src={property.images[currentImageIndex]} 
              alt={property.title}
              className="property-image"
            />
            {property.images.length > 1 && (
              <>
                <button className="carousel-btn prev-btn" onClick={prevImage}>
                  ‹
                </button>
                <button className="carousel-btn next-btn" onClick={nextImage}>
                  ›
                </button>
                <div className="image-counter">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="property-image-placeholder">
            No Image Available
          </div>
        )}
        
        {property.discount > 0 && (
          <div className="discount-badge">
            -{property.discount}%
          </div>
        )}
      </div>

      {/* Property Content */}
      <div className="property-content">
        {/* Title and Type */}
        <div className="property-header">
          <h3 className="property-title">{property.title}</h3>
          <span className="property-type">{property.propertyType}</span>
        </div>

        {/* Location */}
        <div className="property-location">
          <span className="location-icon">📍</span>
          <span>{property.city}</span>
        </div>

        {/* Description */}
        <p className="property-description">
          {property.description.length > 60 
            ? `${property.description.substring(0, 60)}...` 
            : property.description
          }
        </p>

        {/* Features - Only show 3 key features */}
        {property.features && property.features.length > 0 && (
          <div className="property-features">
            {property.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="feature-item">
                {featureIcons[feature] || '✅'} {feature}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="feature-more">+{property.features.length - 3} more</span>
            )}
          </div>
        )}

        {/* Availability */}
        <div className="property-availability">
          <span className="availability-text">Available from: {getNextAvailableDate()}</span>
        </div>

        {/* Price Section */}
        <div className="property-price-section">
          <div className="price-container">
            {discountedPrice ? (
              <div className="price-with-discount">
                <span className="original-price">LKR {property.pricePerNight.toLocaleString()}</span>
                <span className="current-price">LKR {Math.round(discountedPrice).toLocaleString()}</span>
              </div>
            ) : (
              <span className="current-price">LKR {property.pricePerNight.toLocaleString()}</span>
            )}
            <span className="price-note">per night</span>
          </div>

          {/* Book Now Button */}
          <Link 
            to={`/booking/${property._id}`} 
            className="book-now-btn"
            onClick={(e) => e.stopPropagation()}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;