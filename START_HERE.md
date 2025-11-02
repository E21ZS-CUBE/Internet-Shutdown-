# 🚀 InternetShutdowns.in - Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

## 📦 Installation Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/internetshutdowns

# Seed the database with initial data
npm run seed

# Start the backend server
npm run dev
```

The backend will run on **http://localhost:5000**

### 2. Frontend Setup

```bash
# Navigate to frontend directory (open new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Start the development server
npm run dev
```

The frontend will run on **http://localhost:5173** (or the port shown in terminal)

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB on your system
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. The default connection string is: `mongodb://localhost:27017/internetshutdowns`

### Option 2: MongoDB Atlas (Cloud)

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `backend/.env`

## 🔑 API Keys & Configuration

### Twitter API (Optional)

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app (Free tier is sufficient)
3. Get your API credentials
4. Add to `backend/.env`:
   ```
   TWITTER_API_KEY=your_key
   TWITTER_API_SECRET=your_secret
   TWITTER_BEARER_TOKEN=your_token
   ```

### GeoJSON Data

The app uses simplified coordinates. For production:
1. Download India GeoJSON from [DataMeet](https://github.com/datameet/maps)
2. Update `backend/data/indianStates.json` with actual boundaries

## 🧪 Testing the Application

1. **Verify Backend**: Visit http://localhost:5000/api/health
   - Should return: `{"status":"Server is running"}`

2. **Test API Endpoints**:
   ```bash
   # Get all shutdowns
   curl http://localhost:5000/api/shutdowns

   # Get statistics
   curl http://localhost:5000/api/statistics

   # Get states
   curl http://localhost:5000/api/states
   ```

3. **Open Frontend**: http://localhost:5173
   - Toggle between Full and Throttled shutdowns
   - Click on map markers to view details
   - Use filters in the data table
   - View charts and statistics

## 📊 Available Features

### ✅ Completed Features
- MongoDB database with full schema
- RESTful API with all endpoints
- Interactive OpenStreetMap with Leaflet
- Toggle between shutdown types
- Dynamic data table with filters, search, and pagination
- Interactive charts (Pie, Bar, Line)
- Twitter feed integration
- Web scraper for government sources
- GitHub Actions deployment pipeline
- Fully responsive design

### 🔧 API Endpoints

**Shutdowns**
- `GET /api/shutdowns` - List with filters
- `GET /api/shutdowns/:id` - Single shutdown
- `POST /api/shutdowns` - Create new
- `PUT /api/shutdowns/:id` - Update
- `DELETE /api/shutdowns/:id` - Delete

**Geographic**
- `GET /api/geo/states` - All states
- `GET /api/geo/state/:name` - Single state
- `GET /api/geo/districts/:state` - Districts

**Statistics**
- `GET /api/statistics` - Overall stats
- `GET /api/statistics/reasons` - By reason
- `GET /api/statistics/timeline` - Time series
- `GET /api/statistics/operators` - By operator

**Search**
- `GET /api/search?q=term` - Full-text search

**Scraper**
- `GET /api/sources` - All sources
- `POST /api/sources/scrape` - Trigger scraper
- `GET /api/sources/pending` - Unverified sources
- `PUT /api/sources/verify/:id` - Verify source

## 🚀 Deployment

### Deploy to GitHub Pages

1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/internet-shutdowns.git
   git push -u origin main
   ```

3. GitHub Actions will automatically deploy to GitHub Pages

### Environment Variables for Production

Add these secrets in GitHub repository settings:
- `API_URL` - Your backend API URL
- `MONGODB_URI` - Your production MongoDB connection string

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB is running: `mongod --version`
- Check if port 5000 is available
- Verify `.env` file exists with correct values

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` in frontend `.env`
- Ensure backend is running on port 5000
- Check browser console for CORS errors

### Database connection failed
- Verify MongoDB is running
- Check connection string in `backend/.env`
- Ensure MongoDB port 27017 is not blocked

### Map not loading
- Check browser console for errors
- Ensure Leaflet CSS is imported
- Verify internet connection (for OSM tiles)

## 📚 Next Steps

1. **Add Real GeoJSON Data**:
   - Replace placeholder coordinates with actual India boundary data
   - Add district-level GeoJSON

2. **Connect Twitter API**:
   - Get API credentials
   - Update `.env` file
   - Test real-time tweet fetching

3. **Customize Scrapers**:
   - Update selectors in `backend/services/scraperService.js`
   - Test against actual government websites

4. **Deploy to Production**:
   - Choose hosting platform (Heroku, AWS, Azure, DigitalOcean)
   - Set up production database
   - Configure environment variables

## 🆘 Need Help?

Check the following files for more details:
- `CODE_INDEX.md` - Complete codebase reference
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- Backend API documentation in code comments

## 📝 License

This project is for tracking internet shutdowns in India for public awareness.

---

**Built with ❤️ for transparency and digital rights**
