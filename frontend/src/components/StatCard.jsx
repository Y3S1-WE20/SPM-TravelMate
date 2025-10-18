import React from 'react';
import './Dashboard.css';

const StatCard = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  variant = 'primary',
  className = ''
}) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
      } else if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
      return val.toLocaleString();
    }
    return val;
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive':
        return '↗️';
      case 'negative':
        return '↘️';
      default:
        return '→';
    }
  };

  return (
    <div className={`stat-card ${variant} ${className}`}>
      <div className={`stat-icon ${variant}`}>
        {icon}
      </div>
      <div className="stat-value">{formatValue(value)}</div>
      <div className="stat-label">{title}</div>
      {change !== undefined && (
        <div className={`stat-change ${changeType}`}>
          <span>{getChangeIcon(changeType)}</span>
          <span>{Math.abs(change)}%</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;