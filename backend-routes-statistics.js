// backend/routes/statistics.js
const express = require('express');
const router = express.Router();
const Shutdown = require('../models/Shutdown');

// GET overall statistics
router.get('/', async (req, res) => {
  try {
    const { type = 'ALL' } = req.query;

    let query = {};
    if (type !== 'ALL') {
      query.shutdownType = type;
    }

    const [totalShutdowns, avgDurationResult, byReason, byState, activeShutdowns] = await Promise.all([
      Shutdown.countDocuments(query),
      Shutdown.aggregate([
        { $match: query },
        { $group: { _id: null, avgDuration: { $avg: '$durationHours' } } }
      ]),
      Shutdown.aggregate([
        { $match: query },
        { $group: { _id: '$reasonCategory', count: { $sum: 1 } } }
      ]),
      Shutdown.aggregate([
        { $match: query },
        { $group: { _id: '$state', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Shutdown.countDocuments({ ...query, endDate: null })
    ]);

    const avgDuration = avgDurationResult[0]?.avgDuration?.toFixed(2) || 0;
    
    const byReasonObj = {};
    byReason.forEach(r => {
      byReasonObj[r._id] = r.count;
    });

    const byStateObj = {};
    byState.forEach(s => {
      byStateObj[s._id] = s.count;
    });

    const mostAffectedState = byState.length > 0 ? byState[0]._id : 'N/A';

    res.json({
      success: true,
      data: {
        totalShutdowns,
        avgDuration,
        activeShutdowns,
        mostAffectedState,
        byReason: byReasonObj,
        byState: byStateObj
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET reason breakdown
router.get('/reasons', async (req, res) => {
  try {
    const { type = 'ALL' } = req.query;

    let query = {};
    if (type !== 'ALL') {
      query.shutdownType = type;
    }

    const [reasons, total] = await Promise.all([
      Shutdown.aggregate([
        { $match: query },
        { $group: { _id: '$reasonCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Shutdown.countDocuments(query)
    ]);

    const reasonsArray = reasons.map(r => ({
      category: r._id,
      count: r.count,
      percentage: ((r.count / total) * 100).toFixed(2)
    }));

    res.json({
      success: true,
      data: reasonsArray
    });
  } catch (error) {
    console.error('Error fetching reasons:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET timeline data
router.get('/timeline', async (req, res) => {
  try {
    const { type = 'ALL' } = req.query;

    let query = {};
    if (type !== 'ALL') {
      query.shutdownType = type;
    }

    const timeline = await Shutdown.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$startDate' },
            month: { $month: '$startDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const timelineArray = timeline.map(t => ({
      month: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
      count: t.count
    }));

    res.json({
      success: true,
      data: timelineArray
    });
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET operator statistics
router.get('/operators', async (req, res) => {
  try {
    const { type = 'ALL' } = req.query;

    let query = {};
    if (type !== 'ALL') {
      query.shutdownType = type;
    }

    const operators = await Shutdown.aggregate([
      { $match: query },
      { $unwind: '$operators' },
      {
        $group: {
          _id: '$operators.operatorName',
          totalTowersBlocked: { $sum: '$operators.towersBlocked' },
          totalCoverageArea: { $sum: '$operators.coverageAreaSqKm' },
          affectedPopulation: { $sum: '$operators.affectedPopulation' },
          shutdownCount: { $sum: 1 }
        }
      },
      { $sort: { totalTowersBlocked: -1 } }
    ]);

    res.json({
      success: true,
      data: operators
    });
  } catch (error) {
    console.error('Error fetching operator statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;