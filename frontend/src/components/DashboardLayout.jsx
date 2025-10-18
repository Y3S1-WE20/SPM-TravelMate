import React from 'react';
import './Dashboard.css';

const DashboardLayout = ({
  title,
  subtitle,
  headerActions = [],
  tabs = [],
  activeTab,
  onTabChange,
  children,
  className = ''
}) => {
  return (
    <div className={`dashboard-container ${className}`}>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">{title}</h1>
          {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {headerActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`btn ${action.variant || 'btn-primary'}`}
              disabled={action.disabled}
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      {tabs.length > 0 && (
        <nav className="dashboard-nav">
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.icon && <span style={{ marginRight: '8px' }}>{tab.icon}</span>}
                {tab.label}
                {tab.badge && (
                  <span style={{
                    marginLeft: '8px',
                    background: 'var(--primary-color)',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Content */}
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;