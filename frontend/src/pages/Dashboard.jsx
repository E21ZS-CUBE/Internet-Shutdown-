import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import DataTable from '../components/DataTable';
import Charts from '../components/Charts';
import Toggle from '../components/Toggle';
import Stats from '../components/Stats';
import TwitterFeed from '../components/TwitterFeed';
import OONIPanel from '../components/OONIPanel';
import { shutdownsAPI, statisticsAPI, statesAPI, ooniAPI } from '../utils/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [shutdownType, setShutdownType] = useState('FULL');
  const [shutdowns, setShutdowns] = useState([]);
  const [realtimeData, setRealtimeData] = useState([]);
  const [ooniData, setOoniData] = useState([]);
  const [stats, setStats] = useState(null);
  const [stateCounts, setStateCounts] = useState({});
  const [selectedState, setSelectedState] = useState(null);
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    reason: ''
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showOONI, setShowOONI] = useState(true);

  useEffect(() => {
    loadData();
    
    // Poll for real-time data every 30 seconds
    const realtimeInterval = setInterval(loadRealtimeData, 30000);
    
    return () => {
      clearInterval(realtimeInterval);
    };
  }, [shutdownType, filters.state, filters.district, filters.reason]);

  // Separate effect for OONI data to prevent blocking main data load
  useEffect(() => {
    // Only try to load OONI data once on mount
    loadOONIData().catch(() => {
      console.log('OONI service unavailable, skipping...');
      setShowOONI(false);
    });
  }, []);

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
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRealtimeData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/shutdowns/realtime/live');
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setRealtimeData(data.data);
          console.log(`✓ Real-time data updated: ${data.data.length} records from live APIs`);
        }
      }
    } catch (error) {
      console.warn('Real-time data fetch failed:', error);
    }
  };

  const loadOONIData = async () => {
    try {
      const response = await ooniAPI.getFormattedShutdowns(30); // Extended to 30 days
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setOoniData(response.data.data);
        console.log(`✓ OONI data updated: ${response.data.data.length} measurements`);
        setShowOONI(true);
      } else {
        console.warn('No OONI data available');
        setOoniData([]);
        setShowOONI(false);
      }
    } catch (error) {
      console.warn('OONI data fetch failed:', error);
      setOoniData([]); // Set empty array on error
      setShowOONI(false); // Hide OONI panel if API fails
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

  const combinedShutdowns = [
    ...shutdowns,
    ...realtimeData,
    ...(Array.isArray(ooniData) ? ooniData : [])
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🌐 InternetShutdowns.in Tracker</h1>
        <p>Documenting Internet Shutdowns in India (Real-time + Historical Data)</p>
        {lastUpdated && (
          <p className="last-updated">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        )}
      </header>

      <div className="toggle-section">
        <Toggle value={shutdownType} onChange={handleToggle} />
      </div>

      {stats && <Stats stats={stats} />}

      <div className="realtime-indicator">
        {realtimeData.length > 0 && (
          <span className="badge-live">🔴 LIVE: {realtimeData.length} real-time records</span>
        )}
        {ooniData.length > 0 && (
          <span className="badge-ooni" style={{marginLeft: '10px', backgroundColor: '#9333ea', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px'}}>
            🌐 OONI: {ooniData.length} network measurements
          </span>
        )}
      </div>

      <div className="main-content">
        {combinedShutdowns.length > 0 && (
          <Map shutdowns={combinedShutdowns} stateCounts={stateCounts} onStateSelect={handleStateSelect} />
        )}
        
        {showOONI && <OONIPanel />}
        
        <Charts shutdowns={combinedShutdowns} shutdownType={shutdownType} />
        
        <DataTable 
          shutdowns={combinedShutdowns} 
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
