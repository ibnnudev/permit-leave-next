#!/bin/bash

# Script to check PostgreSQL connection
echo "🔍 Checking PostgreSQL connection..."

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Extract connection details from DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found in .env.local"
    exit 1
fi

echo "📡 Testing connection to PostgreSQL..."

# Test connection using psql
psql "$DATABASE_URL" -c "SELECT version();" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL connection successful!"
    
    # Check if tables exist
    echo "📋 Checking if tables exist..."
    TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
    
    if [ "$TABLE_COUNT" -gt 0 ]; then
        echo "✅ Found $TABLE_COUNT tables in database"
        
        # Show table list
        echo "📊 Tables in database:"
        psql "$DATABASE_URL" -c "\dt" 2>/dev/null
    else
        echo "⚠️  No tables found. Run 'npm run db:setup' to create tables."
    fi
else
    echo "❌ Failed to connect to PostgreSQL"
    echo "💡 Please check:"
    echo "   - PostgreSQL is running"
    echo "   - DATABASE_URL is correct in .env.local"
    echo "   - Database exists"
    echo "   - User has proper permissions"
    exit 1
fi
