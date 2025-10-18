import React, { useState } from 'react';
import './Dashboard.css';

const DataTable = ({
  title,
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  emptyIcon = '📊',
  actions = [],
  searchable = true,
  filterable = false,
  filters = [],
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const filteredData = data.filter(item => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = columns.some(column => {
        const value = item[column.key];
        return value && value.toString().toLowerCase().includes(searchLower);
      });
      if (!matchesSearch) return false;
    }

    // Column filters
    for (const [key, value] of Object.entries(activeFilters)) {
      if (value && item[key] !== value) {
        return false;
      }
    }

    return true;
  });

  const handleFilterChange = (columnKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  if (loading) {
    return (
      <div className={`dashboard-card ${className}`}>
        <div className="card-content text-center">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`data-table-container ${className}`}>
      <div className="table-header">
        <h3 className="table-title">{title}</h3>
        <div className="table-controls">
          {searchable && (
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ width: '200px' }}
            />
          )}
          {filters.map(filter => (
            <select
              key={filter.key}
              value={activeFilters[filter.key] || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="form-select"
            >
              <option value="">{filter.label}</option>
              {filter.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{emptyIcon}</div>
          <div className="empty-title">No Data Found</div>
          <div className="empty-description">
            {searchTerm || Object.keys(activeFilters).some(key => activeFilters[key])
              ? 'Try adjusting your search or filters.'
              : emptyMessage}
          </div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(column => (
                  <th key={column.key} style={{ width: column.width }}>
                    {column.label}
                  </th>
                ))}
                {actions.length > 0 && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item._id || index}>
                  {columns.map(column => (
                    <td key={column.key}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(item)}
                            className={`btn btn-sm ${action.variant || 'btn-secondary'}`}
                            disabled={action.disabled?.(item)}
                          >
                            {action.icon && <span>{action.icon}</span>}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredData.length > 0 && (
        <div className="card-footer">
          <span className="text-sm text-gray-600">
            Showing {filteredData.length} of {data.length} entries
          </span>
        </div>
      )}
    </div>
  );
};

export default DataTable;