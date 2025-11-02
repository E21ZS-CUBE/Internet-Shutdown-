// frontend/src/components/Charts.jsx
import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Charts.css';

function Charts({ shutdowns, shutdownType }) {
  // Aggregate data by reason
  const reasonData = shutdowns.reduce((acc, shutdown) => {
    const reason = shutdown.reasonCategory;
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {});

  const reasonChartData = Object.entries(reasonData).map(([name, value]) => ({
    name,
    value
  }));

  // Aggregate data by state
  const stateData = shutdowns.reduce((acc, shutdown) => {
    const state = shutdown.state;
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  const stateChartData = Object.entries(stateData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Timeline data
  const timelineData = shutdowns.reduce((acc, shutdown) => {
    const date = new Date(shutdown.startDate);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const timelineChartData = Object.entries(timelineData)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="charts-container">
      <h2>📊 Analytics & Visualizations</h2>
      
      <div className="charts-grid">
        {/* Shutdowns by Reason */}
        <div className="chart-card">
          <h3>Shutdowns by Reason</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reasonChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reasonChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 States */}
        <div className="chart-card">
          <h3>Top 10 Affected States</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stateChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline */}
        <div className="chart-card full-width">
          <h3>Shutdowns Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Charts;
