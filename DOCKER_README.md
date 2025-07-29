# 🐳 Docker Setup Guide

Panduan lengkap untuk menjalankan Employee Leave Management System menggunakan Docker.

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

## 🚀 Quick Start

### 1. Clone & Setup
\`\`\`bash
git clone <repository-url>
cd employee-leave-management

# Setup dengan satu command
npm run docker:setup
\`\`\`

### 2. Manual Setup (Alternative)
\`\`\`bash
# Copy environment file
cp .env.docker .env.local

# Build dan start services
docker-compose up --build -d

# Check status
docker-compose ps
\`\`\`

## 🌐 Access Points

Setelah setup berhasil, Anda dapat mengakses:

- **🖥️ Main Application**: http://localhost:3000
- **🗄️ pgAdmin**: http://localhost:8080
- **📊 PostgreSQL**: localhost:5432

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Superadmin | superadmin@system.com | admin123 |
| Admin | admin1@teknologi.com | admin123 |
| Employee | john@teknologi.com | admin123 |

## 🛠️ Docker Commands

### Basic Operations
\`\`\`bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app
docker-compose logs -f postgres

# Restart specific service
docker-compose restart app

# Rebuild and restart
npm run docker:rebuild
\`\`\`

### Development Commands
\`\`\`bash
# Enter app container
docker-compose exec app sh

# Enter database container
docker-compose exec postgres psql -U leave_admin -d employee_leave_db

# View real-time logs
npm run docker:logs
\`\`\`

### Maintenance Commands
\`\`\`bash
# Complete cleanup (removes containers, images, volumes)
npm run docker:cleanup

# Remove only containers
docker-compose down

# Remove containers and volumes
docker-compose down -v
\`\`\`

## 📁 Project Structure

\`\`\`
employee-leave-management/
├── docker-compose.yml          # Main Docker Compose file
├── docker-compose.prod.yml     # Production configuration
├── Dockerfile                  # Production image
├── Dockerfile.dev             # Development image
├── .dockerignore              # Docker ignore file
├── .env.docker                # Docker environment variables
├── scripts/
│   ├── docker-setup.sh        # Setup script
│   ├── docker-cleanup.sh      # Cleanup script
│   ├── 01-create-tables.sql   # Database schema
│   └── 02-seed-data.sql       # Sample data
└── ...
\`\`\`

## 🔧 Configuration

### Environment Variables (.env.docker)
\`\`\`env
DATABASE_URL=postgresql://leave_admin:leave_password123@postgres:5432/employee_leave_db
JWT_SECRET=your-super-secret-jwt-key-for-docker-development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-for-docker
NODE_ENV=development
\`\`\`

### Database Configuration
- **Host**: postgres (internal) / localhost (external)
- **Port**: 5432
- **Database**: employee_leave_db
- **Username**: leave_admin
- **Password**: leave_password123

### pgAdmin Configuration
- **URL**: http://localhost:8080
- **Email**: admin@admin.com
- **Password**: admin123

## 🚀 Production Deployment

### Using Production Compose
\`\`\`bash
# Build for production
docker-compose -f docker-compose.prod.yml up --build -d

# With custom environment
cp .env.docker.prod .env.production
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
\`\`\`

### Environment Variables for Production
\`\`\`env
DATABASE_URL=postgresql://leave_admin:secure_password@postgres:5432/employee_leave_db
JWT_SECRET=your-super-secure-jwt-secret-key-for-production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secure-nextauth-secret-for-production
NODE_ENV=production
\`\`\`

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
\`\`\`bash
# Check what's using the port
lsof -i :3000
lsof -i :5432

# Kill the process or change ports in docker-compose.yml
\`\`\`

#### 2. Database Connection Failed
\`\`\`bash
# Check if PostgreSQL container is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
\`\`\`

#### 3. Permission Denied
\`\`\`bash
# Fix script permissions
chmod +x scripts/*.sh

# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
newgrp docker
\`\`\`

#### 4. Out of Disk Space
\`\`\`bash
# Clean up Docker resources
docker system prune -a

# Remove unused volumes
docker volume prune
\`\`\`

### Health Checks

\`\`\`bash
# Check container health
docker-compose ps

# Check application health
curl http://localhost:3000/api/health

# Check database connection
docker-compose exec postgres pg_isready -U leave_admin
\`\`\`

## 📊 Monitoring

### View Logs
\`\`\`bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 app
\`\`\`

### Resource Usage
\`\`\`bash
# Container stats
docker stats

# Disk usage
docker system df
\`\`\`

## 🔄 Updates & Maintenance

### Update Application
\`\`\`bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
\`\`\`

### Database Backup
\`\`\`bash
# Create backup
docker-compose exec postgres pg_dump -U leave_admin employee_leave_db > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U leave_admin employee_leave_db < backup.sql
\`\`\`

### Clean Installation
\`\`\`bash
# Complete cleanup and fresh install
npm run docker:cleanup
npm run docker:setup
\`\`\`

## 🆘 Support

Jika mengalami masalah:

1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Ensure ports are available
4. Check Docker and Docker Compose versions
5. Try clean installation: `npm run docker:cleanup && npm run docker:setup`

## 📝 Notes

- Data PostgreSQL disimpan dalam Docker volume `postgres_data`
- Upload files disimpan dalam folder `uploads/`
- Logs aplikasi dapat dilihat dengan `docker-compose logs -f app`
- Untuk development, gunakan `docker-compose.yml`
- Untuk production, gunakan `docker-compose.prod.yml`
