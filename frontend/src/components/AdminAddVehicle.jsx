import React, { useState } from 'react';
import axios from 'axios';
import './AdminAddVehicle.css';

const AdminAddVehicle = () => {
  const [form, setForm] = useState({
    title: '', make: '', model: '', year: '', seats: 4, transmission: 'auto', fuelType: 'petrol', pricePerDay: '', location: '', description: ''
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFiles = (e) => setImages(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k]));
      images.forEach(img => fd.append('images', img));

      const res = await axios.post('http://localhost:5001/api/vehicles', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) {
        alert('Vehicle added successfully');
        setForm({ title: '', make: '', model: '', year: '', seats: 4, transmission: 'auto', fuelType: 'petrol', pricePerDay: '', location: '', description: '' });
        setImages([]);
      }
    } catch (err) {
      console.error('Error adding vehicle', err);
      alert('Error adding vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-add-vehicle">
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="vehicle-form">
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />
        <label>Make</label>
        <input name="make" value={form.make} onChange={handleChange} />
        <label>Model</label>
        <input name="model" value={form.model} onChange={handleChange} />
        <label>Year</label>
        <input name="year" value={form.year} onChange={handleChange} />
        <label>Seats</label>
        <input name="seats" value={form.seats} onChange={handleChange} type="number" />
        <label>Transmission</label>
        <select name="transmission" value={form.transmission} onChange={handleChange}>
          <option value="auto">Automatic</option>
          <option value="manual">Manual</option>
        </select>
        <label>Fuel Type</label>
        <select name="fuelType" value={form.fuelType} onChange={handleChange}>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <label>Price per day</label>
        <input name="pricePerDay" value={form.pricePerDay} onChange={handleChange} required type="number" />
        <label>Location</label>
        <input name="location" value={form.location} onChange={handleChange} />
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} />

        <label>Images</label>
        <input type="file" multiple accept="image/*" onChange={handleFiles} />

        <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Vehicle'}</button>
      </form>
    </div>
  );
};

export default AdminAddVehicle;
