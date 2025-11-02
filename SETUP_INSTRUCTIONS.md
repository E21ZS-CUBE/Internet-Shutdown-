# InternetShutdowns.in - Complete Implementation & Setup Guide

## Quick Start Guide

### ⚡ 5-Minute Quick Setup

```bash
# 1. Backend Setup
mkdir -p internetshutdowns/backend
cd internetshutdowns/backend
npm init -y
npm install express cors dotenv

# 2. Frontend Setup (new terminal)
mkdir -p internetshutdowns/frontend  
cd internetshutdowns/frontend
npm create vite@latest . -- --template react
npm install axios date-fns chart.js react-chartjs-2 recharts

# 3. Run Backend
npm start
# Server: http://localhost:5000

# 4. Run Frontend (new terminal)
npm run dev
# App: http://localhost:5173
```

---

## Backend Implementation

### Backend File Structure
```
backend/
├── server.js (main server file)
├── mockData.js (sample data)
├── package.json
├── .env
└── routes/
    ├── shutdowns.js
    ├── states.js
    └── statistics.js
```

### Backend Package.json
```json
{
  "name": "internetshutdowns-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Running Backend
```bash
cd backend
npm install
npm start
```

**API Endpoints Available:**
- `GET /api/health` - Health check
- `GET /api/shutdowns` - All shutdowns with filters
- `GET /api/shutdowns/:id` - Single shutdown
- `GET /api/states` - All states
- `GET /api/states/details/:stateName` - State details
- `GET /api/states/counts/all` - Shutdown counts by state
- `GET /api/statistics` - Overall statistics
- `GET /api/statistics/reasons` - Reason breakdown
- `GET /api/statistics/timeline` - Monthly timeline

---

## Frontend Implementation

### Frontend File Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Map.jsx
│   │   ├── DataTable.jsx
│   │   ├── Charts.jsx
│   │   ├── Toggle.jsx
│   │   ├── Stats.jsx
│   │   └── TwitterFeed.jsx
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── styles/
│   │   ├── App.css
│   │   ├── Dashboard.css
│   │   ├── Toggle.css
│   │   ├── Stats.css
│   │   ├── Map.css
│   │   ├── DataTable.css
│   │   ├── Charts.css
│   │   └── TwitterFeed.css
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

### Frontend Package.json
```json
{
  "name": "internetshutdowns-frontend",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2",
    "date-fns": "^2.30.0",
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0",
    "recharts": "^2.10.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

### Frontend Vite Config (vite.config.js)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
```

---

## How to Connect Frontend to Backend

### Step 1: Ensure Backend is Running
```bash
cd backend
npm start
# Output: ✓ Server running on http://localhost:5000
```

### Step 2: Start Frontend with Vite Proxy
```bash
cd frontend
npm run dev
# Output: ➜  Local: http://localhost:5173
```

### Step 3: API Connection in Frontend

The `api.js` utility file handles all API connections:

```javascript
// frontend/src/utils/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const shutdownsAPI = {
  getAll: (params) => api.get('/shutdowns', { params }),
  getById: (id) => api.get(`/shutdowns/${id}`),
  getByState: (stateName) => api.get(`/shutdowns/state/${stateName}`)
};

export const statesAPI = {
  getAll: () => api.get('/states'),
  getCounts: (type = 'FULL') => api.get('/states/counts/all', { params: { type } })
};

export const statisticsAPI = {
  getOverall: (type = 'FULL') => api.get('/statistics', { params: { type } }),
  getReasons: (type = 'FULL') => api.get('/statistics/reasons', { params: { type } }),
  getTimeline: (type = 'FULL') => api.get('/statistics/timeline', { params: { type } })
};
```

### Step 4: Using API in Components

Example in Dashboard.jsx:
```javascript
import { shutdownsAPI, statisticsAPI, statesAPI } from '../utils/api';

function Dashboard() {
  const [shutdowns, setShutdowns] = useState([]);

  useEffect(() => {
    // Fetch shutdowns
    shutdownsAPI.getAll({ type: 'FULL', page: 1, limit: 25 })
      .then(response => setShutdowns(response.data.data))
      .catch(error => console.error('API Error:', error));

    // Fetch statistics
    statisticsAPI.getOverall('FULL')
      .then(response => console.log('Stats:', response.data.data))
      .catch(error => console.error('Error:', error));

    // Fetch state counts
    statesAPI.getCounts('FULL')
      .then(response => console.log('Counts:', response.data.data))
      .catch(error => console.error('Error:', error));
  }, []);

  return <div>{/* Component code */}</div>;
}
```

---

## API Response Format

All API responses follow this structure:

```javascript
{
  "success": true,
  "data": { /* actual data */ },
  "pagination": { /* optional pagination info */ }
}
```

### Example: Get Shutdowns
**Request:**
```bash
GET http://localhost:5000/api/shutdowns?type=FULL&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "state": "Manipur",
      "stateCode": "MN",
      "district": "Imphal West",
      "startDate": "2024-08-01T10:30:00Z",
      "endDate": "2024-08-03T14:15:00Z",
      "durationHours": 52,
      "shutdownType": "FULL",
      "reason": "Post-election violence",
      "reasonCategory": "VIOLENCE",
      "operators": [
        { "name": "Airtel", "towersBlocked": 120, "coverageArea": 45.5 }
      ]
    }
  ],
  "pagination": {
    "total": 14,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

### Example: Get Statistics
**Request:**
```bash
GET http://localhost:5000/api/statistics?type=FULL
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalShutdowns": 14,
    "avgDuration": 15.5,
    "activeShutdowns": 1,
    "mostAffectedState": "Manipur",
    "byReason": {
      "VIOLENCE": 5,
      "PROTEST": 4,
      "EXAM": 3,
      "SECURITY": 2
    },
    "byState": {
      "Manipur": 2,
      "Maharashtra": 1,
      "Delhi": 1
    }
  }
}
```

---

## CSS Files Setup

Create these CSS files in frontend/src/styles/:

### styles/App.css
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.app {
  min-height: 100vh;
  padding: 20px;
}

.warning-banner {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 4px;
  color: #856404;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}
```

### styles/Dashboard.css
```css
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 20px;
  border-radius: 8px;
}

.dashboard-header h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.dashboard-header p {
  font-size: 16px;
  opacity: 0.9;
}

.toggle-section {
  text-align: center;
  margin-bottom: 30px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 24px;
  }
}
```

### styles/Toggle.css
```css
.toggle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.toggle-label {
  font-weight: 600;
  color: #333;
}

.toggle-group {
  display: flex;
  gap: 10px;
}

.toggle-btn {
  padding: 10px 20px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.toggle-btn:hover {
  border-color: #667eea;
}

.toggle-btn.active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}
```

### styles/Stats.css
```css
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  border-left: 4px solid #667eea;
}

.stat-card h3 {
  font-size: 32px;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-card p {
  color: #666;
  font-size: 14px;
}
```

### styles/Map.css
```css
.map-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.map-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.map-container {
  margin-bottom: 30px;
}

.state-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.state-box {
  padding: 15px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.state-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.state-box.selected {
  border-color: #667eea;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
}

.state-name {
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

.state-count {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.map-legend {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-item div {
  width: 20px;
  height: 20px;
  border-radius: 2px;
}
```

### styles/DataTable.css
```css
.data-table-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.data-table-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-select,
.filter-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 4px rgba(102, 126, 234, 0.2);
}

.shutdown-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.shutdown-table thead {
  background-color: #f9f9f9;
  border-bottom: 2px solid #ddd;
}

.shutdown-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.shutdown-table th:hover {
  background-color: #f0f0f0;
}

.shutdown-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.data-row:hover {
  background-color: #f9f9f9;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-full {
  background-color: #ff6b6b;
  color: white;
}

.badge-throttled {
  background-color: #ffa500;
  color: white;
}

.expanded-row {
  background-color: #f9f9f9;
}

.expanded-content {
  padding: 20px;
}

.detail-section {
  margin-bottom: 15px;
}

.detail-section h4 {
  color: #667eea;
  margin-bottom: 8px;
}

.operator-detail {
  padding: 8px;
  background: white;
  border-left: 3px solid #667eea;
  margin-bottom: 5px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.pagination select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pagination-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pagination-controls button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls button:hover:not(:disabled) {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}
```

### styles/Charts.css
```css
.charts-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.charts-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.chart-card {
  background: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #eee;
}

.chart-card h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
```

### styles/TwitterFeed.css
```css
.twitter-feed-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 30px;
}

.twitter-feed-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.twitter-feed {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.tweet-card {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s;
}

.tweet-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.tweet-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.tweet-time {
  color: #999;
  font-size: 12px;
}

.tweet-content {
  margin-bottom: 10px;
  line-height: 1.5;
  color: #333;
}

.tweet-actions {
  display: flex;
  gap: 15px;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
}

.tweet-actions span:hover {
  text-decoration: underline;
}
```

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

### Frontend can't connect to backend
```bash
# Ensure backend is running on http://localhost:5000
# Check vite.config.js proxy settings
# Clear browser cache (Ctrl+Shift+Delete)
```

### API returning 404
```bash
# Check if route exists in routes/shutdowns.js
# Verify CORS is enabled in server.js
# Check URL in api.js utility file
```

---

## Next Steps

1. **Run Backend**: `cd backend && npm start`
2. **Run Frontend**: `cd frontend && npm run dev`
3. **Access**: Open http://localhost:5173
4. **Connect Data**: Modify routes/mockData.js with real data
5. **Integrate Real Database**: Replace mockData with PostgreSQL queries
6. **Deploy**: Use Vercel (frontend) + Railway/Heroku (backend)

---

## API Connection Checklist

- ✓ Backend running on http://localhost:5000
- ✓ Frontend running on http://localhost:5173  
- ✓ CORS enabled in backend
- ✓ Vite proxy configured correctly
- ✓ API base URL correct in frontend/src/utils/api.js
- ✓ All routes implemented in backend
- ✓ Mock data loaded in backend
- ✓ Components using API correctly

---

For more help, check the component-specific files and API documentation above.