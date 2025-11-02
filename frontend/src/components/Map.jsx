import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { sflcAPI, cloudflareAPI } from '../utils/api';
import '../styles/Map.css';

function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

function Map({ shutdowns, stateCounts, onStateSelect }) {
  const [selectedState, setSelectedState] = useState(null);
  const [mapCenter, setMapCenter] = useState([22.5, 79]);
  const [mapZoom, setMapZoom] = useState(5);
  const [stateGeoData, setStateGeoData] = useState([]);
  const [sflcData, setSflcData] = useState([]);
  const [cloudflareData, setCloudflareData] = useState([]);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [activeShutdowns, setActiveShutdowns] = useState([]);

  const indiaCenter = [22.5, 79];

  useEffect(() => {
    // Load SFLC.in data
    const loadSFLCData = async () => {
      try {
        const response = await sflcAPI.getShutdowns();
        if (response?.data?.data) {
          setSflcData(response.data.data);
          console.log(`✓ Loaded ${response.data.data.length} shutdowns from SFLC.in`);
        }
      } catch (error) {
        console.warn('Failed to load SFLC.in data:', error);
      }
    };

    // Load Cloudflare Radar data
    const loadCloudflareData = async () => {
      try {
        const response = await cloudflareAPI.getFormattedOutages();
        if (response?.data?.data) {
          setCloudflareData(response.data.data);
          console.log(`✓ Loaded ${response.data.data.length} outages from Cloudflare Radar`);
        }
      } catch (error) {
        console.warn('Failed to load Cloudflare data:', error);
      }
    };

    loadSFLCData();
    loadCloudflareData();
    
    // Refresh data every 10 minutes
    const interval = setInterval(() => {
      loadSFLCData();
      loadCloudflareData();
    }, 600000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Combine shutdowns from all sources for map markers
    const combined = [...shutdowns, ...sflcData, ...cloudflareData];
    setActiveShutdowns(combined);
  }, [shutdowns, sflcData, cloudflareData]);

  useEffect(() => {
    const generateStateData = () => {
      const stateCoordinates = {
        'Maharashtra': [19.7515, 75.7139],
        'Karnataka': [15.3173, 75.7139],
        'Tamil Nadu': [11.1271, 78.6569],
        'West Bengal': [22.9868, 87.8550],
        'Uttar Pradesh': [26.8467, 80.9462],
        'Bihar': [25.0961, 85.3131],
        'Rajasthan': [27.0238, 74.2179],
        'Madhya Pradesh': [22.9734, 78.6569],
        'Haryana': [29.0588, 76.0856],
        'Assam': [26.2006, 92.9376],
        'Delhi': [28.7041, 77.1025],
        'Jammu & Kashmir': [33.7782, 76.5762],
        'Manipur': [24.6637, 93.9063],
        'Gujarat': [22.2587, 71.1924]
      };
      
      return Object.entries(stateCoordinates).map(([name, coords]) => ({
        name,
        coordinates: coords,
        count: stateCounts[name] || 0
      }));
    };
    
    setStateGeoData(generateStateData());
  }, [stateCounts]);

  const getColor = (count) => {
    if (count === 0) return '#cbd5e1';
    if (count <= 3) return '#fbbf24';
    if (count <= 8) return '#f97316';
    return '#dc2626';
  };

  const getRadius = (count) => {
    if (count === 0) return 8;
    if (count <= 3) return 12;
    if (count <= 8) return 18;
    return 25;
  };

  const getShutdownColor = (shutdown) => {
    if (shutdown.sourceType === 'CLOUDFLARE_RADAR') return '#f97316'; // Orange for Cloudflare
    if (shutdown.sourceType === 'SFLC_IN') return '#8b5cf6'; // Purple for SFLC
    if (shutdown.sourceType === 'OONI_API') return '#06b6d4'; // Cyan for OONI
    if (shutdown.shutdownType === 'FULL') return '#ef4444'; // Red for full shutdowns
    return '#f59e0b'; // Amber for throttled
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleStateClick = (stateName, coords) => {
    setSelectedState(stateName);
    setMapCenter(coords);
    setMapZoom(7);
    onStateSelect(stateName);
  };

  const resetMap = () => {
    setSelectedState(null);
    setMapCenter(indiaCenter);
    setMapZoom(5);
    onStateSelect(null);
  };

  return (
    <div className="map-section">
      <div className="map-header">
        <div>
          <h2>📍 Interactive Map - Internet Shutdowns in India</h2>
          <p className="map-subtitle">
            Showing {activeShutdowns.length} shutdown events 
            {cloudflareData.length > 0 && (
              <span className="cloudflare-badge"> • {cloudflareData.length} from Cloudflare Radar</span>
            )}
            {sflcData.length > 0 && (
              <span className="sflc-badge"> • {sflcData.length} from SFLC.in</span>
            )}
          </p>
        </div>
        {selectedState && (
          <button onClick={resetMap} className="reset-button">
            ← Back to India View
          </button>
        )}
      </div>
      
      <div className="map-container" style={{ height: '600px', width: '100%' }}>
        <MapContainer
          center={indiaCenter}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {stateGeoData.map((state) => (
            <CircleMarker
              key={state.name}
              center={state.coordinates}
              radius={getRadius(state.count)}
              fillColor={getColor(state.count)}
              fillOpacity={hoveredMarker === state.name ? 0.9 : 0.6}
              color="#fff"
              weight={hoveredMarker === state.name ? 3 : 2}
              eventHandlers={{
                click: () => handleStateClick(state.name, state.coordinates),
                mouseover: () => setHoveredMarker(state.name),
                mouseout: () => setHoveredMarker(null)
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                <div style={{ fontSize: '12px', fontWeight: '600' }}>
                  {state.name}: {state.count} shutdown{state.count !== 1 ? 's' : ''}
                </div>
              </Tooltip>
              <Popup maxWidth={300}>
                <div className="map-popup enhanced">
                  <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>{state.name}</h3>
                  <div className="popup-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Shutdowns:</span>
                      <span className="stat-value">{state.count}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStateClick(state.name, state.coordinates)}
                    className="popup-btn"
                  >
                    🔍 View Detailed Events
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Individual shutdown markers */}
          {activeShutdowns.map((shutdown, index) => {
            const coords = shutdown.coordinates || 
              (shutdown.state && stateGeoData.find(s => s.name === shutdown.state)?.coordinates);
            
            if (!coords) return null;

            const lat = coords.lat || coords[0];
            const lng = coords.lng || coords[1];

            if (!lat || !lng) return null;

            return (
              <CircleMarker
                key={`shutdown-${index}`}
                center={[lat, lng]}
                radius={8}
                fillColor={getShutdownColor(shutdown)}
                fillOpacity={hoveredMarker === `shutdown-${index}` ? 1 : 0.7}
                color="#fff"
                weight={2}
                eventHandlers={{
                  mouseover: () => setHoveredMarker(`shutdown-${index}`),
                  mouseout: () => setHoveredMarker(null)
                }}
              >
                <Tooltip direction="top" offset={[0, -5]} opacity={0.95}>
                  <div style={{ fontSize: '11px' }}>
                    <strong>{shutdown.district || shutdown.state}</strong><br/>
                    {formatDate(shutdown.startDate)}
                  </div>
                </Tooltip>
                <Popup maxWidth={350}>
                  <div className="map-popup detailed">
                    <div className="popup-header">
                      <h4 style={{ margin: 0, color: '#1f2937' }}>
                        {shutdown.district ? `${shutdown.district}, ` : ''}{shutdown.state}
                      </h4>
                      <span className={`source-badge ${shutdown.sourceType?.toLowerCase()}`}>
                        {shutdown.sourceType === 'CLOUDFLARE_RADAR' ? 'Cloudflare Radar' :
                         shutdown.sourceType === 'SFLC_IN' ? 'SFLC.in' : 
                         shutdown.sourceType === 'OONI_API' ? 'OONI' : 
                         shutdown.sourceType || 'Database'}
                      </span>
                    </div>
                    
                    <div className="popup-details">
                      <div className="detail-row">
                        <span className="label">📅 Start Date:</span>
                        <span className="value">{formatDate(shutdown.startDate)}</span>
                      </div>
                      
                      {shutdown.endDate && (
                        <div className="detail-row">
                          <span className="label">📅 End Date:</span>
                          <span className="value">{formatDate(shutdown.endDate)}</span>
                        </div>
                      )}
                      
                      <div className="detail-row">
                        <span className="label">🔴 Type:</span>
                        <span className="value">
                          <span className={`type-badge ${shutdown.shutdownType?.toLowerCase()}`}>
                            {shutdown.shutdownType || 'FULL'}
                          </span>
                        </span>
                      </div>
                      
                      {shutdown.reason && (
                        <div className="detail-row">
                          <span className="label">📝 Reason:</span>
                          <span className="value">{shutdown.reason}</span>
                        </div>
                      )}
                      
                      {shutdown.reasonCategory && (
                        <div className="detail-row">
                          <span className="label">🏷️ Category:</span>
                          <span className="value">
                            <span className="category-badge">{shutdown.reasonCategory}</span>
                          </span>
                        </div>
                      )}
                      
                      {shutdown.durationHours && (
                        <div className="detail-row">
                          <span className="label">⏱️ Duration:</span>
                          <span className="value">{shutdown.durationHours} hours</span>
                        </div>
                      )}
                      
                      {shutdown.affectedServices && shutdown.affectedServices.length > 0 && (
                        <div className="detail-row">
                          <span className="label">📶 Services:</span>
                          <span className="value">{shutdown.affectedServices.join(', ')}</span>
                        </div>
                      )}
                      
                      {shutdown.operator && (
                        <div className="detail-row">
                          <span className="label">📡 Operator:</span>
                          <span className="value">{shutdown.operator}</span>
                        </div>
                      )}
                    </div>
                    
                    {shutdown.sourceUrl && (
                      <a 
                        href={shutdown.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="source-link"
                      >
                        🔗 View Source →
                      </a>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <div className="map-legend">
        <h4>Legend</h4>
        <div className="legend-section">
          <p className="legend-title">State Shutdown Count:</p>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-circle" style={{ backgroundColor: '#cbd5e1' }}></div>
              <span>0 shutdowns</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle" style={{ backgroundColor: '#fbbf24' }}></div>
              <span>1-3 shutdowns</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle" style={{ backgroundColor: '#f97316' }}></div>
              <span>4-8 shutdowns</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle" style={{ backgroundColor: '#dc2626' }}></div>
              <span>9+ shutdowns</span>
            </div>
          </div>
        </div>
        
        <div className="legend-section">
          <p className="legend-title">Data Sources:</p>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-circle" style={{ backgroundColor: '#f97316' }}></div>
              <span>Cloudflare Radar</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle" style={{ backgroundColor: '#8b5cf6' }}></div>
              <span>SFLC.in</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle" style={{ backgroundColor: '#06b6d4' }}></div>
              <span>OONI</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle" style={{ backgroundColor: '#ef4444' }}></div>
              <span>Database</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;
