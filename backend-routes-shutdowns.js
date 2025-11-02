// backend/routes/shutdowns.js
const express = require('express');
const router = express.Router();
const Shutdown = require('../models/Shutdown');

// GET all shutdowns with filters and search
router.get('/', async (req, res) => {
  try {
    const { 
      state, 
      district, 
      type, 
      page = 1, 
      limit = 25, 
      reason,
      search,
      verified,
      startDate,
      endDate,
      sortBy = 'startDate',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    // Apply filters
    if (type && type !== 'ALL') {
      query.shutdownType = type;
    }

    if (state && state !== 'ALL') {
      query.state = state;
    }

    if (district) {
      query.district = new RegExp(district, 'i');
    }

    if (reason && reason !== 'ALL') {
      query.reasonCategory = reason;
    }

    if (verified !== undefined) {
      query.isVerified = verified === 'true';
    }

    if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    }

    if (endDate) {
      query.startDate = query.startDate || {};
      query.startDate.$lte = new Date(endDate);
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      Shutdown.find(query)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Shutdown.countDocuments(query)
    ]);

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('Error fetching shutdowns:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single shutdown by ID
router.get('/:id', async (req, res) => {
  try {
    const shutdown = await Shutdown.findById(req.params.id);

    if (!shutdown) {
      return res.status(404).json({ success: false, error: 'Shutdown not found' });
    }

    res.json({ success: true, data: shutdown });
  } catch (error) {
    console.error('Error fetching shutdown:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET shutdowns by state
router.get('/state/:stateName', async (req, res) => {
  try {
    const shutdowns = await Shutdown.find({ state: req.params.stateName })
      .sort({ startDate: -1 })
      .lean();

    res.json({
      success: true,
      data: shutdowns,
      count: shutdowns.length
    });
  } catch (error) {
    console.error('Error fetching shutdowns by state:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET shutdowns by district
router.get('/district/:stateName/:districtName', async (req, res) => {
  try {
    const shutdowns = await Shutdown.find({ 
      state: req.params.stateName,
      district: new RegExp(req.params.districtName, 'i')
    })
      .sort({ startDate: -1 })
      .lean();

    res.json({
      success: true,
      data: shutdowns,
      count: shutdowns.length
    });
  } catch (error) {
    console.error('Error fetching shutdowns by district:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create shutdown (for admin)
router.post('/', async (req, res) => {
  try {
    const shutdownData = req.body;
    
    // Calculate duration if both dates provided
    if (shutdownData.startDate && shutdownData.endDate) {
      const start = new Date(shutdownData.startDate);
      const end = new Date(shutdownData.endDate);
      shutdownData.durationHours = Math.round((end - start) / (1000 * 60 * 60));
    }

    const newShutdown = new Shutdown(shutdownData);
    await newShutdown.save();

    res.status(201).json({
      success: true,
      message: 'Shutdown created successfully',
      data: newShutdown
    });
  } catch (error) {
    console.error('Error creating shutdown:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update shutdown
router.put('/:id', async (req, res) => {
  try {
    const updateData = req.body;
    
    // Recalculate duration if dates are updated
    if (updateData.startDate && updateData.endDate) {
      const start = new Date(updateData.startDate);
      const end = new Date(updateData.endDate);
      updateData.durationHours = Math.round((end - start) / (1000 * 60 * 60));
    }

    const shutdown = await Shutdown.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!shutdown) {
      return res.status(404).json({ success: false, error: 'Shutdown not found' });
    }

    res.json({
      success: true,
      message: 'Shutdown updated successfully',
      data: shutdown
    });
  } catch (error) {
    console.error('Error updating shutdown:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE shutdown
router.delete('/:id', async (req, res) => {
  try {
    const shutdown = await Shutdown.findByIdAndDelete(req.params.id);

    if (!shutdown) {
      return res.status(404).json({ success: false, error: 'Shutdown not found' });
    }

    res.json({
      success: true,
      message: 'Shutdown deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shutdown:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;