import React from 'react';
import '../styles/Stats.css';

function Stats({ stats }) {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>{stats.totalShutdowns || 0}</h3>
        <p>Total Shutdowns</p>
      </div>
      <div className="stat-card">
        <h3>{stats.mostAffectedState || 'N/A'}</h3>
        <p>Most Affected State</p>
      </div>
      <div className="stat-card">
        <h3>{stats.avgDuration || 0}h</h3>
        <p>Average Duration</p>
      </div>
      <div className="stat-card">
        <h3>{stats.activeShutdowns || 0}</h3>
        <p>Currently Active</p>
      </div>
    </div>
  );
}

export default Stats;
