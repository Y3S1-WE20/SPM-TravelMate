import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VehicleDetail.css';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rental, setRental] = useState({ startDate: '', endDate: '', driver:false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/vehicles/${id}`);
      if (res.data.success) setVehicle(res.data.vehicle);
    } catch (err) {
      console.error('Fetch vehicle error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setRental(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    if (!rental.startDate || !rental.endDate) return alert('Please select rental dates');
    setSubmitting(true);
    try {
      // In a real app you'd create a rental record. For now, redirect to booking summary page
      const bookingData = {
        propertyId: vehicle._id,
        propertyTitle: vehicle.title,
        propertyImage: vehicle.images[0] || '',
        checkIn: rental.startDate,
        checkOut: rental.endDate,
        rooms: 1,
        adults: 1,
        children: 0,
        numberOfNights: (new Date(rental.endDate) - new Date(rental.startDate)) / (1000*60*60*24),
        totalCost: ((new Date(rental.endDate) - new Date(rental.startDate)) / (1000*60*60*24)) * vehicle.pricePerDay,
        guestInfo: { firstName: 'Guest', lastName: '', email: '', phoneNumber: '' },
        bookingDate: new Date().toISOString(),
        status: 'pending'
      };

      // you can post to booking endpoint here if you want
      navigate('/booking-summary', { state: { bookingData } });
    } catch (err) {
      console.error('Rental submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading vehicle...</div>;
  if (!vehicle) return <div>Vehicle not found</div>;

  return (
    <div className="vehicle-detail">
      <h2>{vehicle.title}</h2>
      <div className="vehicle-top">
        <div className="vehicle-images">
          {vehicle.images && vehicle.images.length > 0 ? (
            vehicle.images.map((img, idx) => (
              <img key={idx} src={img} alt={`${vehicle.title} ${idx}`} />
            ))
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>
        <div className="vehicle-info">
          <p className="vehicle-type">{vehicle.vehicleType} • {vehicle.transmission}</p>
          <p className="vehicle-price">${vehicle.pricePerDay} / day</p>

          <div className="rental-form">
            <label>Start Date<br/>
              <input type="date" name="startDate" value={rental.startDate} onChange={handleChange} />
            </label>
            <label>End Date<br/>
              <input type="date" name="endDate" value={rental.endDate} onChange={handleChange} />
            </label>
            <label>
              <input type="checkbox" name="driver" checked={rental.driver} onChange={handleChange} /> Include driver
            </label>

            <button className="btn" onClick={handleSubmit} disabled={submitting}>Reserve Vehicle</button>
          </div>
        </div>
      </div>

      <div className="vehicle-description">
        <h3>Description</h3>
        <p>{vehicle.description}</p>
      </div>
    </div>
  );
};

export default VehicleDetail;
