import React, { useState, useEffect } from 'react';
import { ooniAPI } from '../utils/api';
import '../styles/OONIPanel.css';

function OONIPanel() {
  const [measurements, setMeasurements] = useState([]);
  const [detectedShutdowns, setDetectedShutdowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('measurements');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadOONIData();
    const interval = setInterval(loadOONIData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const loadOONIData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [measurementsRes, shutdownsRes] = await Promise.allSettled([
        ooniAPI.getFormattedShutdowns(30), // Extended to 30 days
        ooniAPI.getDetectedShutdowns(30)   // Extended to 30 days
      ]);

      if (measurementsRes.status === 'fulfilled' && measurementsRes.value?.data?.data) {
        const data = measurementsRes.value.data.data;
        setMeasurements(Array.isArray(data) ? data : []);
        console.log(`Loaded ${data.length} OONI measurements`);
      } else {
        console.warn('No measurements data received');
        setMeasurements([]);
      }

      if (shutdownsRes.status === 'fulfilled' && shutdownsRes.value?.data?.data) {
        const data = shutdownsRes.value.data.data;
        setDetectedShutdowns(Array.isArray(data) ? data : []);
        console.log(`Loaded ${data.length} detected shutdowns`);
      } else {
        console.warn('No shutdowns data received');
        setDetectedShutdowns([]);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading OONI data:', error);
      setError('Failed to load OONI data');
      // Set empty arrays on error to prevent crashes
      setMeasurements([]);
      setDetectedShutdowns([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown';
      return new Date(dateString).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="ooni-panel">
      <div className="ooni-header">
        <div>
          <h2>🌐 OONI Network Measurements</h2>
          <p className="subtitle">Open Observatory of Network Interference - India (Last 30 days)</p>
        </div>
        {lastUpdated && (
          <span className="last-update">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="ooni-tabs">
        <button
          className={activeTab === 'measurements' ? 'active' : ''}
          onClick={() => setActiveTab('measurements')}
        >
          Measurements ({measurements.length})
        </button>
        <button
          className={activeTab === 'shutdowns' ? 'active' : ''}
          onClick={() => setActiveTab('shutdowns')}
        >
          Detected Shutdowns ({detectedShutdowns.length})
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading OONI data...</div>
      ) : error ? (
        <div className="error-message" style={{textAlign: 'center', padding: '40px', color: '#ef4444'}}>
          {error}
        </div>
      ) : (
        <div className="ooni-content">
          {activeTab === 'measurements' && (
            <div className="measurements-list">
              {!Array.isArray(measurements) || measurements.length === 0 ? (
                <p className="no-data">No recent measurements found</p>
              ) : (
                measurements.slice(0, 10).map((measurement, index) => {
                  if (!measurement) return null;
                  return (
                    <div key={index} className="measurement-card">
                      <div className="measurement-header">
                        <span className="operator-badge">{measurement.operator || 'Unknown'}</span>
                        {measurement.confirmed && (
                          <span className="confirmed-badge">✓ Confirmed</span>
                        )}
                        {measurement.anomaly && (
                          <span className="anomaly-badge">⚠ Anomaly</span>
                        )}
                      </div>
                      <div className="measurement-details">
                        <p><strong>Test:</strong> {measurement.test_name || 'N/A'}</p>
                        <p><strong>ASN:</strong> {measurement.probe_asn || 'N/A'}</p>
                        <p><strong>Time:</strong> {formatDate(measurement.startDate)}</p>
                        <p><strong>Title:</strong> {measurement.title || 'No title'}</p>
                      </div>
                      {measurement.explorer_url && (
                        <a 
                          href={measurement.explorer_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="view-link"
                        >
                          View in OONI Explorer →
                        </a>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'shutdowns' && (
            <div className="shutdowns-list">
              {!Array.isArray(detectedShutdowns) || detectedShutdowns.length === 0 ? (
                <p className="no-data">No shutdowns detected in the last 7 days</p>
              ) : (
                detectedShutdowns.map((shutdown, index) => {
                  if (!shutdown) return null;
                  return (
                    <div key={index} className="shutdown-card">
                      <div className="shutdown-header">
                        <h4>ASN {shutdown.probe_asn || 'Unknown'}</h4>
                        <span className="date-badge">{shutdown.date || 'N/A'}</span>
                      </div>
                      <div className="shutdown-stats">
                        <div className="stat">
                          <span className="stat-label">Measurements:</span>
                          <span className="stat-value">{shutdown.measurementCount || 0}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Confirmed:</span>
                          <span className="stat-value">{shutdown.confirmedCount || 0}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Anomalies:</span>
                          <span className="stat-value">{shutdown.anomalyCount || 0}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Failure Rate:</span>
                          <span className="stat-value failure-rate">
                            {((shutdown.failureRate || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      {shutdown.explorerUrl && (
                        <a 
                          href={shutdown.explorerUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="view-link"
                        >
                          View in OONI Explorer →
                        </a>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      <div className="ooni-footer">
        <p>
          Data provided by <strong>OONI</strong> (Open Observatory of Network Interference)
        </p>
        <a 
          href="https://ooni.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ooni-link"
        >
          Learn more about OONI →
        </a>
      </div>
    </div>
  );
}

export default OONIPanel;
