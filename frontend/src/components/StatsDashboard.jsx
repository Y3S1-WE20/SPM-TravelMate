import React from 'react';
import './StatsDashboard.css';

const StatsDashboard = ({ stats, bookingStats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="stats-dashboard">
      <h2>Dashboard Overview</h2>
      
      {/* Property Statistics */}
      <div className="stats-section">
        <h3>Property Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card total">
            <h4>Total Properties</h4>
            <div className="stat-number">{stats.total}</div>
          </div>
          
          <div className="stat-card pending">
            <h4>Pending Approval</h4>
            <div className="stat-number">{stats.pending}</div>
          </div>
          
          <div className="stat-card approved">
            <h4>Approved</h4>
            <div className="stat-number">{stats.approved}</div>
          </div>
          
          <div className="stat-card rejected">
            <h4>Rejected</h4>
            <div className="stat-number">{stats.rejected}</div>
          </div>
        </div>
      </div>

      {/* Booking Statistics */}
      {bookingStats && (
        <div className="stats-section">
          <h3>Booking Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card total">
              <h4>Total Bookings</h4>
              <div className="stat-number">{bookingStats.total}</div>
            </div>
            
            <div className="stat-card pending">
              <h4>Pending</h4>
              <div className="stat-number">{bookingStats.pending || 0}</div>
            </div>
            
            <div className="stat-card approved">
              <h4>Confirmed</h4>
              <div className="stat-number">{bookingStats.confirmed || 0}</div>
            </div>
            
            <div className="stat-card revenue">
              <h4>Total Revenue</h4>
              <div className="stat-number">{formatCurrency(bookingStats.totalRevenue || 0)}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Property Chart */}
      <div className="stats-section">
        <h3>Property Distribution</h3>
        <div className="stats-chart">
          <div className="chart-bar">
            <div 
              className="chart-fill approved-fill" 
              style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
            >
              Approved: {stats.approved}
            </div>
          </div>
          <div className="chart-bar">
            <div 
              className="chart-fill pending-fill" 
              style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
            >
              Pending: {stats.pending}
            </div>
          </div>
          <div className="chart-bar">
            <div 
              className="chart-fill rejected-fill" 
              style={{ width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%` }}
            >
              Rejected: {stats.rejected}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;