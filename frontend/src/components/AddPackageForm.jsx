import React, { useState } from 'react';
import './AddPackageForm.css'; // We'll create this CSS file

export default function AddPackageForm() {
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [pricePerPerson, setPricePerPerson] = useState(0);
  const [durationDays, setDurationDays] = useState(1);
  const [message, setMessage] = useState(null);
  const [responseSnippet, setResponseSnippet] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const body = { title, shortDescription, pricePerPerson, durationDays, status: 'published' };
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      // Try to parse JSON, but handle non-JSON responses (e.g. HTML error pages)
      const contentType = res.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await res.json();
        if (res.ok && data.success) {
          setMessage({ text: 'Package created successfully!', type: 'success' });
          // Reset form on success
          setTitle('');
          setShortDescription('');
          setPricePerPerson(0);
          setDurationDays(1);
          setResponseSnippet(null);
        } else {
          setMessage({ text: 'Failed: ' + (data?.message || `status ${res.status}`), type: 'error' });
        }
      } else {
        // fallback to text so we can show HTML errors (Unexpected token '<')
        const text = await res.text();
        const snippet = text.slice(0, 2000);
        setResponseSnippet(snippet);
        setMessage({ text: `Server returned non-JSON response (status ${res.status}). Showing a snippet for debugging.`, type: 'error' });
        return;
      }
    } catch (err) {
      // If the error contains HTML (starts with '<!DOCTYPE' or '<html'), show it in UI
      const msg = err.message || String(err);
      if (msg.includes('<!DOCTYPE') || msg.trim().startsWith('<')) {
        setResponseSnippet(msg.slice(0, 2000));
        setMessage({ text: 'Error: Server returned HTML instead of JSON. Showing snippet below.', type: 'error' });
        console.error('Non-JSON response while creating package:', msg);
      } else {
        setMessage({ text: 'Error: ' + msg, type: 'error' });
      }
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h3>Add New Travel Package</h3>
          <p>Create a new travel package for your customers</p>
        </div>
        
        <form onSubmit={submit} className="package-form">
          <div className="form-group">
            <label className="form-label">Package Title</label>
            <input 
              className="form-input"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Enter package title"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Short Description</label>
            <input 
              className="form-input"
              value={shortDescription} 
              onChange={e => setShortDescription(e.target.value)} 
              placeholder="Brief description of the package"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price per Person ($)</label>
              <input 
                type="number" 
                className="form-input"
                value={pricePerPerson} 
                onChange={e => setPricePerPerson(Number(e.target.value))} 
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Duration (days)</label>
              <input 
                type="number" 
                className="form-input"
                value={durationDays} 
                onChange={e => setDurationDays(Number(e.target.value))} 
                min="1"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="submit-button">Create Package</button>
        </form>
        
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        {responseSnippet && (
          <div className="response-snippet">
            <strong>Server Response Snippet (first 2000 characters):</strong>
            <pre>{responseSnippet}</pre>
          </div>
        )}
      </div>
    </div>
  );
}