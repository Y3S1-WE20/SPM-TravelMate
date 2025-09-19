import React, { useState } from 'react';
import './PropertyTable.css';

const PropertyTable = ({ properties, onStatusUpdate, onDeleteProperty, showActions = false }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');

  const handleApprove = (propertyId) => {
    onStatusUpdate(propertyId, 'approved');
  };

  const handleReject = (propertyId) => {
    if (!rejectNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    onStatusUpdate(propertyId, 'rejected', rejectNotes);
    setSelectedProperty(null);
    setRejectNotes('');
  };

  const handleDelete = (propertyId) => {
    onDeleteProperty(propertyId);
  };

  const openRejectModal = (property) => {
    setSelectedProperty(property);
    setRejectNotes('');
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setRejectNotes('');
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    
    return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
  };

  return (
    <div className="property-table-container">
      <table className="property-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Type</th>
            <th>City</th>
            <th>Price/Night</th>
            <th>Owner</th>
            <th>Contact</th>
            <th>Status</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {properties.map(property => (
            <tr key={property._id}>
              <td>
                {property.images && property.images.length > 0 && (
                  <img 
                    src={property.images[0]} 
                    alt={property.title} 
                    className="property-thumbnail"
                  />
                )}
              </td>
              <td>{property.title}</td>
              <td>{property.propertyType}</td>
              <td>{property.city}</td>
              <td>LKR {property.pricePerNight}</td>
              <td>{property.ownerName}</td>
              <td>{property.contactNumber}</td>
              <td>{getStatusBadge(property.status)}</td>
              {showActions && (
                <td>
                  <div className="action-buttons">
                    {property.status === 'pending' && (
                      <div className="status-actions">
                        <button 
                          className="btn-approve"
                          onClick={() => handleApprove(property._id)}
                          title="Approve Property"
                        >
                          ✓ Approve
                        </button>
                        <button 
                          className="btn-reject"
                          onClick={() => openRejectModal(property)}
                          title="Reject Property"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}
                    {property.status !== 'pending' && (
                      <span className="action-completed">Processed</span>
                    )}
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(property._id)}
                      title="Delete Property Permanently"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {properties.length === 0 && (
        <div className="no-properties">No properties found</div>
      )}

      {/* Reject Modal */}
      {selectedProperty && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reject Property Listing</h3>
            <p>Are you sure you want to reject "{selectedProperty.title}"?</p>
            <textarea
              placeholder="Please provide a reason for rejection..."
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={closeModal}>Cancel</button>
              <button 
                className="btn-confirm-reject"
                onClick={() => handleReject(selectedProperty._id)}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyTable;