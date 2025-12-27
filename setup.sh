#!/bin/bash

# Keewacker Setup Script

echo "🎬 Setting up Keewacker..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local from template..."
  cp .env.local.example .env.local
  echo "✅ .env.local created"
  echo ""
  echo "⚠️  IMPORTANT: Edit .env.local and add your OMDb API key"
  echo "   Get your free key at: https://www.omdbapi.com/apikey.aspx"
  echo ""
else
  echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Edit .env.local and add your OMDB_API_KEY"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo ""
echo "🎥 Example URLs:"
echo "   Movie: http://localhost:3000/watch/movie/tt6263850"
echo "   TV:    http://localhost:3000/watch/tv/tt0944947?season=1&episode=1"
echo ""
