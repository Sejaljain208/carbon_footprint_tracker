@echo off
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║           CarbonLens - Quick Start Setup                   ║
echo ║     AI-Powered Carbon Footprint Tracker                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo.
echo 📋 Prerequisites Check:
echo ================================
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Node.js is installed
    node --version
) else (
    echo ✗ Node.js is NOT installed
    echo   Download from: https://nodejs.org/
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ npm is installed
    npm --version
) else (
    echo ✗ npm is NOT installed
    exit /b 1
)

echo.
echo 🚀 Starting Setup:
echo ================================

echo.
echo 1️⃣  Setting up Backend...
cd backend
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed.
)

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit backend\.env with your MongoDB URI
    echo    Default MONGODB_URI=mongodb://localhost:27017/carbonlens
)

echo Seeding database with demo data...
call node seed.js

cd ..

echo ✓ Backend setup complete!

echo.
echo 2️⃣  Setting up Frontend...
cd frontend
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed.
)
cd ..

echo ✓ Frontend setup complete!

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              Setup Complete! 🎉                           ║
echo ╚════════════════════════════════════════════════════════════╝

echo.
echo 📝 Next Steps:
echo ================================
echo.
echo 1. Start Ollama (in a terminal):
echo    ollama serve
echo    ollama pull llama2
echo.
echo 2. Start MongoDB (if using local):
echo    mongod
echo.
echo 3. Start Backend Server:
echo    cd backend
echo    npm run dev
echo.
echo 4. Start Frontend Server:
echo    cd frontend
echo    npm run dev
echo.
echo 5. Open in Browser:
echo    http://localhost:3000
echo.
echo 📧 Demo Credentials:
echo    Email: sejal6249@gmail.com
echo    Password: password123
echo.
echo 📖 For detailed instructions, see QUICKSTART.md
echo.
pause
