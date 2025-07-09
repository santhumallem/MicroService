# Cursor.ai Learning Example: Full-Stack User Registration System

This project demonstrates how to use Cursor.ai to build a complete full-stack application with:
- **Frontend**: React sign-up form with modern UI (matches the provided design)
- **Backend API**: Node.js/Express REST API with authentication
- **Database**: PostgreSQL with proper DDL and relationships
- **Full Integration**: End-to-end user registration system

## ✨ Live Demo Features

🎨 **Beautiful Sign-up Form** - Matches your provided design with:
- Input validation and error handling
- Password visibility toggle
- Google Sign-up integration (placeholder)
- Responsive design with animations

� **Secure Backend API** - Complete authentication system:
- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting and security headers
- Comprehensive input validation

🗄️ **Robust Database Design** - PostgreSQL schema with:
- User management tables
- Session tracking
- Email verification system
- Audit logging

## �🚀 Quick Start

### Using Docker (Recommended)
```bash
# 1. Start the database
cd docker && docker-compose up -d postgres

# 2. Start the backend
cd backend && npm install && npm start

# 3. Start the frontend
cd frontend && npm install && npm start

# 4. Open http://localhost:3000
```

### Manual Setup
See [SETUP.md](SETUP.md) for detailed instructions.

## 📖 Learning Path with Cursor.ai

### 1. **Database Design (DDL)**
- PostgreSQL schema with relationships
- Indexes and performance optimization
- Triggers and data integrity

### 2. **Backend API Development**
- Express.js with middleware
- JWT authentication system
- Input validation with Joi
- Error handling and logging

### 3. **Frontend Development**
- React with hooks and modern patterns
- Form validation with React Hook Form
- Beautiful UI with Tailwind CSS
- State management and API integration

### 4. **Full Integration**
- Frontend-backend communication
- Authentication flow
- Error handling and user feedback

## 🎯 What You'll Learn

- **Cursor.ai Mastery**: AI-assisted development techniques
- **Full-Stack Development**: Complete application architecture
- **Modern Best Practices**: Security, validation, and performance
- **Rapid Prototyping**: From idea to working application
- **Production Readiness**: Deployment and scaling considerations

## 📁 Project Structure

```
cursor-ai-example/
├── 📱 frontend/              # React Application
│   ├── src/
│   │   ├── components/       # SignUpForm, LoginForm
│   │   ├── services/         # API integration
│   │   └── App.js           # Main application
│   └── package.json
├── 🔧 backend/               # Node.js/Express API
│   ├── config/              # Database configuration
│   ├── middleware/          # Authentication & validation
│   ├── routes/              # API endpoints
│   ├── services/            # Business logic
│   └── server.js            # Express server
├── 🗄️ database/              # PostgreSQL Schema
│   └── init.sql             # Database initialization
├── 🐳 docker/                # Development Environment
│   └── docker-compose.yml   # PostgreSQL, pgAdmin, Redis
└── 📚 docs/                  # Documentation
    └── CURSOR_AI_GUIDE.md   # Complete Cursor.ai guide
```

## � Technology Stack

**Frontend:**
- React 18 with Hooks
- Tailwind CSS for styling
- React Hook Form + Yup validation
- Axios for API communication
- Lucide React icons

**Backend:**
- Node.js with Express.js
- JWT authentication
- Joi validation
- bcryptjs password hashing
- PostgreSQL with pg driver
- Helmet for security

**Database:**
- PostgreSQL 15
- Proper relationships and indexes
- Audit logging
- Email verification system

**DevOps:**
- Docker for development
- Environment-based configuration
- Hot reload for development

## 🎨 Key Features

### User Registration System
- ✅ Complete sign-up form with validation
- ✅ Secure password requirements
- ✅ Email verification system
- ✅ User session management
- ✅ Profile management

### Security Features
- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Security headers

### Developer Experience
- ✅ Hot reload development
- ✅ Comprehensive error handling
- ✅ API documentation
- ✅ Docker development environment
- ✅ Detailed logging

## 📚 Documentation

- **[Setup Guide](SETUP.md)** - Complete installation and configuration
- **[Cursor.ai Guide](docs/CURSOR_AI_GUIDE.md)** - Learn AI-assisted development
- **API Documentation** - Available at `/api/docs` when running

## 🚦 Getting Started

1. **Prerequisites**: Node.js 18+, PostgreSQL, Cursor.ai
2. **Clone**: Download this repository
3. **Setup**: Follow [SETUP.md](SETUP.md) instructions
4. **Learn**: Read [docs/CURSOR_AI_GUIDE.md](docs/CURSOR_AI_GUIDE.md)
5. **Develop**: Start building with Cursor.ai!

## 🎓 Learning Outcomes

After completing this example, you'll be able to:
- ✅ Use Cursor.ai for rapid full-stack development
- ✅ Build secure authentication systems
- ✅ Design robust database schemas
- ✅ Create modern React applications
- ✅ Deploy full-stack applications

## 🤝 Contributing

This is a learning project! Feel free to:
- Extend features using Cursor.ai
- Add new components and functionality
- Improve documentation
- Share your Cursor.ai discoveries

## 📄 License

This project is for educational purposes. Feel free to use it as a starting point for your own applications.

---

**Happy coding with Cursor.ai! 🚀**