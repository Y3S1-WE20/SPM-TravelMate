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
import VehicleListing from './components/VehicleListing';
import AdminAddVehicle from './components/AdminAddVehicle';
import VehicleReserve from './components/VehicleReserve';
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
            <Route path="/vehicle/:id/reserve" element={<VehicleReserve />} />
            <Route path="/vehicles" element={<VehicleListing />} />
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
              path="/admin/add-vehicle" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminAddVehicle />
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