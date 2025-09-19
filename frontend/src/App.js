import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AddPropertyForm from './components/AddPropertyForm';
import AdminDashboard from './components/AdminDashboard';
import PropertyListing from './components/PropertyListing';
import BookingPage from './components/BookingPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PropertyListing />} />
            <Route path="/add-property" element={<AddPropertyForm />} />
            <Route path="/booking/:propertyId" element={<BookingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<PropertyListing />} />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <p>© 2025 Sri Lanka Institute of Information Technology - SE3080 Software Project Management</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;