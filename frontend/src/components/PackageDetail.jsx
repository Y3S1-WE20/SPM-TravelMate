import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GroupBookingForm from './GroupBookingForm';
import './PackageDetail.css';

export default function PackageDetail() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/packages/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch package: ${response.status}`);
        }
        const data = await response.json();
        setPkg(data.data);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Failed to load package details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="package-detail-container">
        <div className="package-loading">
          <div className="loading-spinner"></div>
          <p>Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="package-detail-container">
        <div className="package-error">
          <div className="error-icon">⚠️</div>
          <h3>Package Not Found</h3>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="package-detail-container">
        <div className="package-error">
          <div className="error-icon">❌</div>
          <h3>Package Not Available</h3>
          <p>The requested package could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="package-detail-container">
      {/* Hero Section */}
      <div className="package-hero">
        <div className="hero-content">
          <div className="package-badge">Featured Package</div>
          <h1 className="package-title">{pkg.title}</h1>
          <p className="package-subtitle">{pkg.shortDescription}</p>
          
          <div className="package-meta-grid">
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              <div className="meta-content">
                <span className="meta-label">Duration</span>
                <span className="meta-value">{pkg.durationDays} days</span>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-icon">💰</span>
              <div className="meta-content">
                <span className="meta-label">Price</span>
                <span className="meta-value">${pkg.pricePerPerson}/person</span>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-icon">⭐</span>
              <div className="meta-content">
                <span className="meta-label">Rating</span>
                <span className="meta-value">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="package-content">
        <div className="content-layout">
          {/* Left Column - Package Details */}
          <div className="details-column">
            {/* Navigation Tabs */}
            <div className="detail-tabs">
              <button 
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-button ${activeTab === 'itinerary' ? 'active' : ''}`}
                onClick={() => setActiveTab('itinerary')}
              >
                Itinerary
              </button>
              <button 
                className={`tab-button ${activeTab === 'addons' ? 'active' : ''}`}
                onClick={() => setActiveTab('addons')}
              >
                Add-ons
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-section">
                  <h2>Package Overview</h2>
                  <p className="package-description">{pkg.description}</p>
                  
                  <div className="highlights-grid">
                    <div className="highlight-card">
                      <span className="highlight-icon">🏨</span>
                      <span className="highlight-text">Luxury Accommodation</span>
                    </div>
                    <div className="highlight-card">
                      <span className="highlight-icon">🍽️</span>
                      <span className="highlight-text">Daily Breakfast</span>
                    </div>
                    <div className="highlight-card">
                      <span className="highlight-icon">🚗</span>
                      <span className="highlight-text">Airport Transfers</span>
                    </div>
                    <div className="highlight-card">
                      <span className="highlight-icon">👨‍🏫</span>
                      <span className="highlight-text">Expert Guide</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div className="itinerary-section">
                  <h2>Daily Itinerary</h2>
                  <div className="itinerary-timeline">
                    {pkg.itinerary.map((day) => (
                      <div key={day.day} className="timeline-item">
                        <div className="timeline-marker">
                          <span className="day-number">Day {day.day}</span>
                        </div>
                        <div className="timeline-content">
                          <h3 className="day-title">{day.title}</h3>
                          <p className="day-description">{day.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'addons' && (
                <div className="addons-section">
                  <h2>Available Add-ons</h2>
                  <p className="addons-intro">Enhance your travel experience with these optional extras</p>
                  
                  <div className="addons-grid">
                    {pkg.addOns.map((addon, index) => (
                      <div key={index} className="addon-card">
                        <div className="addon-header">
                          <h3 className="addon-name">{addon.name}</h3>
                          <span className="addon-price">+${addon.price}</span>
                        </div>
                        {addon.description && (
                          <p className="addon-description">{addon.description}</p>
                        )}
                        <button className="addon-select-btn">
                          Select Add-on
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="booking-column">
            <div className="booking-card">
              <div className="booking-header">
                <h3>Book This Package</h3>
                <div className="price-display">
                  <span className="price-amount">${pkg.pricePerPerson}</span>
                  <span className="price-label">per person</span>
                </div>
              </div>
              <GroupBookingForm pkg={pkg} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}