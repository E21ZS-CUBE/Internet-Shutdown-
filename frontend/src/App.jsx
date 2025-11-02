import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import { healthCheck } from './utils/api';

function App() {
  const [serverOnline, setServerOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    healthCheck()
      .then(() => {
        setServerOnline(true);
        console.log('✓ Backend server is online');
      })
      .catch(err => {
        console.log('⚠ Backend not found. Using mock data.');
        setServerOnline(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {!serverOnline && (
        <div className="warning-banner">
          ⚠ Backend not connected. Make sure backend is running on http://localhost:5000
        </div>
      )}
      <Dashboard />
    </div>
  );
}

export default App;
