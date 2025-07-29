#!/bin/bash

echo "🐳 Setting up Employee Leave Management System with Docker"
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p uploads

# Copy environment file
if [ ! -f .env.docker ]; then
    echo "📝 Creating environment file..."
    cp .env.docker.example .env.docker 2>/dev/null || echo "⚠️  Please create .env.docker file manually"
fi

# Build and start services
echo "🚀 Building and starting services..."
docker-compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 15

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "✅ Setup completed!"
echo ""
echo "🌐 Application: http://localhost:3000"
echo "🗄️  pgAdmin: http://localhost:8080 (admin@admin.com / admin123)"
echo "📊 Database: localhost:5432"
echo ""
echo "👤 Demo Accounts:"
echo "   Superadmin: superadmin@system.com / admin123"
echo "   Admin: admin1@teknologi.com / admin123"
echo "   Employee: john@teknologi.com / admin123"
echo ""
echo "🛠️  Useful commands:"
echo "   docker-compose logs -f app    # View app logs"
echo "   docker-compose logs -f postgres # View database logs"
echo "   docker-compose down           # Stop all services"
echo "   docker-compose up -d          # Start services"
