#!/bin/bash

echo "🧹 Cleaning up Docker containers and volumes..."
echo "=============================================="

# Stop all containers
echo "🛑 Stopping containers..."
docker-compose down

# Remove containers, networks, and images
echo "🗑️  Removing containers, networks, and images..."
docker-compose down --rmi all --volumes --remove-orphans

# Remove unused Docker resources
echo "🧽 Cleaning up unused Docker resources..."
docker system prune -f

# Remove specific volumes (optional - uncomment if needed)
# echo "💾 Removing persistent volumes..."
# docker volume rm employee-leave-management_postgres_data
# docker volume rm employee-leave-management_pgadmin_data

echo "✅ Cleanup completed!"
