# MySQL Setup Guide

## Prerequisites

1. **MySQL Installation**
   - Install MySQL Server on your local machine
   - Make sure MySQL service is running
   - Default port: 3306

## Configuration Steps

### 1. Create Database
\`\`\`sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE employee_leave_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'leave_admin'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON employee_leave_db.* TO 'leave_admin'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
\`\`\`

### 2. Environment Variables
Create `.env.local` file in your project root:

\`\`\`env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_leave_db

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Environment
NODE_ENV=development
\`\`\`

**Replace the following:**
- `DB_USER`: Your MySQL username (default: root)
- `DB_PASSWORD`: Your MySQL password
- `DB_NAME`: Your database name (default: employee_leave_db)

### 3. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 4. Setup Database
\`\`\`bash
# Create tables and insert sample data
npm run db:setup
\`\`\`

### 5. Alternative: Manual Setup
If the script doesn't work, you can run SQL files manually:

\`\`\`bash
# Connect to your database
mysql -u root -p employee_leave_db

# Run the SQL files
source scripts/01-create-tables.sql;
source scripts/02-seed-data.sql;

# Exit
EXIT;
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

## Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit: http://localhost:3000

## Troubleshooting

### Connection Issues
1. **Check MySQL is running**:
   \`\`\`bash
   # On macOS with Homebrew
   brew services start mysql
   
   # On Ubuntu/Debian
   sudo systemctl start mysql
   
   # On Windows
   # Start MySQL service from Services panel
   \`\`\`

2. **Verify connection**:
   \`\`\`bash
   mysql -u root -p -e "SELECT VERSION();"
   \`\`\`

3. **Check firewall/port**:
   - Ensure port 3306 is not blocked
   - Check MySQL configuration file (my.cnf or my.ini)
   - Verify bind-address setting

### Permission Issues
\`\`\`sql
-- Grant necessary permissions
GRANT ALL PRIVILEGES ON employee_leave_db.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

### Password Issues
\`\`\`sql
-- Reset user password
ALTER USER 'your_username'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
\`\`\`

### Common Error Messages

**Error: "Access denied for user"**
- Check username and password in .env.local
- Verify user exists and has proper permissions

**Error: "Unknown database"**
- Make sure database exists: `CREATE DATABASE employee_leave_db;`
- Check database name in .env.local

**Error: "Connection refused"**
- MySQL service is not running
- Check port number (default: 3306)

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

## Development Commands

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
\`\`\`

## Production Deployment

For production deployment, make sure to:

1. Use strong passwords for database users
2. Set secure JWT secrets
3. Configure proper SSL certificates
4. Set up database backups
5. Monitor database performance
6. Use environment-specific configuration files

## Support

If you encounter any issues:

1. Check MySQL error logs
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check database permissions
5. Try clean installation: `npm run db:reset && npm run db:setup`
