#!/bin/bash

# Sky Coding Setup Script
# This script helps you quickly set up the development environment

echo "🚀 Sky Coding - Setup Script"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) is installed"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm --version) is installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local with your credentials:"
    echo "   - MONGO_URL: Your MongoDB connection string"
    echo "   - CLOUD_NAME: Your Cloudinary cloud name"
    echo "   - CLOUD_API_KEY: Your Cloudinary API key"
    echo "   - CLOUD_API_SECRET: Your Cloudinary API secret"
    echo ""
    echo "📖 Setup guides:"
    echo "   MongoDB: https://www.mongodb.com/cloud/atlas"
    echo "   Cloudinary: https://cloudinary.com/"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "=============================="
echo "✨ Setup Complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Edit .env.local with your MongoDB and Cloudinary credentials"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo "4. Admin panel: http://localhost:3000/admin"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Overview and quick start"
echo "   - SETUP_GUIDE.md - Detailed setup instructions"
echo "   - DEPLOYMENT.md - Deployment guides"
echo "   - FILE_MANIFEST.md - Complete file structure"
echo ""
echo "Happy coding! 🎉"
