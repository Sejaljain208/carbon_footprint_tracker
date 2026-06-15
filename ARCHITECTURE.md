# CarbonLens - Complete Architecture Guide

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Browser                            │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/HTTPS
        ┌────────────┴────────────┐
        ▼                         ▼
   ┌─────────────┐         ┌─────────────────┐
   │  React App  │         │  Static Assets  │
   │  (Vite Dev) │         │   (CSS, JS)     │
   └──────┬──────┘         └─────────────────┘
          │ REST API Calls
          ▼
   ┌──────────────────────────────┐
   │   Express Backend API        │
   │   (Node.js on port 5000)     │
   │                              │
   │  ├─ /api/auth/*              │
   │  ├─ /api/activities/*        │
   │  ├─ /api/dashboard/*         │
   │  └─ /api/reports/*           │
   └──────┬───────┬────────┬──────┘
          │       │        │
    ┌─────▼─┐ ┌───▼──┐ ┌──▼────────┐
    │MongoDB│ │Ollama│ │  JWT Auth │
    │       │ │ API  │ │  Tokens   │
    └───────┘ └──────┘ └───────────┘
```

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,           // "Sejal Jain"
  email: String,          // "sejal6249@gmail.com" (unique, indexed)
  password: String,       // bcrypt hashed
  carbonGoal: Number,     // Default: 100 kg CO2e/month
  carbonSaved: Number,    // Default: 0
  theme: {
    mode: String,         // "light" | "dark" | "custom"
    primaryColor: String, // Hex color, default: "#10b981"
    accentColor: String   // Hex color, default: "#f59e0b"
  },
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

### Activities Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // Reference to User
  description: String,    // "Drove 40 km in my SUV"
  category: String,       // "Transport" | "Energy" | "Diet" | "Other"
  quantity: Number,       // 40
  unit: String,           // "km" | "hours" | "kg" | "meal"
  emission: Number,       // CO2e in kg, e.g., 8.5
  source: String,         // "manual" | "ai_analyzed"
  aiAnalysis: {           // Optional, populated if AI analyzed
    activity_type: String,
    quantity: Number,
    unit: String,
    estimated_emission_kg_co2e: Number,
    category: String
  },
  completed: Boolean,     // Default: true
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

### Index Strategy
```javascript
Users:
  - email: unique, ascending
  - createdAt: ascending

Activities:
  - userId: ascending
  - category: ascending
  - createdAt: descending (for sorting)
  - compound: (userId, createdAt descending)
```

---

## 🔐 Authentication Flow

```
1. User submits signup/login
        │
        ▼
   Express POST handler
        │
        ▼
   Validate input
        │
        ▼
   ├─ Signup: Hash password, Create user
   │
   └─ Login: Find user, Compare passwords
        │
        ▼
   Generate JWT token
   Token = sign({ id: user._id }, SECRET, { expiresIn: '7d' })
        │
        ▼
   Return token to frontend
   localStorage.setItem('token', token)
        │
        ▼
   Protected routes verify token
   JWT middleware decodes token and sets req.userId
```

---

## 🤖 AI Integration (Ollama)

### Emission Extraction Flow
```
User Input: "Drove 40 km in my SUV"
        │
        ▼
   POST /api/activities/analyze
        │
        ▼
   Create Ollama Prompt:
   "Extract activity_type, quantity, unit, 
    estimated_emission_kg_co2e from: {input}"
        │
        ▼
   axios.post('http://localhost:11434/api/generate')
        │
        ▼
   Ollama Returns JSON Response
        │
        ▼
   Parse emission data
        │
        ▼
   Save to MongoDB
        │
        ▼
   Return to frontend with results
```

### Ollama API Endpoint
```
POST http://localhost:11434/api/generate

Body:
{
  "model": "llama2",
  "prompt": "Your prompt here",
  "stream": false,
  "temperature": 0.7
}

Response:
{
  "response": "JSON response with extracted data"
}
```

---

## 🔄 Data Flow for Key Features

### Dashboard Metrics
```
1. Frontend requests: GET /api/dashboard/metrics
2. Backend queries activities: Activity.find({ userId })
3. Calculate metrics:
   - totalEmission = sum of all activity emissions
   - thisWeek = filter last 7 days
   - lastWeek = filter 7-14 days ago
   - emissionChange = ((thisWeek - lastWeek) / lastWeek) * 100
   - carbonScore = max(0, 100 - totalEmission/2)
   - categoryBreakdown = group by category
4. Return formatted metrics to frontend
5. Frontend displays in MetricCard components
6. Charts update with new data
```

### Activity Analysis
```
1. User types: "Flew from Delhi to Mumbai"
2. Frontend: POST /api/activities/analyze { description }
3. Backend gets description
4. Calls extractEmissionData(description)
5. Creates Ollama prompt with instruction
6. Ollama analyzes and returns JSON
7. Create new Activity document with aiAnalysis
8. Save to MongoDB
9. Return activity + analysis to frontend
10. Frontend shows result card
11. Activity auto-saved to history
```

---

## 📁 File Organization

```
CarbonLens/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   ├── TopBar.jsx           # Header with user info
│   │   │   ├── Chart.jsx            # Recharts wrapper
│   │   │   ├── MetricCard.jsx       # Dashboard metric card
│   │   │   ├── ThemeSwitcher.jsx    # Theme picker
│   │   │   └── ProtectedRoute.jsx   # Auth wrapper
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Login/signup page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── AIAssistant.jsx      # Activity analyzer
│   │   │   ├── Reports.jsx          # Analytics & PDF
│   │   │   ├── ActivityHistory.jsx  # Activity log
│   │   │   └── Achievements.jsx     # Badges
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth + Theme context
│   │   │
│   │   ├── utils/
│   │   │   └── hooks.js             # useAuth, useTheme
│   │   │
│   │   ├── App.jsx                  # Router setup
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Tailwind + globals
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   ├── auth.js                  # Signup/login/user
│   │   ├── activities.js            # CRUD + analysis
│   │   ├── dashboard.js             # Metrics & trends
│   │   └── reports.js               # Reports & summary
│   │
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Activity.js              # Activity schema
│   │
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   │
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── utils/
│   │   └── ollama.js                # Ollama API calls
│   │
│   ├── server.js                    # Express app setup
│   ├── seed.js                      # Database seeding
│   └── package.json
│
├── README.md                        # Full documentation
├── QUICKSTART.md                    # Quick setup guide
├── ARCHITECTURE.md                  # This file
├── setup.sh                         # Unix/Mac setup script
└── setup.bat                        # Windows setup script
```

---

## 🔌 Complete API Reference

### Authentication Endpoints

#### POST /api/auth/signup
Create new user account
```
Request:
{
  "name": "Sejal Jain",
  "email": "sejal6249@gmail.com",
  "password": "password123"
}

Response 201:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_here",
    "name": "Sejal Jain",
    "email": "sejal6249@gmail.com",
    "theme": {...}
  }
}
```

#### POST /api/auth/login
User login
```
Request:
{
  "email": "sejal6249@gmail.com",
  "password": "password123"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}

Response 401:
{ "message": "Invalid credentials" }
```

#### GET /api/auth/me
Get current user profile
```
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response 200:
{
  "user": {
    "id": "...",
    "name": "Sejal Jain",
    "email": "sejal6249@gmail.com",
    "theme": {
      "mode": "light",
      "primaryColor": "#10b981",
      "accentColor": "#f59e0b"
    }
  }
}
```

#### PUT /api/auth/theme
Update user theme settings
```
Headers:
Authorization: Bearer ...

Request:
{
  "mode": "custom",
  "primaryColor": "#8b5cf6",
  "accentColor": "#ec4899"
}

Response 200:
{
  "theme": {
    "mode": "custom",
    "primaryColor": "#8b5cf6",
    "accentColor": "#ec4899"
  }
}
```

### Activity Endpoints

#### GET /api/activities
Get all activities for user
```
Headers:
Authorization: Bearer ...

Query Params:
category=Transport (optional)
sort=createdAt (optional)

Response 200:
[
  {
    "_id": "activity_id",
    "userId": "user_id",
    "description": "Drove 40 km in SUV",
    "category": "Transport",
    "quantity": 40,
    "unit": "km",
    "emission": 8.5,
    "source": "ai_analyzed",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  ...
]
```

#### POST /api/activities
Create manual activity
```
Headers:
Authorization: Bearer ...

Request:
{
  "description": "Drove 40 km in SUV",
  "category": "Transport",
  "quantity": 40,
  "unit": "km",
  "emission": 8.5
}

Response 201:
{ ...activity object... }
```

#### POST /api/activities/analyze
Analyze activity with AI (Ollama)
```
Headers:
Authorization: Bearer ...

Request:
{
  "description": "Drove 40 km in my SUV this morning"
}

Response 201:
{
  "activity": { ...saved activity... },
  "analysis": {
    "activity_type": "driving",
    "quantity": 40,
    "unit": "km",
    "estimated_emission_kg_co2e": 8.5,
    "category": "Transport"
  }
}

Response 500 (if Ollama unreachable):
{ "message": "Failed to connect to Ollama..." }
```

#### DELETE /api/activities/:id
Delete specific activity
```
Headers:
Authorization: Bearer ...

Response 200:
{ "message": "Activity deleted" }

Response 404:
{ "message": "Activity not found" }
```

### Dashboard Endpoints

#### GET /api/dashboard/metrics
Get dashboard metrics and statistics
```
Headers:
Authorization: Bearer ...

Response 200:
{
  "totalEmission": "142.40",
  "emissionChange": "-5.3",
  "carbonScore": 92,
  "totalActivities": 24,
  "newThisWeek": 5,
  "carbonSaved": "18.7",
  "categoryBreakdown": {
    "Transport": 61.5,
    "Energy": 45.6,
    "Diet": 35.3
  },
  "topCategory": "Transport"
}
```

#### GET /api/dashboard/trend
Get weekly emission trend
```
Headers:
Authorization: Bearer ...

Response 200:
[
  { "date": "Mon", "emission": "15.2" },
  { "date": "Tue", "emission": "18.5" },
  { "date": "Wed", "emission": "12.3" },
  { "date": "Thu", "emission": "20.1" },
  { "date": "Fri", "emission": "16.4" },
  { "date": "Sat", "emission": "25.8" },
  { "date": "Sun", "emission": "12.0" }
]
```

#### GET /api/dashboard/tips
Get AI-generated personalized tips
```
Headers:
Authorization: Bearer ...

Response 200:
{
  "tips": "1. You used 43% transport. Try carpooling or EV.\n2. Energy consumption increased. Check appliances.\n3. Reduce meat consumption for lower diet impact."
}
```

### Reports Endpoints

#### GET /api/reports/weekly
Get weekly summary
```
Headers:
Authorization: Bearer ...

Response 200:
{
  "week": "1/8/2024 - 1/15/2024",
  "total": "120.45",
  "count": 12,
  "categories": {
    "Transport": "61.50",
    "Energy": "45.60",
    "Diet": "13.35"
  }
}
```

#### GET /api/reports/monthly
Get monthly summary
```
Headers:
Authorization: Bearer ...

Response 200:
{
  "month": "Last 30 days",
  "total": "535.80",
  "count": 55,
  "categories": {
    "Transport": "230.10",
    "Energy": "180.40",
    "Diet": "125.30"
  }
}
```

#### GET /api/reports/summary
Get AI-generated report summary
```
Headers:
Authorization: Bearer ...

Response 200:
{
  "summary": "Great progress this week! Your emissions decreased by 5%. Keep up with sustainable choices, especially in transportation. Consider carpooling or using public transit to further reduce your carbon footprint."
}
```

---

## 🧪 Example Request/Response Flow

### Scenario: User Analyzes Activity

**Step 1: Frontend Sends Request**
```bash
POST http://localhost:5000/api/activities/analyze
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "description": "Flew from Delhi to Mumbai for a conference"
}
```

**Step 2: Backend Processes**
- Verifies JWT token
- Validates description exists
- Calls `extractEmissionData(description)`
- Ollama receives prompt:
```
"Extract activity type, quantity, and estimate CO2e in kg.
Return JSON with activity_type, quantity, unit, estimated_emission_kg_co2e, category.

Activity: 'Flew from Delhi to Mumbai for a conference'"
```

- Ollama responds:
```json
{
  "activity_type": "flying",
  "quantity": 1,
  "unit": "flight",
  "estimated_emission_kg_co2e": 125.5,
  "category": "Transport"
}
```

**Step 3: Backend Saves**
- Creates Activity document
- Stores analysis in aiAnalysis field
- Updates user stats
- Returns response

**Step 4: Frontend Receives**
```json
{
  "activity": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "...",
    "description": "Flew from Delhi to Mumbai for a conference",
    "category": "Transport",
    "quantity": 1,
    "unit": "flight",
    "emission": 125.5,
    "source": "ai_analyzed",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "analysis": {
    "activity_type": "flying",
    "quantity": 1,
    "unit": "flight",
    "estimated_emission_kg_co2e": 125.5,
    "category": "Transport"
  }
}
```

**Step 5: Frontend Updates**
- Shows analysis result card
- Updates dashboard metrics
- Adds to activity history
- Updates charts

---

## 🎨 Theme System Architecture

### Theme Context State
```javascript
const [theme, setTheme] = useState('light') // 'light' | 'dark' | 'custom'
const [customTheme, setCustomTheme] = useState({
  primary: '#10b981',  // Emerald
  accent: '#f59e0b'    // Amber
})
```

### CSS Variable Injection
```javascript
// For custom theme:
html.style.setProperty('--theme-primary', '#8b5cf6')
html.style.setProperty('--theme-accent', '#ec4899')

// CSS uses:
.bg-primary { background-color: var(--primary-color) }
.text-accent { color: var(--accent-color) }
```

### Tailwind Dark Mode Integration
```html
<!-- Dark mode triggered by .dark class on html -->
<html class="dark">
  <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

---

## 📱 Responsive Breakpoints

```css
/* Tailwind CSS breakpoints used */
sm:  640px   (tablets)
md:  768px   (landscape tablets)
lg:  1024px  (desktops)
xl:  1280px  (large screens)

/* Sidebar behavior */
lg:  Sidebar visible (not hidden)
<lg: Sidebar hidden, toggle button on mobile
```

---

## ✅ Performance Optimization

### Frontend
- Code splitting with Vite
- Lazy loading with React.lazy()
- Chart re-renders only on data change
- LocalStorage for theme persistence
- JWT token caching

### Backend
- MongoDB indexes on frequently queried fields
- Aggregation pipeline for calculations
- JWT validation on every protected route
- Error handling and fallback responses

---

## 🚀 Deployment Checklist

- [ ] Set production MongoDB URI
- [ ] Change JWT_SECRET to random secure key
- [ ] Enable HTTPS
- [ ] Set CORS properly for production domain
- [ ] Use environment-specific configs
- [ ] Add rate limiting
- [ ] Setup logging
- [ ] Configure Ollama for production
- [ ] Setup CDN for static assets
- [ ] Database backups automated
- [ ] Monitor error logs
- [ ] Setup CI/CD pipeline

---

## 📞 Support & Debugging

See README.md and QUICKSTART.md for troubleshooting.

Key debug points:
- Ollama connectivity
- MongoDB connection
- JWT token validation
- CORS issues
- Environment variables
