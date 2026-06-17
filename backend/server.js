require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const dashboardRoutes = require('./routes/dashboard');
const reportRoutes = require('./routes/reports');

const app = express();

const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    'https://carbon-footprint-tracker-tau-five.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ].filter(Boolean)
);

// ========== CORS MIDDLEWARE (SIRF EK BAAR, SAHI JAGAH) ==========
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isAllowedVercelOrigin = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
    const isAllowedLocalOrigin = /^http:\/\/localhost:\d+$/i.test(origin);

    if (allowedOrigins.has(origin) || isAllowedVercelOrigin || isAllowedLocalOrigin) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CarbonLens Backend is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 MongoDB connected to: ${process.env.MONGODB_URI}`);
  console.log(`🤖 Ollama endpoint: ${process.env.OLLAMA_BASE_URL}`);
  console.log(`🧠 Ollama model: ${process.env.OLLAMA_MODEL}`);
});