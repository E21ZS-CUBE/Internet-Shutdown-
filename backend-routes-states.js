// backend/routes/states.js
const express = require('express');
const router = express.Router();
const State = require('../models/State');
const Shutdown = require('../models/Shutdown');

// GET all states
router.get('/', async (req, res) => {
  try {
    const states = await State.find({}, 'name code').sort({ name: 1 }).lean();

    res.json({
      success: true,
      data: states,
      count: states.length
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET state details with shutdown count
router.get('/details/:stateName', async (req, res) => {
  try {
    const stateName = req.params.stateName;
    
    const [state, shutdowns] = await Promise.all([
      State.findOne({ name: stateName }).lean(),
      Shutdown.find({ state: stateName }).lean()
    ]);

    if (!state) {
      return res.status(404).json({ success: false, error: 'State not found' });
    }

    const fullShutdowns = shutdowns.filter(s => s.shutdownType === 'FULL').length;
    const throttledShutdowns = shutdowns.filter(s => s.shutdownType === 'THROTTLED').length;

    res.json({
      success: true,
      data: {
        ...state,
        totalShutdowns: shutdowns.length,
        fullShutdowns,
        throttledShutdowns,
        shutdowns
      }
    });
  } catch (error) {
    console.error('Error fetching state details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET state counts for map coloring
router.get('/counts/all', async (req, res) => {
  try {
    const { type = 'ALL' } = req.query;

    let query = {};
    if (type !== 'ALL') {
      query.shutdownType = type;
    }

    const counts = await Shutdown.aggregate([
      { $match: query },
      { $group: { _id: '$state', count: { $sum: 1 } } }
    ]);

    const countsObj = {};
    counts.forEach(c => {
      countsObj[c._id] = c.count;
    });

    res.json({
      success: true,
      data: countsObj
    });
  } catch (error) {
    console.error('Error fetching state counts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;