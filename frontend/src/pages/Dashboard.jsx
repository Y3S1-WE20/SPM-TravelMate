import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/AdminDashboard';
import TravellerDashboard from '../components/TravellerDashboard';
import HotelOwnerDashboard from '../components/HotelOwnerDashboard';

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Route to appropriate dashboard based on user role
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user.role === 'hotel owner') {
    return <HotelOwnerDashboard />;
  }

  // Default to traveller dashboard for regular users
  return <TravellerDashboard />;
}

export default Dashboard;