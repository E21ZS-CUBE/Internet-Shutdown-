// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import DataTable from '../components/DataTable';
import Charts from '../components/Charts';
import Toggle from '../components/Toggle';
import Stats from '../components/Stats';
import TwitterFeed from '../components/TwitterFeed';
import { shutdownsAPI, statisticsAPI, statesAPI } from '../utils/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [shutdownType, setShutdownType] = useState('FULL');
  const [shutdowns, setShutdowns] = useState([]);
  const [stats, setStats] = useState(null);
  const [stateCounts, setStateCounts] = useState({});
  const [selectedState, setSelectedState] = useState(null);
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    reason: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [shutdownType, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {
        type: shutdownType,
        page: 1,
        limit: 1000,
        ...filters
      };

      const [shutdownsRes, statsRes, countsRes] = await Promise.all([
        shutdownsAPI.getAll(params),
        statisticsAPI.getOverall(shutdownType),
        statesAPI.getCounts(shutdownType)
      ]);

      setShutdowns(shutdownsRes.data.data || []);
      setStats(statsRes.data.data || {});
      setStateCounts(countsRes.data.data || {});
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (type) => {
    setShutdownType(type);
    setSelectedState(null);
  };

  const handleStateSelect = (stateName) => {
    setSelectedState(stateName);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🌐 InternetShutdowns.in Tracker</h1>
        <p>Documenting Internet Shutdowns in India</p>
      </header>

      <div className="toggle-section">
        <Toggle value={shutdownType} onChange={handleToggle} />
      </div>

      {stats && <Stats stats={stats} />}

      <div className="main-content">
        {shutdowns.length > 0 && (
          <Map shutdowns={shutdowns} stateCounts={stateCounts} onStateSelect={handleStateSelect} />
        )}
        
        <Charts shutdowns={shutdowns} shutdownType={shutdownType} />
        
        <DataTable 
          shutdowns={shutdowns} 
          selectedState={selectedState}
          onFilterChange={handleFilterChange}
          loading={loading}
        />
      </div>

      <TwitterFeed />
    </div>
  );
}

export default Dashboard;