// // const express = require('express');
// // const jwt = require('jsonwebtoken');
// // const Activity = require('../models/Activity');
// // const { generateReportSummary } = require('../utils/ollama');

// // const router = express.Router();

// // // Middleware to get userId from token
// // const getUserId = (req) => {
// //   const token = req.headers.authorization?.split(' ')[1];
// //   if (!token) return null;
// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     return decoded.id;
// //   } catch {
// //     return null;
// //   }
// // };


// // // Get weekly summary
// // router.get('/weekly', async (req, res) => {
// //   try {
// //     const userId = getUserId(req);
// //     if (!userId) {
// //       return res.status(401).json({ message: 'Unauthorized' });
// //     }

// //     const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
// //     const activities = await Activity.find({
// //       userId,
// //       createdAt: { $gte: oneWeekAgo },
// //     });

// //     const summary = {
// //       week: `${oneWeekAgo.toLocaleDateString()} - ${new Date().toLocaleDateString()}`,
// //       total: activities.reduce((sum, act) => sum + act.emission, 0).toFixed(2),
// //       count: activities.length,
// //       categories: {},
// //     };

// //     activities.forEach((act) => {
// //       summary.categories[act.category] = (summary.categories[act.category] || 0) + act.emission;
// //     });

// //     Object.keys(summary.categories).forEach((key) => {
// //       summary.categories[key] = summary.categories[key].toFixed(2);
// //     });

// //     res.json(summary);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // // Get monthly summary
// // router.get('/monthly', async (req, res) => {
// //   try {
// //     const userId = getUserId(req);
// //     if (!userId) {
// //       return res.status(401).json({ message: 'Unauthorized' });
// //     }

// //     const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
// //     const activities = await Activity.find({
// //       userId,
// //       createdAt: { $gte: oneMonthAgo },
// //     });

// //     const summary = {
// //       month: `Last 30 days`,
// //       total: activities.reduce((sum, act) => sum + act.emission, 0).toFixed(2),
// //       count: activities.length,
// //       categories: {},
// //     };

// //     activities.forEach((act) => {
// //       summary.categories[act.category] = (summary.categories[act.category] || 0) + act.emission;
// //     });

// //     Object.keys(summary.categories).forEach((key) => {
// //       summary.categories[key] = summary.categories[key].toFixed(2);
// //     });

// //     res.json(summary);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // // Get report summary from Ollama
// // router.get('/summary', async (req, res) => {
// //   try {
// //     const userId = getUserId(req);
// //     if (!userId) {
// //       return res.status(401).json({ message: 'Unauthorized' });
// //     }

// //     const activities = await Activity.find({ userId });
// //     const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
// //     const thisWeekActivities = activities.filter((act) => new Date(act.createdAt) > oneWeekAgo);

// //     const thisWeekTotal = thisWeekActivities.reduce((sum, act) => sum + act.emission, 0);
// //     const allTotal = activities.reduce((sum, act) => sum + act.emission, 0);

// //     const summary = await generateReportSummary(
// //       {
// //         total: thisWeekTotal.toFixed(2),
// //         trend: 0,
// //       },
// //       {
// //         total: allTotal.toFixed(2),
// //         topCategory: 'Transport',
// //       },
// //       'user@example.com'
// //     );

// //     res.json({ summary });
// //   } catch (error) {
// //     res.status(500).json({
// //       summary: 'Keep tracking your carbon footprint and making sustainable choices!',
// //     });
// //   }
// // });

// // module.exports = router;


// const generateReportSummary = async (reportData) => {
//   // Build a personalized prompt based on real user data
//   let prompt = `You are a carbon footprint expert. Generate a personalized, encouraging report summary for ${reportData.userName}.

// REAL USER DATA:
// - Email: ${reportData.userEmail}
// - Total emissions this month: ${reportData.total} kg CO₂e
// - Total activities tracked: ${reportData.activityCount}
// - Top emission category: ${reportData.topCategory} (${reportData.topEmission} kg)
// - Weekly trend: ${reportData.trend > 0 ? '+' : ''}${reportData.trend}% compared to last week

// Full category breakdown:
// ${Object.entries(reportData.categories).map(([cat, val]) => `  - ${cat}: ${val} kg CO₂e`).join('\n')}

// Write 2-3 sentences that:
// 1. Acknowledge their actual emission level (${reportData.total} kg)
// 2. Give ONE specific, actionable tip for reducing ${reportData.topCategory} emissions
// 3. Encourage them to keep tracking

// IMPORTANT RULES:
// - Be specific to THEIR data
// - Do NOT mention electric vehicles unless they have driving activities
// - Do NOT use generic advice
// - Keep it friendly and encouraging
// - Use their name: ${reportData.userName}

// Return ONLY the text, no markdown or JSON.`;

//   try {
//     const response = await ollamaCall(prompt);
//     return response.trim();
//   } catch (error) {
//     console.error('Report summary error:', error.message);
//     // Return a meaningful fallback with actual user data
//     return `Hey ${reportData.userName}! Great job tracking your carbon footprint. This month you've emitted ${reportData.total} kg CO₂e, with ${reportData.topCategory} being your largest category at ${reportData.topEmission} kg. ${reportData.topCategory === 'Transport' ? 'Try combining trips or using public transport when possible.' : 'Small changes in your daily routine can make a big difference!'} Keep up the good work! 🌍`;
//   }
// };

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