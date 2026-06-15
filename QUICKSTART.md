# CarbonLens - Quick Start Guide

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Node.js** (v16+) - Download from https://nodejs.org/
- [ ] **MongoDB** - Either:
  - Local installation: https://www.mongodb.com/try/download/community
  - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
- [ ] **Ollama** - Download from https://ollama.ai/
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/Command Prompt



## 🚀 Quick Start (5 Minutes)

### Step 1: Start Ollama
```bash
# Make sure Ollama is running in the background
ollama serve

# In another terminal, pull a model (if not already done)
ollama pull llama2
```

### Step 2: Start MongoDB
```bash
# If using local MongoDB, ensure it's running
# macOS (Homebrew):
brew services start mongodb-community

# Windows (installed as service):
# Already runs as a service, no action needed

# Or use MongoDB Atlas (cloud) - just update MONGODB_URI in .env
```

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create and configure .env file
cp .env.example .env

# Edit .env with your values (if using MongoDB Atlas):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbonlens
# JWT_SECRET=your_secret_key_here_change_this
# PORT=5000
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=llama2

# Seed database with demo data
node seed.js

# Start backend
npm run dev
```

Backend will run on: http://localhost:5000

### Step 4: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: http://localhost:3000

### Step 5: Login

Navigate to http://localhost:3000 and use:

**Email:** sejal6249@gmail.com  
**Password:** password123

---

## 🔥 What You Get

✅ **Dashboard** - Real-time emission metrics and trends  
✅ **AI Assistant** - Analyze activities with natural language  
✅ **Reports** - Weekly/monthly summaries and AI insights  
✅ **Activity History** - Complete log with filtering  
✅ **Achievements** - Unlock badges as you progress  
✅ **Dark/Light/Custom Themes** - Perfect theming support  
✅ **Responsive Design** - Works on desktop and mobile  

---

## ⚡ Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
- Ensure MongoDB is running
- Check connection string in .env
- If using MongoDB Atlas, add your IP to whitelist

### Issue: Ollama Connection Error
**Solution:**
- Make sure `ollama serve` is running
- Check Ollama is on port 11434
- Verify with: `curl http://localhost:11434/api/tags`

### Issue: "Cannot find module" during npm install
**Solution:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`

### Issue: Frontend can't reach backend
**Solution:**
- Ensure backend is running on port 5000
- Check .env is properly configured
- Verify Vite proxy settings in vite.config.js

---

## 📱 Testing the App

### 1. **Dashboard**
- Login and see your emissions metrics
- Check the weekly trend chart
- Review personalized tips

### 2. **AI Assistant**
- Click "AI Assistant" in sidebar
- Type: "Drove 40 km in my SUV"
- See AI analyze and save the activity
- Emissions should update on Dashboard

### 3. **Reports**
- Click "Reports"
- See weekly/monthly summaries
- Download report as TXT file
- Read AI-generated insights

### 4. **Activity History**
- Click "Activity History"
- See all logged activities
- Filter by category
- Delete activities

### 5. **Theme Switching**
- Click the theme icon (☀️ 🌙 🎨) in top bar
- Switch between Light, Dark, Custom
- Custom mode: pick your colors!

### 6. **Mobile Testing**
- Press F12 (Dev Tools)
- Click mobile device icon
- Check responsive layout

---

## 💡 Example Activities to Try

The AI Assistant accepts natural language:

✓ "Drove 40 km in my SUV this morning"  
✓ "Had a steak dinner"  
✓ "Flew from Delhi to Mumbai"  
✓ "Left AC on for 6 hours"  
✓ "Used washing machine once"  
✓ "Took metro to work (15 km)"  
✓ "Electricity bill for 300 units"  

---

## 📊 Database Structure

### Users Collection
```json
{
  "_id": ObjectId,
  "name": "Sejal Jain",
  "email": "sejal6249@gmail.com",
  "password": "hashed_password",
  "carbonGoal": 100,
  "carbonSaved": 18.7,
  "theme": {
    "mode": "light",
    "primaryColor": "#10b981",
    "accentColor": "#f59e0b"
  },
  "createdAt": Date,
  "updatedAt": Date
}
```

### Activities Collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "description": "Drove 40 km in SUV",
  "category": "Transport",
  "quantity": 40,
  "unit": "km",
  "emission": 8.5,
  "source": "ai_analyzed",
  "aiAnalysis": { ...analysis data... },
  "completed": true,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 🌐 API Quick Reference

### Auth
```bash
# Signup
POST /api/auth/signup
Body: { name, email, password }

# Login
POST /api/auth/login
Body: { email, password }

# Get current user
GET /api/auth/me
Header: Authorization: Bearer <token>
```

### Activities
```bash
# List activities
GET /api/activities
Header: Authorization: Bearer <token>

# Create activity
POST /api/activities
Header: Authorization: Bearer <token>
Body: { description, category, quantity, unit, emission }

# Analyze with AI
POST /api/activities/analyze
Header: Authorization: Bearer <token>
Body: { description }
```

### Dashboard
```bash
# Get metrics
GET /api/dashboard/metrics
Header: Authorization: Bearer <token>

# Get weekly trend
GET /api/dashboard/trend
Header: Authorization: Bearer <token>

# Get tips
GET /api/dashboard/tips
Header: Authorization: Bearer <token>
```

---

## 🎯 Next Steps

1. **Explore the Code** - Review frontend/backend structure
2. **Customize** - Add your own features or themes
3. **Deploy** - Ship to production (see README.md)
4. **Integrate** - Connect to your own database
5. **Enhance** - Add more Ollama prompts and features

---

## 📞 Need Help?

- 📖 Read the [README.md](./README.md) for detailed docs
- 🐛 Check browser console for errors
- 🔍 Verify all services are running (Ollama, MongoDB, Node servers)
- 💬 Review code comments for implementation details

---

## 🎉 You're All Set!

Your CarbonLens app is ready to track carbon footprint!

Visit: http://localhost:3000

**Demo Account:**  
📧 sejal6249@gmail.com  
🔑 password123  

---

**Happy Carbon Tracking! 🌍♻️**
