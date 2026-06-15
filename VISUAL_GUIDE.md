# 🎨 CarbonLens - Visual Implementation Guide

## 🗂️ Project Structure

```
carbonlens/
│
├── 📄 README.md                    ← Start here for overview
├── 📄 QUICKSTART.md                ← Fast setup guide
├── 📄 ARCHITECTURE.md              ← Technical details
├── 📄 SUMMARY.md                   ← Feature summary
├── 📄 ENVIRONMENT_SETUP.md         ← Config guide
├── 📄 FILE_INDEX.md                ← File reference
├── 🔧 setup.sh                     ← Mac/Linux setup
├── 🔧 setup.bat                    ← Windows setup
│
├── 📁 frontend/                    ← React + Vite app
│   ├── 📁 src/
│   │   ├── 📁 components/          ← Reusable UI
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── ThemeSwitcher.jsx
│   │   │   ├── Chart.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── 📁 pages/               ← Page screens
│   │   │   ├── Landing.jsx         (login/signup)
│   │   │   ├── Dashboard.jsx       (main view)
│   │   │   ├── AIAssistant.jsx     (analyzer)
│   │   │   ├── Reports.jsx         (analytics)
│   │   │   ├── ActivityHistory.jsx (log)
│   │   │   └── Achievements.jsx    (badges)
│   │   │
│   │   ├── 📁 context/
│   │   │   └── AuthContext.jsx     (state)
│   │   │
│   │   ├── 📁 utils/
│   │   │   └── hooks.js            (custom hooks)
│   │   │
│   │   ├── App.jsx                 (router)
│   │   ├── main.jsx                (entry)
│   │   └── index.css               (styling)
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
│
├── 📁 backend/                     ← Express + MongoDB
│   ├── 📁 routes/
│   │   ├── auth.js                 (login/signup)
│   │   ├── activities.js           (CRUD + AI)
│   │   ├── dashboard.js            (metrics)
│   │   └── reports.js              (analytics)
│   │
│   ├── 📁 models/
│   │   ├── User.js                 (user schema)
│   │   └── Activity.js             (activity schema)
│   │
│   ├── 📁 middleware/
│   │   └── auth.js                 (JWT check)
│   │
│   ├── 📁 config/
│   │   └── db.js                   (connection)
│   │
│   ├── 📁 utils/
│   │   └── ollama.js               (AI integration)
│   │
│   ├── server.js                   (express setup)
│   ├── seed.js                     (demo data)
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
```

---

## 🖼️ UI Flow Diagram

```
┌─────────────────────────────────────────────────┐
│              Landing Page                       │
│  (Login/Signup)                                │
│  - Light/Dark/Custom theme                    │
│  - Demo credentials shown                     │
└──────────────┬──────────────────────────────────┘
               │
               ├─→ [Sign Up] → Create account
               │
               └─→ [Sign In] → Verify credentials
                              (JWT issued)
                              │
        ┌─────────────────────┴──────────────────────┐
        │                                             │
        ▼ ↵ (Redirect)                               │
┌─────────────────────────────┐                      │
│      Main Layout            │                      │
├─────────────────────────────┤                      │
│ ┌──────────┐ ┌───────────┐  │                      │
│ │ Sidebar  │ │ TopBar    │  │                      │
│ │----------|─|-----------|  │                      │
│ │Dashboard │ │ Profile   │  │                      │
│ │AI Asst   │ │ Theme 🎨  │  │                      │
│ │Reports   │ │ Logout    │  │                      │
│ │History   │ │           │  │                      │
│ │Achievs   │ │           │  │                      │
│ └──────────┘ └───────────┘  │                      │
│            │                 │                      │
│    ┌───────┴─────────────────┤                      │
│    │  Page Content Area      │                      │
│    │  (Changes based on      │                      │
│    │   navigation)           │                      │
│    └─────────────────────────┤                      │
└─────────────────────────────┘                      │
        │                                            │
        ├─→ Dashboard           ← [If protected]────┘
        │   - 4 Metric Cards
        │   - Line Chart
        │   - Pie Chart
        │   - Tips
        │
        ├─→ AI Assistant
        │   - Text Input
        │   - Analyze Button
        │   - Result Card
        │   - History List
        │
        ├─→ Reports
        │   - Weekly Table
        │   - Monthly Table
        │   - AI Summary
        │   - Download Button
        │
        ├─→ Activity History
        │   - Activity Table
        │   - Category Filter
        │   - Delete Button
        │   - Stats
        │
        ├─→ Achievements
        │   - Badge Cards
        │   - Progress Bars
        │   - Unlock Status
        │
        └─→ Logout
            - Clear token
            - Redirect to Landing
```

---

## 🔐 Authentication Flow

```
User Input (email, password)
        │
        ▼
    [Sign In/Up Button]
        │
        ▼
Frontend POST /api/auth/login or /api/auth/signup
        │
        ├─→ Request includes: { email, password, name? }
        │
        ▼
Backend auth.js route handler
        │
        ├─→ Validate input
        ├─→ Check if user exists (for login)
        ├─→ Compare passwords (bcryptjs)
        ├─→ Generate JWT token
        │   Token = sign({ id: user._id }, SECRET, { expiresIn: '7d' })
        │
        ▼
Response with token + user object
        │
        ▼
Frontend stores token in localStorage
        │
        ├─→ AuthContext.setToken(token)
        ├─→ localStorage.setItem('token', token)
        ├─→ Redirect to /dashboard
        │
        ▼
Protected routes now accessible
        │
        └─→ Every API call includes: Authorization: Bearer <token>
            Backend verifies token in auth middleware
```

---

## 📊 Data Flow Architecture

```
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       ├─ User Input
       │  (text, buttons, etc.)
       │
       ├─ State Update
       │  (React Context,
       │   localStorage)
       │
       ├─ HTTP Request
       │  (POST, GET, DELETE)
       │  with JWT token
       │
       ▼
┌──────────────────────────┐
│   Express Backend        │
│   (req.body, req.params) │
└──────┬───────────────────┘
       │
       ├─ JWT Verification
       │  (auth middleware)
       │
       ├─ Input Validation
       │
       ├─ Process Request
       │  (routes/*)
       │
       ├─ Database Query
       │  (Mongoose models)
       │
       ├─ Optional: Ollama Call
       │  (axios to localhost:11434)
       │
       ▼
┌──────────────────────────┐
│  MongoDB / Ollama        │
│  (Data persistence /     │
│   AI processing)         │
└──────┬───────────────────┘
       │
       ├─ Response Object
       │  (JSON)
       │
       ▼
┌──────────────────────────┐
│   Backend Response       │
│   (HTTP 200/201/401/500) │
└──────┬───────────────────┘
       │
       ├─ Frontend receives
       │
       ├─ State update
       │  (Context/localStorage)
       │
       ▼
┌──────────────────────────┐
│   UI Re-render           │
│   (Component updates)    │
└──────────────────────────┘
```

---

## 🤖 AI Analysis Pipeline

```
┌─────────────────────────────────────────┐
│  User describes activity in natural lang│
│  e.g., "Drove 40 km in my SUV"         │
└──────────────┬────────────────────────────┘
               │
               ▼
        ┌─────────────┐
        │ Frontend    │
        │ FormSubmit  │
        └──────┬──────┘
               │
               ▼
   POST /api/activities/analyze
   { description: "Drove 40 km..." }
               │
               ▼
        ┌──────────────────────────┐
        │ Backend - activities.js  │
        │ - Verify JWT             │
        │ - Get description        │
        └──────┬───────────────────┘
               │
               ▼
   extractEmissionData(description)
   from ollama.js
               │
               ▼
        ┌──────────────────────────┐
        │ Create Ollama Prompt     │
        │ "Extract activity type,  │
        │  quantity, unit, CO2e    │
        │  from: {description}"    │
        └──────┬───────────────────┘
               │
               ▼
        ┌──────────────────────────┐
        │ axios.post to Ollama     │
        │ http://localhost:11434/  │
        │ api/generate             │
        └──────┬───────────────────┘
               │
               ▼
        ┌──────────────────────────┐
        │ Ollama AI (llama2)       │
        │ - Analyzes prompt        │
        │ - Returns JSON response  │
        │ {                        │
        │   activity_type: "drive" │
        │   quantity: 40           │
        │   unit: "km"             │
        │   estimated_emission_kg: 8.5
        │   category: "Transport"  │
        │ }                        │
        └──────┬───────────────────┘
               │
               ▼
        ┌──────────────────────────┐
        │ Parse Response JSON      │
        │ - Extract emission data  │
        │ - Validate fields        │
        └──────┬───────────────────┘
               │
               ▼
        ┌──────────────────────────┐
        │ Create Activity Record   │
        │ - userId (from JWT)      │
        │ - description            │
        │ - category               │
        │ - quantity, unit         │
        │ - emission (calculated)  │
        │ - source: "ai_analyzed"  │
        │ - aiAnalysis: {...}      │
        └──────┬───────────────────┘
               │
               ▼
        ┌──────────────────────────┐
        │ Save to MongoDB          │
        │ Activity.create(...)     │
        └──────┬───────────────────┘
               │
               ▼
        ┌──────────────────────────┐
        │ Return to Frontend       │
        │ {                        │
        │   activity: {...}        │
        │   analysis: {...}        │
        │ }                        │
        └──────┬───────────────────┘
               │
               ▼
        ┌──────────────────────────┐
        │ Frontend Displays        │
        │ - Result Card            │
        │ - Success Message        │
        │ - Add to History         │
        │ - Trigger Dashboard      │
        │   Refresh                │
        └──────────────────────────┘
```

---

## 🎨 Theme System

```
┌─────────────────────────────────────────┐
│ Theme Switcher Component                │
│ ☀️ Light | 🌙 Dark | 🎨 Custom        │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┬──────────┐
        │             │          │
        ▼             ▼          ▼
    Light        Dark       Custom
    Mode         Mode       Mode
     │            │          │
     ├─→ HTML     ├─→ HTML   ├─→ HTML
     │   class    │   class  │   class
     │   ="light" │   ="dark"│   ="custom"
     │            │          │
     ├─→ CSS      ├─→ CSS    ├─→ CSS
     │   variables│   variables│ variables
     │   default  │   dark    │   custom
     │            │          │   colors
     ▼            ▼          ▼
  White       Gray-900   User
  Backgrounds Dark Text  Selected
  Dark Text   Light      Colors
             Backgrounds

All Components:
├─ Read current theme from Context
├─ Conditional CSS classes
│  className={`
│    bg-white dark:bg-gray-800
│    text-gray-900 dark:text-white
│  `}
└─ Real-time updates on theme change

Theme Persistence:
├─ localStorage.setItem('theme', value)
├─ localStorage.setItem('customTheme', JSON.stringify({...}))
└─ Retrieved on app load
```

---

## 📱 Responsive Breakpoints

```
Mobile (<640px)
├─ Sidebar: Hidden (hamburger toggle)
├─ TopBar: Full width
├─ Cards: Full width, stacked
├─ Charts: 100% width
├─ Tables: Horizontal scroll
└─ Buttons: Large touch targets

Tablet (640px - 1024px)
├─ Sidebar: Optional collapse
├─ TopBar: Full width
├─ Cards: 2-column grid
├─ Charts: Side by side
├─ Tables: Mostly visible
└─ Buttons: Medium size

Desktop (>1024px)
├─ Sidebar: Always visible (left)
├─ Content: Margin left (64 * 4px)
├─ Cards: 4-column grid or 2x2
├─ Charts: Full width
├─ Tables: Horizontal scroll if needed
└─ Buttons: Standard size
```

---

## 💾 Database Collections Structure

```
┌─────────────────────────────────────┐
│          USERS Collection           │
├─────────────────────────────────────┤
│ _id: ObjectId                       │
│ name: "Sejal Jain"                  │
│ email: "sejal6249@gmail.com"        │
│ password: "bcrypt_hash_..."         │
│ carbonGoal: 100                     │
│ carbonSaved: 18.7                   │
│ theme: {                            │
│   mode: "light" | "dark" | "custom" │
│   primaryColor: "#10b981"           │
│   accentColor: "#f59e0b"            │
│ }                                   │
│ createdAt: Date                     │
│ updatedAt: Date                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      ACTIVITIES Collection          │
├─────────────────────────────────────┤
│ _id: ObjectId                       │
│ userId: ObjectId (→ User)           │
│ description: "Drove 40 km..."       │
│ category: "Transport" / "Energy"... │
│ quantity: 40                        │
│ unit: "km" / "hours" / "kg"         │
│ emission: 8.5 (kg CO2e)             │
│ source: "manual" | "ai_analyzed"    │
│ aiAnalysis: {                       │
│   activity_type: "driving"          │
│   quantity: 40                      │
│   unit: "km"                        │
│   estimated_emission_kg_co2e: 8.5   │
│   category: "Transport"             │
│ }                                   │
│ completed: true                     │
│ createdAt: Date                     │
│ updatedAt: Date                     │
└─────────────────────────────────────┘
```

---

## 🔄 Key Component Relationships

```
App.jsx (Router)
│
├─→ AuthProvider
│   └─→ AuthContext
│       ├─ user
│       ├─ token
│       ├─ loading
│       ├─ login()
│       ├─ signup()
│       └─ logout()
│
├─→ ThemeProvider
│   └─→ ThemeContext
│       ├─ theme ("light", "dark", "custom")
│       ├─ setTheme()
│       ├─ customTheme (colors)
│       └─ updateCustomTheme()
│
└─→ BrowserRouter
    ├─→ Routes
        ├─ Landing (public)
        ├─ Dashboard (protected)
        ├─ AIAssistant (protected)
        ├─ Reports (protected)
        ├─ ActivityHistory (protected)
        └─ Achievements (protected)

Protected Route Wrapper
├─ Check token exists
├─ Check user loaded
├─ Redirect to Landing if not
└─ Render child component

Dashboard Component
├─ useAuth() → get token
├─ fetch /api/dashboard/metrics
├─ fetch /api/dashboard/trend
├─ fetch /api/dashboard/tips
├─ MetricCard × 4
├─ Chart (type="line")
├─ Chart (type="pie")
└─ Tips display
```

---

## 🎯 Feature Implementation Status

```
✅ Authentication
   ├─ Sign Up
   ├─ Login
   ├─ JWT Tokens
   └─ Protected Routes

✅ Dashboard
   ├─ Metric Cards
   ├─ Weekly Trend Chart
   ├─ Category Pie Chart
   └─ AI Tips

✅ AI Assistant
   ├─ Text Input
   ├─ Ollama Analysis
   ├─ Result Display
   └─ History

✅ Reports
   ├─ Weekly Summary
   ├─ Monthly Summary
   ├─ AI Insights
   └─ Download

✅ Activity History
   ├─ Activity Table
   ├─ Category Filter
   ├─ Delete Function
   └─ Statistics

✅ Achievements
   ├─ Badge System
   ├─ Progress Bars
   ├─ Unlock Status
   └─ Tips

✅ Theming
   ├─ Light Mode
   ├─ Dark Mode
   ├─ Custom Mode
   └─ Color Picker

✅ Responsive Design
   ├─ Mobile
   ├─ Tablet
   ├─ Desktop
   └─ Hamburger Menu

✅ Database
   ├─ MongoDB Setup
   ├─ User Model
   ├─ Activity Model
   └─ Seeding

✅ Backend API
   ├─ Auth Endpoints
   ├─ Activity Endpoints
   ├─ Dashboard Endpoints
   └─ Report Endpoints

✅ Ollama Integration
   ├─ API Connection
   ├─ Emission Extraction
   ├─ Tip Generation
   └─ Error Handling
```

---

## 📞 Support Quick Links

- 🚀 [QUICKSTART.md](./QUICKSTART.md) - 5-min setup
- 📖 [README.md](./README.md) - Full docs
- 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) - Tech details
- ⚙️ [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Config help
- 📋 [FILE_INDEX.md](./FILE_INDEX.md) - File reference
- 📊 [SUMMARY.md](./SUMMARY.md) - Overview

---

**🌿 CarbonLens is ready to launch!**

Start with [QUICKSTART.md](./QUICKSTART.md) →
