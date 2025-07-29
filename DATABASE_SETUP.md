# Database Setup Guide

## Prerequisites

1. **PostgreSQL Installation**
   - Install PostgreSQL on your local machine
   - Make sure PostgreSQL service is running
   - Default port: 5432

2. **Create Database**
   \`\`\`sql
   -- Connect to PostgreSQL as superuser
   psql -U postgres
   
   -- Create database
   CREATE DATABASE employee_leave_db;
   
   -- Create user (optional)
   CREATE USER leave_admin WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE employee_leave_db TO leave_admin;
   
   -- Exit psql
   \q
   \`\`\`

## Configuration Steps

### 1. Environment Variables
Create `.env.local` file in your project root:

\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/employee_leave_db"
JWT_SECRET="your-super-secret-jwt-key-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
\`\`\`

**Replace the following:**
- `username`: Your PostgreSQL username
- `password`: Your PostgreSQL password  
- `employee_leave_db`: Your database name

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Database
\`\`\`bash
# Create tables and insert sample data
npm run db:setup
\`\`\`

### 4. Alternative: Manual Setup
If the script doesn't work, you can run SQL files manually:

\`\`\`bash
# Connect to your database
psql -U your_username -d employee_leave_db

# Run the SQL files
\i scripts/01-create-tables.sql
\i scripts/02-seed-data.sql

# Exit
\q
\`\`\`

## Database Scripts

- `npm run db:setup` - Create tables and insert sample data
- `npm run db:reset` - Drop all tables (destructive!)
- `npm run db:seed` - Insert sample data only

## Sample Login Credentials

After running the setup, you can use these accounts:

### Superadmin
- **Email**: superadmin@system.com
- **Password**: admin123

### Admin (PT Teknologi Maju)
- **Email**: admin1@teknologi.com
- **Password**: admin123

### Employee (PT Teknologi Maju)
- **Email**: john@teknologi.com
- **Password**: admin123

## Troubleshooting

### Connection Issues
1. **Check PostgreSQL is running**:
   \`\`\`bash
   # On macOS with Homebrew
   brew services start postgresql
   
   # On Ubuntu/Debian
   sudo systemctl start postgresql
   
   # On Windows
   # Start PostgreSQL service from Services panel
   \`\`\`

2. **Verify connection**:
   \`\`\`bash
   psql -U your_username -d employee_leave_db -c "SELECT version();"
   \`\`\`

3. **Check firewall/port**:
   - Ensure port 5432 is not blocked
   - Check `postgresql.conf` for `listen_addresses`
   - Check `pg_hba.conf` for authentication settings

### Permission Issues
\`\`\`sql
-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;
\`\`\`

### Password Issues
\`\`\`sql
-- Reset user password
ALTER USER your_username WITH PASSWORD 'new_password';
\`\`\`

## Database Schema Overview

### Main Tables
- `lembaga` - Organizations/Companies
- `users` - All system users (superadmin, admin, employees)
- `jenis_cuti` - Leave types configuration
- `cuti` - Leave applications
- `cuti_kuota` - Leave quotas per user
- `cuti_approval_flow` - Approval workflow configuration
- `cuti_approval_log` - Approval process tracking
- `notifications` - System notifications

### Key Features
- Multi-organization support
- Role-based access control
- Hierarchical approval workflow
- Leave quota management
- Real-time notifications
- Audit trail for all approvals
