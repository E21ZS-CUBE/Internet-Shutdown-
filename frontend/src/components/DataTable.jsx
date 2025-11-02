// frontend/src/components/DataTable.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import '../styles/DataTable.css';

function DataTable({ shutdowns, selectedState, onFilterChange, loading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    reason: '',
    verified: 'all'
  });
  const [sortConfig, setSortConfig] = useState({ key: 'startDate', direction: 'desc' });
  
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm, selectedState]);

  const filteredData = shutdowns.filter(shutdown => {
    const matchesSearch = searchTerm === '' || 
      shutdown.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shutdown.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shutdown.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesState = selectedState === null || shutdown.state === selectedState;
    const matchesFilter = (filters.state === '' || shutdown.state === filters.state) &&
                         (filters.district === '' || shutdown.district.toLowerCase().includes(filters.district.toLowerCase())) &&
                         (filters.reason === '' || shutdown.reasonCategory === filters.reason) &&
                         (filters.verified === 'all' || shutdown.isVerified.toString() === filters.verified);
    
    return matchesSearch && matchesState && matchesFilter;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    setFilters({ state: '', district: '', reason: '', verified: 'all' });
    setSearchTerm('');
    onFilterChange({});
  };

  const getStatusBadge = (shutdown) => {
    if (!shutdown.endDate) return <span className="badge ongoing">Ongoing</span>;
    if (shutdown.isVerified) return <span className="badge verified">Verified</span>;
    return <span className="badge unverified">Unverified</span>;
  };

  const getTypeBadge = (shutdown) => {
    if (shutdown.shutdownType === 'FULL') {
      return <span className="badge-type full">Full Shutdown</span>;
    }
    return (
      <span className="badge-type throttled">
        Throttled ({shutdown.throttlingFrom} → {shutdown.throttlingTo})
      </span>
    );
  };

  return (
    <div className="datatable-container">
      <div className="datatable-header">
        <h2>📋 Shutdown Records</h2>
        <div className="datatable-stats">
          <span>Total: {filteredData.length} records</span>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search state, district, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-row">
          <select 
            value={filters.reason}
            onChange={(e) => handleFilterChange('reason', e.target.value)}
            className="filter-select"
          >
            <option value="">All Reasons</option>
            <option value="VIOLENCE">Violence</option>
            <option value="PROTEST">Protest</option>
            <option value="EXAM">Exam</option>
            <option value="SECURITY">Security</option>
            <option value="POLITICAL">Political</option>
            <option value="OTHER">Other</option>
          </select>

          <select 
            value={filters.verified}
            onChange={(e) => handleFilterChange('verified', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="true">Verified Only</option>
            <option value="false">Unverified Only</option>
          </select>

          <input
            type="text"
            placeholder="Filter by district"
            value={filters.district}
            onChange={(e) => handleFilterChange('district', e.target.value)}
            className="filter-input"
          />

          <button onClick={resetFilters} className="reset-filters-btn">
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('state')} className="sortable">
                    State {sortConfig.key === 'state' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('district')} className="sortable">
                    District {sortConfig.key === 'district' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('startDate')} className="sortable">
                    Date {sortConfig.key === 'startDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Duration</th>
                  <th>Type</th>
                  <th onClick={() => handleSort('reasonCategory')} className="sortable">
                    Reason {sortConfig.key === 'reasonCategory' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Operators</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">No records found</td>
                  </tr>
                ) : (
                  paginatedData.map((shutdown) => (
                    <tr key={shutdown.id || shutdown._id}>
                      <td>{shutdown.state}</td>
                      <td>{shutdown.district}</td>
                      <td>
                        {format(new Date(shutdown.startDate), 'MMM dd, yyyy')}
                      </td>
                      <td>{shutdown.durationHours}h</td>
                      <td>{getTypeBadge(shutdown)}</td>
                      <td>
                        <span className={`reason-badge ${shutdown.reasonCategory.toLowerCase()}`}>
                          {shutdown.reasonCategory}
                        </span>
                      </td>
                      <td>
                        <div className="operators-list">
                          {shutdown.operators?.map((op, idx) => (
                            <span key={idx} className="operator-tag">
                              {op.operatorName} ({op.towersBlocked})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{getStatusBadge(shutdown)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`page-num ${currentPage === idx + 1 ? 'active' : ''}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DataTable;
