// frontend/src/components/Map.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

  // India center coordinates
  const indiaCenter = [22.5, 79];

  // Fetch GeoJSON data for Indian states
  useEffect(() => {
    // For now, we'll create simplified state data
    // In production, fetch from /api/geo/states
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
    if (count === 0) return '#ffffcc';
    if (count <= 3) return '#a1d99b';
    if (count <= 8) return '#31a354';
    return '#006d2c';
  };

  const getRadius = (count) => {
    if (count === 0) return 5;
    if (count <= 3) return 10;
    if (count <= 8) return 15;
    return 20;
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
        <h2>📍 Interactive Map - Internet Shutdowns in India</h2>
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
          
          {/* OpenStreetMap Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* State markers */}
          {stateGeoData.map((state) => (
            <CircleMarker
              key={state.name}
              center={state.coordinates}
              radius={getRadius(state.count)}
              fillColor={getColor(state.count)}
              fillOpacity={0.7}
              color="#000"
              weight={2}
              eventHandlers={{
                click: () => handleStateClick(state.name, state.coordinates)
              }}
            >
              <Popup>
                <div className="map-popup">
                  <h3>{state.name}</h3>
                  <p><strong>{state.count}</strong> shutdown{state.count !== 1 ? 's' : ''}</p>
                  <button 
                    onClick={() => handleStateClick(state.name, state.coordinates)}
                    className="popup-btn"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="map-legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-circle" style={{ backgroundColor: '#ffffcc' }}></div>
            <span>0 shutdowns</span>
          </div>
          <div className="legend-item">
            <div className="legend-circle" style={{ backgroundColor: '#a1d99b' }}></div>
            <span>1-3 shutdowns</span>
          </div>
          <div className="legend-item">
            <div className="legend-circle" style={{ backgroundColor: '#31a354' }}></div>
            <span>4-8 shutdowns</span>
          </div>
          <div className="legend-item">
            <div className="legend-circle" style={{ backgroundColor: '#006d2c' }}></div>
            <span>9+ shutdowns</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;