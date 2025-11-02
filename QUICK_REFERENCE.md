# InternetShutdowns.in - Quick Copy-Paste Reference

## Step 1: Create Backend (Terminal 1)

```bash
# Create backend directory
mkdir -p internetshutdowns/backend
cd internetshutdowns/backend

# Initialize and install
npm init -y
npm install express cors dotenv

# Create server.js
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const shutdownRoutes = require('./routes/shutdowns');
const stateRoutes = require('./routes/states');
const statisticsRoutes = require('./routes/statistics');

app.use('/api/shutdowns', shutdownRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/statistics', statisticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});

module.exports = app;
EOF

# Create mock data file
cat > mockData.js << 'EOF'
const mockShutdowns = [
  {
    id: '1',
    state: 'Manipur',
    stateCode: 'MN',
    district: 'Imphal West',
    startDate: '2024-08-01T10:30:00Z',
    endDate: '2024-08-03T14:15:00Z',
    durationHours: 52,
    shutdownType: 'FULL',
    reason: 'Post-election violence',
    reasonCategory: 'VIOLENCE',
    sourceUrl: 'https://example.com',
    sourceDocument: 'Order',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 120, coverageArea: 45.5 },
      { name: 'Jio', towersBlocked: 95, coverageArea: 38.2 }
    ],
    throttlingDetails: null
  },
  {
    id: '2',
    state: 'Maharashtra',
    stateCode: 'MH',
    district: 'Pune',
    startDate: '2024-09-15T08:00:00Z',
    endDate: '2024-09-15T20:00:00Z',
    durationHours: 12,
    shutdownType: 'FULL',
    reason: 'Harthal',
    reasonCategory: 'PROTEST',
    sourceUrl: 'https://example.com',
    sourceDocument: 'Report',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 45, coverageArea: 12.3 }
    ],
    throttlingDetails: null
  },
  {
    id: '3',
    state: 'Kashmir',
    stateCode: 'JK',
    district: 'Srinagar',
    startDate: '2024-07-20T00:00:00Z',
    endDate: null,
    durationHours: 1344,
    shutdownType: 'THROTTLED',
    reason: 'Security',
    reasonCategory: 'SECURITY',
    sourceUrl: 'https://example.com',
    sourceDocument: 'Order',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 200, coverageArea: 78.5 }
    ],
    throttlingDetails: { from: '4G', to: '3G' }
  },
  {
    id: '4',
    state: 'Delhi',
    stateCode: 'DL',
    district: 'South Delhi',
    startDate: '2024-09-22T14:00:00Z',
    endDate: '2024-09-22T18:00:00Z',
    durationHours: 4,
    shutdownType: 'FULL',
    reason: 'Exam',
    reasonCategory: 'EXAM',
    sourceUrl: 'https://example.com',
    sourceDocument: 'Protocol',
    isVerified: true,
    operators: [
      { name: 'Jio', towersBlocked: 30, coverageArea: 8.2 }
    ],
    throttlingDetails: null
  }
];

const mockStates = [
  { code: 'MH', name: 'Maharashtra' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'DL', name: 'Delhi' },
  { code: 'JK', name: 'Jammu & Kashmir' },
  { code: 'MN', name: 'Manipur' }
];

module.exports = { mockShutdowns, mockStates };
EOF

# Create routes directory and files
mkdir -p routes

# Create shutdowns.js
cat > routes/shutdowns.js << 'EOF'
const express = require('express');
const router = express.Router();
const { mockShutdowns } = require('../mockData');

router.get('/', (req, res) => {
  try {
    const { state, type, page = 1, limit = 25 } = req.query;
    let filtered = [...mockShutdowns];
    
    if (type && type !== 'ALL') {
      filtered = filtered.filter(s => s.shutdownType === type);
    }
    if (state && state !== 'ALL') {
      filtered = filtered.filter(s => s.state === state);
    }

    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const start = (pageNum - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    res.json({
      success: true,
      data: paginated,
      pagination: {
        total: filtered.length,
        page: pageNum,
        limit: pageSize,
        pages: Math.ceil(filtered.length / pageSize)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', (req, res) => {
  const shutdown = mockShutdowns.find(s => s.id === req.params.id);
  if (!shutdown) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, data: shutdown });
});

module.exports = router;
EOF

# Create states.js
cat > routes/states.js << 'EOF'
const express = require('express');
const router = express.Router();
const { mockShutdowns, mockStates } = require('../mockData');

router.get('/', (req, res) => {
  res.json({ success: true, data: mockStates, count: mockStates.length });
});

router.get('/counts/all', (req, res) => {
  try {
    const { type = 'ALL' } = req.query;
    const counts = {};
    
    mockStates.forEach(state => {
      let shutdowns = mockShutdowns.filter(s => s.state === state.name);
      if (type !== 'ALL') {
        shutdowns = shutdowns.filter(s => s.shutdownType === type);
      }
      counts[state.code] = shutdowns.length;
    });

    res.json({ success: true, data: counts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
EOF

# Create statistics.js
cat > routes/statistics.js << 'EOF'
const express = require('express');
const router = express.Router();
const { mockShutdowns, mockStates } = require('../mockData');

router.get('/', (req, res) => {
  try {
    const { type = 'ALL' } = req.query;
    let shutdowns = [...mockShutdowns];
    if (type !== 'ALL') {
      shutdowns = shutdowns.filter(s => s.shutdownType === type);
    }

    const total = shutdowns.length;
    const avg = total > 0 
      ? (shutdowns.reduce((sum, s) => sum + s.durationHours, 0) / total).toFixed(2)
      : 0;

    const byReason = {};
    shutdowns.forEach(s => {
      byReason[s.reasonCategory] = (byReason[s.reasonCategory] || 0) + 1;
    });

    const byState = {};
    mockStates.forEach(state => {
      const count = shutdowns.filter(s => s.state === state.name).length;
      if (count > 0) byState[state.name] = count;
    });

    const mostAffected = Object.keys(byState).length > 0
      ? Object.entries(byState).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : 'N/A';

    res.json({
      success: true,
      data: {
        totalShutdowns: total,
        avgDuration: avg,
        activeShutdowns: shutdowns.filter(s => !s.endDate).length,
        mostAffectedState: mostAffected,
        byReason,
        byState
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
EOF

echo "✓ Backend setup complete!"
npm start
```

## Step 2: Create Frontend (Terminal 2)

```bash
# Create frontend directory
mkdir -p internetshutdowns/frontend
cd internetshutdowns/frontend

# Initialize React with Vite
npm create vite@latest . -- --template react

# Install dependencies
npm install
npm install axios date-fns chart.js react-chartjs-2 recharts

# Create vite.config.js
cat > vite.config.js << 'EOF'
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
EOF

# Create API utility
mkdir -p src/utils
cat > src/utils/api.js << 'EOF'
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const shutdownsAPI = {
  getAll: (params) => api.get('/shutdowns', { params }),
  getById: (id) => api.get(`/shutdowns/${id}`)
};

export const statesAPI = {
  getAll: () => api.get('/states'),
  getCounts: (type = 'FULL') => api.get('/states/counts/all', { params: { type } })
};

export const statisticsAPI = {
  getOverall: (type = 'FULL') => api.get('/statistics', { params: { type } })
};

export default api;
EOF

echo "✓ Frontend setup complete!"
npm run dev
```

## Step 3: Create Components (Frontend)

```bash
# Create directories
mkdir -p src/components src/pages src/styles

# Copy individual component files from the text files provided
# Use the Frontend Component Files section above
```

## How to Connect

**In Terminal 1 (Backend):**
```bash
cd internetshutdowns/backend
npm start
# Output: ✓ Server running on http://localhost:5000
```

**In Terminal 2 (Frontend):**
```bash
cd internetshutdowns/frontend
npm run dev
# Output: ➜  Local:   http://localhost:5173
```

**In Browser:**
- Open http://localhost:5173
- Frontend automatically proxies requests to http://localhost:5000/api
- Components fetch data using the api.js utility

## Testing the Connection

**Test Backend API directly:**
```bash
# In Terminal 3
curl http://localhost:5000/api/health
curl http://localhost:5000/api/shutdowns?type=FULL&limit=5
curl http://localhost:5000/api/states/counts/all
```

**Check Browser Console:**
- No errors should appear in console
- Network tab should show successful API calls to `/api/...`

## File Organization Tips

```
internetshutdowns/
├── backend/
│   ├── server.js
│   ├── mockData.js
│   ├── routes/
│   │   ├── shutdowns.js
│   │   ├── states.js
│   │   └── statistics.js
│   ├── package.json
│   └── node_modules/
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── styles/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    ├── vite.config.js
    └── node_modules/
```

---

**That's it! Your InternetShutdowns.in tracker is now connected and running!**