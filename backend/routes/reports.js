const express = require('express');
const jwt = require('jsonwebtoken');
const Activity = require('../models/Activity');
const { generateReportSummary } = require('../utils/ollama');

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

// Get weekly summary
router.get('/weekly', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const activities = await Activity.find({
      userId,
      createdAt: { $gte: oneWeekAgo },
    });

    const total = activities.reduce((sum, act) => sum + (act.emission || 0), 0);
    const categories = {};

    activities.forEach((act) => {
      const cat = act.category || 'Other';
      categories[cat] = (categories[cat] || 0) + (act.emission || 0);
    });

    Object.keys(categories).forEach((key) => {
      categories[key] = Math.round(categories[key] * 100) / 100;
    });

    res.json({
      week: `${oneWeekAgo.toLocaleDateString()} - ${new Date().toLocaleDateString()}`,
      total: Math.round(total * 100) / 100,
      count: activities.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get monthly summary
router.get('/monthly', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    oneMonthAgo.setHours(0, 0, 0, 0);

    const activities = await Activity.find({
      userId,
      createdAt: { $gte: oneMonthAgo },
    });

    const total = activities.reduce((sum, act) => sum + (act.emission || 0), 0);
    const categories = {};

    activities.forEach((act) => {
      const cat = act.category || 'Other';
      categories[cat] = (categories[cat] || 0) + (act.emission || 0);
    });

    Object.keys(categories).forEach((key) => {
      categories[key] = Math.round(categories[key] * 100) / 100;
    });

    res.json({
      month: `Last 30 days`,
      total: Math.round(total * 100) / 100,
      count: activities.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get AI report summary
router.get('/summary', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const activities = await Activity.find({ userId }).sort({ createdAt: -1 });
    
    const total = activities.reduce((sum, act) => sum + (act.emission || 0), 0);
    const categories = {};

    activities.forEach((act) => {
      const cat = act.category || 'Other';
      categories[cat] = (categories[cat] || 0) + (act.emission || 0);
    });

    // Find top category
    let topCategory = 'None';
    let topEmission = 0;
    Object.entries(categories).forEach(([cat, val]) => {
      if (val > topEmission) {
        topEmission = val;
        topCategory = cat;
      }
    });

    // Simple personalized summary (doesn't rely on Ollama to avoid errors)
    const summary = `Hi there! Based on your tracked activities, you've emitted ${Math.round(total)} kg CO₂e this month. Your highest emission category is ${topCategory} (${Math.round(topEmission)} kg). ${topCategory === 'Transport' ? 'Try combining trips or using public transport when possible.' : 'Small changes in your daily routine can make a big difference!'} Keep tracking to see your progress! 🌍`;

    res.json({ summary });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ 
      summary: 'Keep tracking your carbon footprint and making sustainable choices! 🌍' 
    });
  }
});

// IMPORTANT: This line MUST be here
module.exports = router;