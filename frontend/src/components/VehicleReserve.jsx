import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './VehicleReserve.css';

const VehicleReserve = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(location.state?.vehicle || null);
  const [loading, setLoading] = useState(!vehicle);
  const [form, setForm] = useState({ pickUpDate: '', dropOffDate: '', firstName: '', lastName: '', email: '', phoneNumber: '' });
  const [submitting, setSubmitting] = useState(false);
  const [totalDays, setTotalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const fetchVehicle = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5001/api/vehicles/${id}`);
      if (res.data.success) setVehicle(res.data.vehicle);
    } catch (err) {
      console.error('Error fetching vehicle', err);
      alert('Error loading vehicle');
      navigate('/vehicles');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!vehicle) fetchVehicle();
  }, [fetchVehicle, vehicle]);

  

  useEffect(() => {
    if (form.pickUpDate && form.dropOffDate && vehicle) {
      const d1 = new Date(form.pickUpDate);
      const d2 = new Date(form.dropOffDate);
      const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      if (diff > 0) {
        setTotalDays(diff);
        setTotalCost(diff * (vehicle.pricePerDay || 0));
      } else {
        setTotalDays(0);
        setTotalCost(0);
      }
    }
  }, [form.pickUpDate, form.dropOffDate, vehicle]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!totalDays) return alert('Please select valid dates');
    setSubmitting(true);
    try {
      const res = await axios.post(`http://localhost:5001/api/vehicles/${id}/reserve`, {
        vehicleId: id,
        pickUpDate: form.pickUpDate,
        dropOffDate: form.dropOffDate,
        totalDays,
        totalCost,
        guestInfo: { firstName: form.firstName, lastName: form.lastName, email: form.email, phoneNumber: form.phoneNumber }
      });
      if (res.data.success) {
        // Redirect to booking summary for vehicles (reuse same summary page)
        navigate('/booking-summary', { state: { bookingData: { propertyTitle: res.data.reservation.vehicleTitle, propertyImage: vehicle.images?.[0] || '', checkIn: res.data.reservation.pickUpDate, checkOut: res.data.reservation.dropOffDate, rooms: 1, adults: 1, children: 0, numberOfNights: res.data.reservation.totalDays, totalCost: res.data.reservation.totalCost, guestInfo: res.data.reservation.guestInfo, bookingId: res.data.reservation._id } } });
      }
    } catch (err) {
      console.error('Error reserving vehicle', err);
      alert(err.response?.data?.message || 'Error reserving vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="vehicle-loading">Loading...</div>;

  return (
    <div className="vehicle-reserve">
      <h2>Reserve {vehicle.title}</h2>
      <div className="reserve-container">
        <div className="vehicle-preview">
          {vehicle.images && vehicle.images.length > 0 ? (
            (() => {
              const img = vehicle.images[0];
              const src = img && typeof img === 'string' && img.startsWith('/') ? `http://localhost:5001${img}` : img;
              return <img src={src} alt={vehicle.title} />;
            })()
          ) : (
            <div className="no-image">No image</div>
          )}
          <p className="price">{vehicle.pricePerDay} per day</p>
        </div>
        <form className="reserve-form" onSubmit={handleSubmit}>
          <label>Pick-up Date</label>
          <input type="date" name="pickUpDate" value={form.pickUpDate} onChange={handleChange} required />
          <label>Drop-off Date</label>
          <input type="date" name="dropOffDate" value={form.dropOffDate} onChange={handleChange} required />

          <label>First name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} required />
          <label>Last name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} required />
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" required />
          <label>Phone</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />

          <div className="summary">
            <p>Days: {totalDays}</p>
            <p>Total Cost: {totalCost}</p>
          </div>

          <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Reserving...' : 'Reserve Vehicle'}</button>
        </form>
      </div>
    </div>
  );
};

export default VehicleReserve;
