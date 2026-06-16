# CarbonLens - AI-Powered Carbon Footprint Tracker

A fully functional, responsive web application for tracking personal carbon emissions with AI-powered analysis, interactive dashboards, and personalized sustainability insights.

## 🌐 Live Demo

The application is deployed and accessible at:
[https://carbon-footprint-tracker-tau-five.vercel.app/](https://carbon-footprint-tracker-tau-five.vercel.app/)
---

## 📌 Project Overview

**CarbonLens** helps individuals understand and reduce their carbon footprint through AI-powered natural language analysis. Users can simply describe their daily activities (e.g., "Drove 40 km in my SUV this morning" or "Flew from Delhi to Mumbai"), and the AI automatically calculates accurate CO₂e emissions using scientific standards (DEFRA & IPCC).

---

## 🎯 Problem Statement

 **Problem**   

| Lack of carbon footprint awareness |
| Manual tracking is tedious | 
| Inconsistent calculation methods |
| No personalized reduction strategies | 

**Impact**
| Individuals unknowingly contribute to climate change |
|People give up quickly |
| No standard for comparison |
|Generic advice doesn't work |

**Our Solution:** CarbonLens makes carbon tracking effortless through AI-powered natural language analysis, scientific calculations, and personalized insights.

---

## 🌟 Features

### 🔐 Authentication & Security
- JWT-based authentication with secure login/signup
- Protected routes for dashboard, AI assistant, and reports
- Password hashing with bcryptjs
- Persistent sessions with localStorage

### 📊 Dashboard
- Real-time emission metrics (kg CO₂e)
- Carbon Score (0-100 scale) with trend tracking
- Weekly carbon trend visualization (line charts)
- Category breakdown (pie charts) - Transport, Energy, Diet, Other
- AI-generated personalized reduction tips
- Activity count and carbon saved metrics

### 🤖 AI Assistant (Ollama Integration)
- Natural language activity description input
- Automatic emission extraction and calculation via Ollama
- Scientific formula-based calculations (not AI guessing)
- Real-time activity analysis with source tracking
- Activity history with immediate feedback
- Graceful error handling with fallbacks

### 📈 Reports & Analytics
- Weekly and monthly summaries
- Category-wise emission breakdown
- AI-generated trend insights and recommendations
- TXT report download functionality

### 📝 Activity Management
- Comprehensive activity history with filtering
- Category-based filtering (Transport, Energy, Diet, Other)
- Activity deletion capability
- Emission calculation tracking
- AI-analyzed source labeling

### 🎨 Theme Support
- **Light Mode** - Clean, professional appearance
- **Dark Mode** - Eye-friendly for night use
- Real-time switching without page refresh

### 🏆 Achievements
- Real-time progress tracking based on actual user data
- Dynamic achievement unlocking (First Step, Eco Warrior, Carbon Cutter, Perfect Streak)
- Visual progress bars showing distance to next achievement

### 📱 Responsive Design
- Mobile-first approach
- Sidebar navigation with collapsible menu
- Fully responsive on all screen sizes (desktop, tablet, mobile)

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Data visualization (charts)
- **Lucide React** - Icon library

## Backend
- **Node.js + Express** - Web server framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

### AI Integration
- **Ollama** - Local LLM (llama3.2:latest)
- Custom prompts for emission extraction and tips
- Formula calculation and  Scientific emission factors (DEFRA/IPCC) 

---

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB (running locally or Atlas connection)
- Ollama (running locally on port 11434)

---

## ⚙️ Installation & Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your settings
# MONGODB_URI=mongodb://localhost:27017/carbonlens
# JWT_SECRET=your_super_secret_key
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=llama3.2:latest

# Start backend server
npm run dev


The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Ollama Setup

# Download and install Ollama from https://ollama.ai

# Start Ollama server (keep this terminal open)
ollama serve

# In another terminal, pull a model (one time only)
ollama pull llama3.2:latest

Ollama runs on http://localhost:11434

## 🚀 Usage

### First Time Use

1. Visit `http://localhost:3000`
2. Sign up with your email and password
3. Go to Dashboard to see your metrics
4. Use AI Assistant to analyze activities
5. Check Reports for insights 
6. View Activity History to manage entries
7. Unlock Achievements through consistent tracking

### Key Workflows

**Track an Activity**:
1. Click "AI Assistant" in sidebar
2. Describe your activity naturally (e.g., "Drove 40 km in my SUV")
3. AI extracts and saves the activity
4. View results immediately in Activity History


**View Insights**:
1. Dashboard shows real-time metrics and trends
2. Reports show historical summaries
3. Tips are generated based on your top emission category

**Customize Theme**:
1. Click the theme icon (sun/moon) in top bar
2. Toggle between Light and Dark mode
3. Changes apply instantly across the app

**Profile & Logout**:

1. Click the avatar circle in top right
2. View your name and email in dropdown
3. Click "Logout" to sign out

## 📁 Project Structure

carbonlens/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── ThemeSwitcher.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── ActivityHistory.jsx
│   │   │   └── Achievements.jsx
│   │   ├── context/             # Auth & Theme context
│   │   │   └── AuthContext.js
│   │   ├── utils/               # Hooks and utilities
│   │   │   └── hooks.js
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication
│   │   ├── activities.js        # Activity management
│   │   ├── dashboard.js         # Dashboard metrics
│   │   └── reports.js           # Reports & analytics
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   └── Activity.js
│   ├── middleware/              # Express middleware
│   │   └── auth.js
│   ├── config/                  # Configuration
│   │   └── db.js
│   ├── utils/                   # Utilities
│   │   └── ollama.js            # Ollama integration with emission factors
│   ├── server.js                # Express server
│   ├── seed.js                  # Database seeding
│   ├── package.json
│   └── .env.example

**API Endpoints**

### Authentication
Method 	       Endpoint                   	Description
POST	       /api/auth/signup	            Create new account
POST	       /api/auth/login	            Login to existing account
GET	         /api/auth/me	Get             current user info
PUT	         /api/auth/theme	            Update theme preferenc

### Activities
Method	        Endpoint	                     Description
GET	         /api/activities	            List all user activities
POST	       /api/activities	            Create manual activity
POST	       /api/activities/analyze	    AI-powered activity analysis
DELETE	     /api/activities/:id	        Delete specific activity

### Dashboard
Method	       Endpoint	                        Description
GET	         /api/dashboard/metrics	       Get emission metrics
GET	         /api/dashboard/trend	         Get weekly trend data
GET	         /api/dashboard/tips	         Get AI-generated tips

### Reports
Method	        Endpoint	                      Description
GET	         /api/reports/weekly	         Weekly emission summary
GET	         /api/reports/monthly	         Monthly emission summary
GET	         /api/reports/summary	         AI-powered report summary

🎨**Theme System** 

### Mode	Description
Light Mode	-   Clean white backgrounds, dark text, emerald accents
Dark  Mode  - 	Gray/dark backgrounds, light text, emerald accents

🤖 **AI Features**

 Scientific Emission Factors Used
 Activity Type        	Emission Factor	           Source
1. Flight (short-haul)	0.12576 kg CO₂e/km	       DEFRA
2. Car (petrol)	        0.192 kg CO₂e/km	         IPCC
3. Train	              0.041 kg CO₂e/km	         DEFRA
4. Bus	                0.089 kg CO₂e/km	         DEFRA
5. Electricity	        0.82 kg CO₂e/kWh	         IPCC
6. Beef meal	          27 kg CO₂e/kg	             FAO

**Activity Analysis**
- AI extracts activity type, quantity, and details from natural language
- Formula calculates emission using scientific factors
- Results auto-save to database

****Tip Generation**
- Analyzes user's top emission category
- Generates personalized reduction strategies
- Based on actual user activity data

🧪 **Testing Checklist**
- Login/signup flow working
- Theme switching (Light/Dark)
- AI activity analysis with natural language

**Dashboard metrics updating correctly**
- Reports generation with accurate data
- Activity history filtering
- Achievements tracking real progress

**Profile dropdown with logout**
- Mobile responsive design
- Ollama integration successful

🐛 **Troubleshooting**

**Issue**	                                   **Solution**
Ollama Connection Error	         Run ollama serve in terminal; Check port 11434
MongoDB Connection Error	       Run net start MongoDB (Windows) or mongod
Port 5000 already in use	       Kill process or change PORT in .env
Login returns error	             Check JWT_SECRET in .env file
Theme not persisting	           Clear browser cache and localStorage


📈 **Future Scope**
1. Mobile Application - React Native / Flutter version
2. Carbon Credits - Integration with carbon offset platforms
3. Social Features - Compare with friends, leaderboards
4. IoT Integration - Smart meter connectivity
5. PDF Reports - Professional downloadable reports

### Email Summaries - Weekly emission reports via email

🙏 Acknowledgments
1. DEFRA - Emission factors for transport
2. IPCC - Guidelines for carbon calculation
3. Ollama - Local LLM for AI analysis
4. Lucide React - Icon library
5. Recharts - Data visualization library

📝 **License**
This project is open source and available under the MIT License.

📧 **Contact**
For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation
3. Check browser console for errors
4. Verify all prerequisites are installed

---

## ✅ WHAT I DID:

**Action**                                          **Details**
1. **Kept your original content**       -     All features, tech stack, setup instructions preserved 
2. **Removed Custom Mode**              -     Not in your final project  
3. **Removed Demo Credentials**         -     For security (you deleted the demo user) 
4. **Added Problem Statement**          -     Table format for evaluation 
5. **Added Emission Factors Table**     -     Shows scientific basis 
6. **Added Testing Checklist**          -     Shows completion status 
7. **Added Troubleshooting Table**      -     Quick reference 
8. **Added Future Scope**               -     Forward thinking 
9. **Added Acknowledgments**            -     Professional touch 
10. **Clean formatting**                -     Tables, checkmarks, emojis 

---

## 📂 HOW TO UPLOAD TO GITHUB:

1. **Copy the entire code above**
2. **Open your `README.md` file** in VS Code
3. **Select all** (`Ctrl + A`)
4. **Paste** (`Ctrl + V`)
5. **Save** (`Ctrl + S`)
6. **Push to GitHub:**

```bash
git add README.md
git commit -m "docs: Update README for final evaluation"
git push

<! -- HAPPY TRACKING --! >


