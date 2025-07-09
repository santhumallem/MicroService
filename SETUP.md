# 🚀 Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v13 or higher) - [Download](https://postgresql.org/download/)
- **Docker** (optional but recommended) - [Download](https://docker.com/get-started)
- **Cursor.ai** - [Download](https://cursor.ai/)

## 📋 Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cursor-ai-example
   ```

2. **Start the database**
   ```bash
   cd docker
   docker-compose up -d postgres
   ```

3. **Setup Backend**
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm start
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api/docs

### Option 2: Manual Setup

#### 1. Database Setup

**Create PostgreSQL Database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE cursor_ai_example;
CREATE USER cursor_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE cursor_ai_example TO cursor_user;
```

**Initialize Schema:**
```bash
psql -U cursor_user -d cursor_ai_example -f database/init.sql
```

#### 2. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
# Use your preferred editor or:
nano .env

# Install dependencies
npm install

# Start the server
npm run dev
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cursor_ai_example
DB_USER=cursor_user
DB_PASSWORD=password123

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Configuration

The frontend automatically proxies API requests to the backend. No additional configuration needed for development.

## 🧪 Testing the Application

### 1. Test API Endpoints

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Register User:**
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "confirmPassword": "SecurePassword123!"
  }'
```

**Login User:**
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

### 2. Test Frontend

1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill out the registration form
4. Submit and verify the response
5. Try logging in with the created account

## 🐳 Docker Setup (Alternative)

### Full Stack with Docker

1. **Start all services:**
   ```bash
   cd docker
   docker-compose up -d
   ```

2. **Services will be available at:**
   - PostgreSQL: localhost:5432
   - pgAdmin: http://localhost:5050
   - Redis: localhost:6379

3. **Run backend and frontend manually** (as they're not containerized in this example)

### Database Only with Docker

```bash
cd docker
docker-compose up -d postgres pgadmin
```

Access pgAdmin at http://localhost:5050:
- Email: admin@example.com
- Password: admin123

## 📁 Project Structure

```
cursor-ai-example/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── .env.example        # Environment template
│   ├── package.json        # Dependencies
│   └── server.js           # Entry point
├── frontend/               # React application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── App.js          # Main component
│   │   └── index.js        # Entry point
│   ├── package.json        # Dependencies
│   └── tailwind.config.js  # Styling configuration
├── database/               # Database schemas
│   └── init.sql            # Initial schema
├── docker/                 # Docker configuration
│   └── docker-compose.yml  # Services definition
├── docs/                   # Documentation
│   └── CURSOR_AI_GUIDE.md  # Cursor.ai learning guide
└── README.md               # Project overview
```

## 🚨 Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Ensure PostgreSQL is running and credentials are correct.

**2. Port Already in Use**
```
Error: listen EADDRINUSE :::3000
```
**Solution:** Kill the process using the port or use a different port.

**3. Module Not Found**
```
Error: Cannot find module 'express'
```
**Solution:** Run `npm install` in the appropriate directory.

**4. CORS Error**
```
Access to fetch blocked by CORS policy
```
**Solution:** Ensure FRONTEND_URL is correctly set in backend .env file.

### Debug Mode

**Backend Debug:**
```bash
cd backend
DEBUG=* npm run dev
```

**Frontend Debug:**
Open browser developer tools (F12) and check Console/Network tabs.

## 🔄 Development Workflow

### 1. Making Changes

**Backend Changes:**
- Server auto-restarts with nodemon
- Check console for errors

**Frontend Changes:**
- Hot reload is enabled
- Check browser console for errors

### 2. Adding Features

Use Cursor.ai to:
1. Generate new components
2. Add API endpoints
3. Update database schema
4. Create tests

Example prompts:
- "Add a forgot password feature"
- "Create user profile editing"
- "Implement email verification"

### 3. Database Migrations

When changing schema:
1. Update `database/init.sql`
2. Drop and recreate database for development
3. For production, create migration scripts

## 🚀 Production Deployment

### Environment Setup

1. **Set production environment variables**
2. **Use strong JWT secrets**
3. **Configure proper CORS origins**
4. **Set up SSL/TLS**
5. **Configure rate limiting**

### Database

1. **Use managed PostgreSQL service** (AWS RDS, Google Cloud SQL, etc.)
2. **Set up database backups**
3. **Configure connection pooling**

### Security Checklist

- [ ] Strong JWT secret
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] SQL injection protection
- [ ] XSS protection headers
- [ ] Database credentials secured

## 🆘 Getting Help

1. **Check the logs** - Backend and frontend console output
2. **Review documentation** - API docs at /api/docs
3. **Use Cursor.ai** - Ask for debugging help
4. **Check GitHub issues** - Common problems and solutions

## 🎉 Success!

If everything is working correctly, you should be able to:

- ✅ Register new users
- ✅ Login with credentials
- ✅ View user profile
- ✅ See authentication state
- ✅ Access protected routes

Congratulations! You now have a complete full-stack application built with Cursor.ai.