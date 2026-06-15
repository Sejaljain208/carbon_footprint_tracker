# Backend Environment Configuration

## 🔐 Create .env file in the backend folder

Copy the contents below and save as `backend/.env`:

```env
# ===== DATABASE =====
# MongoDB connection string
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/carbonlens

# MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbonlens?retryWrites=true&w=majority

# ===== AUTHENTICATION =====
# JWT Secret key (CHANGE THIS IN PRODUCTION!)
# Generate a random string: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345abcde

# JWT token expiration time
JWT_EXPIRE=7d

# ===== SERVER =====
# Server port
PORT=5000

# Environment (development | production)
NODE_ENV=development

# ===== AI / OLLAMA =====
# Ollama API endpoint
OLLAMA_BASE_URL=http://localhost:11434

# Ollama model to use
# Options: llama2, mistral, neural-chat, or any model installed locally
OLLAMA_MODEL=llama2

# ===== CORS =====
# Allowed origins for CORS
# Frontend development URL:
FRONTEND_URL=http://localhost:3000

# ===== LOGGING =====
# Logging level (optional)
LOG_LEVEL=debug
```

## 📝 Setup Instructions

### 1. Create the .env file
```bash
cd backend
cp .env.example .env  # or create a new .env file
```

### 2. Edit with your values

**For Local Development (Default):**
- Keep MONGODB_URI as: `mongodb://localhost:27017/carbonlens`
- Keep OLLAMA_BASE_URL as: `http://localhost:11434`
- Generate a random JWT_SECRET

**For MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/carbonlens?retryWrites=true&w=majority`
4. Replace username/password with your credentials
5. Paste into MONGODB_URI

**For Production:**
```env
NODE_ENV=production
JWT_SECRET=<use strong random string>
MONGODB_URI=<production MongoDB URL>
PORT=5000
```

### 3. Generate a Secure JWT Secret (optional but recommended)

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Or use an online tool:**
- https://randomkeygen.com/
- Generate a random string and use it

### 4. Verify Configuration

Test the connection:
```bash
# Start MongoDB (if local)
mongod

# In another terminal, verify connection:
npm run dev

# Check logs - you should see:
# ✓ MongoDB Connected: localhost
# 🤖 Ollama endpoint: http://localhost:11434
# 🚀 Server running on port 5000
```

---

## 🌐 Frontend Environment Configuration

The frontend doesn't need a `.env` file for development. It uses:
- Vite proxy to forward API calls to backend
- Browser localStorage for tokens
- Hardcoded API base path: `/api`

**In vite.config.js:**
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
}
```

This means:
- Frontend on: http://localhost:3000
- Backend on: http://localhost:5000
- API calls automatically route to backend

### Frontend Build (Production)

For production, the frontend is built with:
```bash
cd frontend
npm run build
```

Output in `dist/` folder - deploy to static hosting.

Before building, ensure backend URL is correct in your deployment.

---

## ✅ Configuration Checklist

- [ ] MongoDB running (local or Atlas connected)
- [ ] MONGODB_URI set correctly
- [ ] JWT_SECRET is a random string
- [ ] OLLAMA_BASE_URL points to local Ollama
- [ ] OLLAMA_MODEL is installed (`ollama pull llama2`)
- [ ] PORT is available (5000)
- [ ] Frontend can reach backend (CORS configured)

---

## 🔄 Default Configuration for Quick Start

```env
MONGODB_URI=mongodb://localhost:27017/carbonlens
JWT_SECRET=change_me_in_production
JWT_EXPIRE=7d
PORT=5000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 🚀 Testing Configuration

After setup, verify everything works:

### 1. Backend is running
```bash
curl http://localhost:5000/api/health
# Should return: { "status": "OK", "message": "..." }
```

### 2. Database is connected
Check logs for: `MongoDB Connected: localhost`

### 3. Ollama is ready
```bash
curl http://localhost:11434/api/tags
# Should return list of installed models
```

### 4. Frontend connects to backend
Open http://localhost:3000
Login should work without errors
Check Network tab in DevTools - API calls should work

---

## ⚠️ Common Configuration Issues

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check connection string: `MONGODB_URI=mongodb://localhost:27017/carbonlens`
- For Atlas, verify IP whitelist

### Issue: "Ollama API not responding"
**Solution:**
- Start Ollama: `ollama serve`
- Verify URL: `OLLAMA_BASE_URL=http://localhost:11434`
- Check model is installed: `ollama pull llama2`

### Issue: "JWT token invalid"
**Solution:**
- Regenerate JWT_SECRET
- Clear localStorage in browser
- Login again to get new token

### Issue: "Port 5000 already in use"
**Solution:**
- Change PORT in .env to different number (e.g., 5001)
- Or kill process using port 5000

---

## 📚 Environment Variable Reference

| Variable | Example | Purpose |
|----------|---------|---------|
| MONGODB_URI | mongodb://localhost:27017/carbonlens | Database connection |
| JWT_SECRET | abc123def456 | Token signing key |
| JWT_EXPIRE | 7d | Token validity period |
| PORT | 5000 | Server port |
| OLLAMA_BASE_URL | http://localhost:11434 | Ollama API endpoint |
| OLLAMA_MODEL | llama2 | AI model to use |
| NODE_ENV | development | Execution environment |
| FRONTEND_URL | http://localhost:3000 | Frontend origin |

---

## 🔐 Production Security Tips

1. **JWT_SECRET**: Use a cryptographically random string (min 32 chars)
2. **HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Use secrets manager, never commit .env
4. **Database**: Use managed service like MongoDB Atlas
5. **Ollama**: Either self-host or use API service
6. **CORS**: Restrict to your domain only
7. **Rate Limiting**: Add rate limiter for API
8. **Logging**: Setup error tracking (Sentry, etc.)

---

## 📞 Need Help?

1. Verify all services running: `mongod`, `ollama serve`, `npm run dev`
2. Check connection strings match your setup
3. Review error logs in terminal
4. Ensure ports are not blocked by firewall
5. Check .env file exists and is readable

---

**Configuration Complete!** ✨

Your CarbonLens backend is ready to go.

Next: Follow [QUICKSTART.md](./QUICKSTART.md) to start the app!
