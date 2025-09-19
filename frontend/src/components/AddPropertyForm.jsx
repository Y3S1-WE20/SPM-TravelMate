import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddPropertyForm.css';

const AddPropertyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    propertyType: '',
    description: '',
    address: '',
    city: '',
    pricePerNight: '',
    discount: '',
    features: [],
    availability: [],
    ownerName: '',
    contactNumber: '',
    email: ''
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Cleanup URLs on component unmount
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  const propertyTypes = ['Apartment', 'Villa', 'Lodge', 'Room', 'Cottage', 'House', 'Bungalow', 'Studio'];
  
  const featuresOptions = [
    'Breakfast',
    'Free pool access',
    'Medical staff on call',
    'Lunch included',
    'Dinner included',
    'Welcome drink',
    'Parking',
    'Free Premium Wifi',
    'Express check-in',
    'Free WiFi',
    'Air Conditioning',
    'Swimming Pool',
    'Gym',
    'Spa',
    'Pet Friendly'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Store actual files for upload
    setSelectedImages(files);
    
    // Create preview URLs for display
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };

  const removeImage = (indexToRemove) => {
    const newImages = selectedImages.filter((_, index) => index !== indexToRemove);
    const newPreviewUrls = imagePreviewUrls.filter((_, index) => index !== indexToRemove);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[indexToRemove]);
    
    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const handleDateSelect = (date) => {
    setSelectedDates(prev => {
      const newDates = prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date];
      
      setFormData(prevForm => ({
        ...prevForm,
        availability: newDates.map(date => ({
          date: new Date(date),
          available: true
        }))
      }));
      
      return newDates;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'availability') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append images
      selectedImages.forEach((image, index) => {
        submitData.append('images', image);
      });

      const response = await axios.post('http://localhost:5001/api/properties', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('Property added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        propertyType: '',
        description: '',
        address: '',
        city: '',
        pricePerNight: '',
        discount: '',
        features: [],
        availability: [],
        ownerName: '',
        contactNumber: '',
        email: ''
      });
      setSelectedDates([]);
      setSelectedImages([]);
      setImagePreviewUrls([]);
      
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setMessage('Error adding property: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-property-container">
      <h2>Add New Property</h2>
      {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
      
      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-group">
          <label>Property Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Property Type *</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Property Type</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Property Images (Multiple images allowed)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div className="image-preview">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="image-preview-item">
                <img src={url} alt={`Preview ${index + 1}`} />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {selectedImages.length > 0 && (
            <p className="image-count">{selectedImages.length} image(s) selected</p>
          )}
        </div>

        <div className="form-group">
          <label>Price per Night (LKR) *</label>
          <input
            type="number"
            name="pricePerNight"
            value={formData.pricePerNight}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            min="0"
            max="100"
          />
        </div>

        <div className="form-group">
          <label>Property Features</label>
          <div className="features-grid">
            {featuresOptions.map(feature => (
              <label key={feature} className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                />
                {feature}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Availability Calendar *</label>
          <input
            type="date"
            onChange={(e) => handleDateSelect(e.target.value)}
          />
          <div className="selected-dates">
            {selectedDates.map(date => (
              <span key={date} className="date-tag">
                {new Date(date).toLocaleDateString()}
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Owner Name *</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Number *</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding Property...' : 'Add Property'}
        </button>
      </form>
    </div>
  );
};

export default AddPropertyForm;