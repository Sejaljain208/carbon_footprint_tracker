#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           CarbonLens - Quick Start Setup                   ║"
echo "║     AI-Powered Carbon Footprint Tracker                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "📋 Prerequisites Check:"
echo "================================"

if ! command -v node &> /dev/null; then
    echo "✗ Node.js is NOT installed"
    echo "  Download from: https://nodejs.org/"
    exit 1
else
    echo "✓ Node.js is installed"
    node --version
fi

if ! command -v npm &> /dev/null; then
    echo "✗ npm is NOT installed"
    exit 1
else
    echo "✓ npm is installed"
    npm --version
fi

echo ""
echo "🚀 Starting Setup:"
echo "================================"

echo ""
echo "1️⃣  Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed."
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your MongoDB URI"
    echo "   Default MONGODB_URI=mongodb://localhost:27017/carbonlens"
fi

echo "Seeding database with demo data..."
node seed.js

cd ..

echo "✓ Backend setup complete!"

echo ""
echo "2️⃣  Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed."
fi

cd ..

echo "✓ Frontend setup complete!"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              Setup Complete! 🎉                           ║"
echo "╚════════════════════════════════════════════════════════════╝"

echo ""
echo "📝 Next Steps:"
echo "================================"
echo ""
echo "1. Start Ollama (in a terminal):"
echo "   ollama serve"
echo "   ollama pull llama2"
echo ""
echo "2. Start MongoDB (if using local):"
echo "   mongod"
echo ""
echo "3. Start Backend Server:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4. Start Frontend Server:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "5. Open in Browser:"
echo "   http://localhost:3000"
echo ""
echo "📧 Demo Credentials:"
echo "   Email: sejal6249@gmail.com"
echo "   Password: password123"
echo ""
echo "📖 For detailed instructions, see QUICKSTART.md"
echo ""
