import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';

import Header from './components/Header';
import PropertyListing from './components/PropertyListing';
import BookingPage from './components/BookingPage';
import BookingSummary from './components/BookingSummary';
import AddPropertyForm from './components/AddPropertyForm';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PropertyListing />} />
            <Route path="/properties" element={<PropertyListing />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/booking-summary" element={<BookingSummary />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-property" 
              element={
                <ProtectedRoute requiredRole="hotel owner">
                  <AddPropertyForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;