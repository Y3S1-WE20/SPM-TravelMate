import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VehicleListing.css';
import { FaCar, FaGasPump, FaCog, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaStar, FaInfoCircle } from 'react-icons/fa';

const VehicleListing = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/vehicles');
      if (res.data.success) {
        // Add dummy moderation info for demonstration
        const vehiclesWithModerationInfo = res.data.vehicles.map(v => ({
          ...v,
          moderationInfo: {
            status: Math.random() > 0.2 ? 'verified' : 'pending',
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviewCount: Math.floor(Math.random() * 50) + 5,
            lastInspection: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            features: ['GPS', 'Bluetooth', 'Backup Camera'].filter(() => Math.random() > 0.3)
          }
        }));
        setVehicles(vehiclesWithModerationInfo);
      }
    } catch (err) {
      console.error('Error fetching vehicles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = (vehicle) => {
    // Navigate to booking page for vehicle (to implement reservation flow)
    navigate(`/vehicle/${vehicle._id}/reserve`, { state: { vehicle } });
  };

  const toggleDetails = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  if (loading) return (
    <div className="vehicle-loading">
      <div className="loading-spinner"></div>
      <p>Loading available vehicles...</p>
    </div>
  );

  return (
    <div className="vehicle-listing">
      <header className="listing-header">
        <h2><FaCar /> Available Vehicles</h2>
        <div className="listing-filters">
          <select className="filter-select">
            <option>All Types</option>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Van</option>
          </select>
          <select className="filter-select">
            <option>Sort by: Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>
      </header>

      <div className="vehicle-grid">
        {vehicles.map(v => (
          <div key={v._id} className={`vehicle-card ${v.moderationInfo.status === 'verified' ? 'verified' : ''}`}>
            <div className="vehicle-image">
              {v.moderationInfo.status === 'verified' && (
                <div className="verified-badge">
                  <FaCheckCircle /> Verified
                </div>
              )}
              {v.images && v.images.length > 0 ? (
                (() => {
                  const img = v.images[0];
                  const src = img && typeof img === 'string' && img.startsWith('/') 
                    ? `http://localhost:5001${img}` : img;
                  return <img src={src} alt={v.title} />;
                })()
              ) : (
                <div className="no-image"><FaCar /> No Image</div>
              )}
              <div className="image-overlay">
                <span className="rating">
                  <FaStar /> {v.moderationInfo.rating}
                  <small>({v.moderationInfo.reviewCount} reviews)</small>
                </span>
              </div>
            </div>

            <div className="vehicle-info">
              <div className="vehicle-header">
                <h3>{v.title}</h3>
                <div className="vehicle-price">
                  <strong>${v.pricePerDay}</strong>
                  <span>/day</span>
                </div>
              </div>

              <div className="vehicle-quick-info">
                <div><FaMapMarkerAlt /> {v.location}</div>
                <div><FaUsers /> {v.seats || '4'} seats</div>
                <div><FaGasPump /> {v.fuelType || 'Petrol'}</div>
                <div><FaCog /> {v.transmission || 'Auto'}</div>
              </div>

              <div className="moderation-info">
                <FaCalendarAlt /> Last Inspection: {v.moderationInfo.lastInspection}
              </div>

              <div className="vehicle-features">
                {v.moderationInfo.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">{feature}</span>
                ))}
              </div>

              <div className="vehicle-actions">
                <button className="btn btn-primary" onClick={() => handleReserve(v)}>
                  <FaCalendarAlt /> Reserve Now
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => toggleDetails(v._id)}
                >
                  <FaInfoCircle /> {expandedId === v._id ? 'Less Info' : 'More Info'}
                </button>
              </div>

              {expandedId === v._id && (
                <div className="vehicle-details-dropdown">
                  <div className="details-grid">
                    <div className="detail-item">
                      <strong>Make:</strong> {v.make || '—'}
                    </div>
                    <div className="detail-item">
                      <strong>Model:</strong> {v.model || '—'}
                    </div>
                    <div className="detail-item">
                      <strong>Year:</strong> {v.year || '—'}
                    </div>
                    <div className="detail-item">
                      <strong>Seats:</strong> {v.seats || '—'}
                    </div>
                    <div className="detail-item">
                      <strong>Transmission:</strong> {v.transmission || '—'}
                    </div>
                    <div className="detail-item">
                      <strong>Fuel Type:</strong> {v.fuelType || '—'}
                    </div>
                  </div>
                  {v.description && (
                    <div className="description">
                      <strong>Description:</strong>
                      <p>{v.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleListing;
