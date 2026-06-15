const express = require('express');
const jwt = require('jsonwebtoken');
const Activity = require('../models/Activity');
const { extractEmissionData } = require('../utils/ollama');

const router = express.Router();

// Middleware to get userId from token
const getUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
};

// Create activity
router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { description, category, quantity, unit, emission } = req.body;

    const activity = new Activity({
      userId,
      description,
      category,
      quantity,
      unit,
      emission,
      source: 'manual',
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Analyze activity with Ollama
router.post('/analyze', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const analysis = await extractEmissionData(description);

    const activity = new Activity({
      userId,
      description,
      category: analysis.category || 'Other',
      quantity: analysis.quantity || 0,
      unit: analysis.unit || 'units',
      emission: analysis.estimated_emission_kg_co2e || 0,
      source: 'ai_analyzed',
      aiAnalysis: analysis,
    });

    await activity.save();

    res.status(201).json({
      activity,
      analysis,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all activities for user
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const activities = await Activity.find({ userId }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get activity by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const activity = await Activity.findById(req.params.id);

    if (!activity || activity.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete activity
router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const activity = await Activity.findById(req.params.id);

    if (!activity || activity.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
