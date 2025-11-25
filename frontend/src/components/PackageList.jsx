import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PackageList.css'; // We'll create this CSS file

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/packages');
        if (!response.ok) {
          throw new Error(`Failed to fetch packages: ${response.status}`);
        }
        const data = await response.json();
        setPackages(data.data || []);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError('Failed to load packages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="packages-container">
        <div className="packages-loading">
          <div className="loading-spinner"></div>
          <p>Loading travel packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="packages-container">
        <div className="packages-error">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Packages</h3>
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

  return (
    <div className="packages-container">
      <div className="packages-header">
        <div className="header-content">
          <h1>Travel Packages</h1>
          <p>Discover amazing travel experiences around the world</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{packages.length}</span>
            <span className="stat-label">Total Packages</span>
          </div>
        </div>
      </div>

      <div className="packages-content">
        {packages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✈️</div>
            <h3>No Packages Available</h3>
            <p>There are no travel packages to display at the moment.</p>
            <Link to="/add-package" className="cta-button">
              Create First Package
            </Link>
          </div>
        ) : (
          <div className="packages-grid">
            {packages.map((pkg) => (
              <div key={pkg._id} className="package-card">
                <div className="card-header">
                  <h3 className="package-title">{pkg.title}</h3>
                  <div className="price-tag">
                    ${pkg.pricePerPerson}
                    <span className="price-label">/person</span>
                  </div>
                </div>
                
                <p className="package-description">{pkg.shortDescription}</p>
                
                <div className="card-footer">
                  <div className="package-meta">
                    <span className="duration-badge">
                      📅 {pkg.durationDays} {pkg.durationDays === 1 ? 'day' : 'days'}
                    </span>
                    <span className={`status-badge status-${pkg.status || 'published'}`}>
                      {pkg.status || 'Published'}
                    </span>
                  </div>
                  <Link 
                    to={`/packages/${pkg._id}`} 
                    className="view-details-button"
                  >
                    View Details
                    <span className="button-arrow">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}