const express = require('express');
const jwt = require('jsonwebtoken');
const Activity = require('../models/Activity');
const { generateEmissionTips, generateReportSummary } = require('../utils/ollama');

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

// Get dashboard metrics
router.get('/metrics', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const allActivities = await Activity.find({ userId });

    // Calculate metrics
    const totalEmission = allActivities.reduce((sum, act) => sum + act.emission, 0);

    // Get last week's data
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekActivities = allActivities.filter((act) => new Date(act.createdAt) > oneWeekAgo);
    const lastWeekActivities = allActivities.filter(
      (act) => new Date(act.createdAt) <= oneWeekAgo && new Date(act.createdAt) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    );

    const thisWeekEmission = thisWeekActivities.reduce((sum, act) => sum + act.emission, 0);
    const lastWeekEmission = lastWeekActivities.reduce((sum, act) => sum + act.emission, 0);
    const emissionChange = lastWeekEmission > 0 ? ((thisWeekEmission - lastWeekEmission) / lastWeekEmission) * 100 : 0;

    // Carbon Score (0-100)
    const carbonScore = Math.max(0, 100 - totalEmission / 2);

    // Category breakdown
    const categoryBreakdown = {};
    allActivities.forEach((act) => {
      categoryBreakdown[act.category] = (categoryBreakdown[act.category] || 0) + act.emission;
    });

    const topCategory = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0];

    res.json({
      totalEmission: totalEmission.toFixed(2),
      emissionChange: emissionChange.toFixed(1),
      carbonScore: Math.round(carbonScore),
      totalActivities: allActivities.length,
      newThisWeek: thisWeekActivities.length,
      carbonSaved: '18.7', // Hardcoded for demo
      categoryBreakdown,
      topCategory: topCategory ? topCategory[0] : 'Other',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get weekly trend
router.get('/trend', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const activities = await Activity.find({ userId });

    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayActivities = activities.filter((act) => {
        const actDate = new Date(act.createdAt);
        return (
          actDate.getDate() === date.getDate() &&
          actDate.getMonth() === date.getMonth() &&
          actDate.getFullYear() === date.getFullYear()
        );
      });

      const emission = dayActivities.reduce((sum, act) => sum + act.emission, 0);
      trendData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        emission: emission.toFixed(2),
      });
    }

    res.json(trendData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get emission tips
router.get('/tips', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const activities = await Activity.find({ userId });

    if (activities.length === 0) {
      return res.json({
        tips: '1. Start tracking your daily activities\n2. Look for sustainable alternatives in your routine\n3. Set emission reduction goals',
      });
    }

    const tips = await generateEmissionTips(activities);
    res.json({ tips });
  } catch (error) {
    res.status(500).json({
      tips: '1. Track your activities regularly\n2. Consider sustainable alternatives\n3. Share your progress with friends',
    });
  }
});

module.exports = router;
