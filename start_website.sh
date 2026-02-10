#!/bin/bash
# Sishijian Website Startup Script
# Uses absolute paths to avoid "command not found" errors

# Define paths (detected from /opt/homebrew/bin)
NODE_BIN="/opt/homebrew/bin/node"
NPM_BIN="/opt/homebrew/bin/npm"

echo "🚀 Starting Sishijian Website..."
cd "$(dirname "$0")"

# 1. Kill any existing process on port 3000 (Cleanup)
echo "🧹 Cleaning up old processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null

# 2. Remove lock file if it exists
rm -rf .next/dev/lock

# Check if node exists
if [ ! -f "$NODE_BIN" ]; then
    echo "❌ Node.js not found at $NODE_BIN. Trying standard path..."
    NODE_BIN="node"
    NPM_BIN="npm"
fi

# 3. Clean install if needed (optional)
# echo "📦 Installing dependencies..."
# "$NPM_BIN" install

echo "✨ Starting Next.js Server..."
# Open browser automatically after 5 seconds
(sleep 5 && open "http://localhost:3000") &

"$NPM_BIN" run dev
