# Carpool Backend API 🚗

A comprehensive full-stack carpool platform with React frontend and Node.js backend, ready for production deployment on Render.com!

## 🌟 Features

- **🔐 User Authentication**: JWT-based authentication with secure registration and login
- **🚗 Driver Management**: Driver registration with vehicle information and document uploads
- **💳 Payment Integration**: Paystack payment processing for ride bookings
- **📍 Geolocation Services**: Google Maps integration for geocoding and directions
- **🎯 Ride Management**: Create, search, and book rides with real-time updates
- **⚡ Real-time Communication**: Socket.IO for live location tracking and notifications
- **🎨 Modern Frontend**: React with Vite, TypeScript, and Tailwind CSS
- **🚀 Production Ready**: Configured for deployment on Render.com, Heroku, and Railway

## 🛠 Tech Stack

### Backend
- **Framework**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Paystack API
- **Maps**: Google Maps API
- **File Upload**: Multer with Cloudinary
- **Real-time**: Socket.IO
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios

## 🚀 Quick Start

### Option 1: Demo Mode (No Setup Required)
```bash
# Clone the repository
git clone https://github.com/hosvile3031/carpool-backend1.git
cd carpool-backend1

# Install dependencies
npm install

# Start demo server (works without database)
npm run demo
```

### Option 2: Full Development Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your credentials
# Start development server
npm run dev
```

## 📚 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | User login | ❌ |
| GET | `/profile` | Get user profile | ✅ |

### Rides (`/api/rides`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get available rides | ✅ |
| POST | `/` | Create new ride | ✅ |
| PUT | `/:id/book` | Book a ride | ✅ |

### Payments (`/api/payments`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/initialize` | Initialize payment | ✅ |
| GET | `/verify/:ref` | Verify payment | ✅ |

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (3000) |
| `NODE_ENV` | Environment | No (development) |
| `MONGODB_URI` | MongoDB connection | Yes* |
| `JWT_SECRET` | JWT signing secret | Yes* |
| `PAYSTACK_SECRET_KEY` | Paystack secret | Yes* |
| `GOOGLE_MAPS_API_KEY` | Google Maps API | Yes* |

*Not required for demo mode

## 🌐 Live Demo

Check out the live demo: [Your Render URL Here]

## 📱 Testing

### Health Check
```bash
curl https://your-app.onrender.com/health
```

### API Documentation
```bash
curl https://your-app.onrender.com/api
```

## 🚀 Deployment

### Render.com (Recommended)
1. Fork this repository
2. Connect to Render.com
3. Deploy with these settings:
   - **Build Command**: `npm ci && cd frontend && npm ci && npm run build`
   - **Start Command**: `npm run demo`
   - **Environment**: `NODE_ENV=production`

### Other Platforms
- **Heroku**: Uses `Procfile`
- **Railway**: Auto-detects settings
- **Vercel**: Configure for Node.js

## 📁 Project Structure

```
carpool-backend1/
├── 📁 frontend/          # React frontend
│   ├── 📁 src/           # React components
│   ├── 📁 dist/          # Built frontend
│   └── 📄 package.json   # Frontend dependencies
├── 📁 routes/            # API routes
├── 📁 models/            # Database models
├── 📁 middleware/        # Custom middleware
├── 📁 services/          # Business logic
├── 📄 server.js          # Main server (production)
├── 📄 demo-server.js     # Demo server (no DB required)
├── 📄 render.yaml        # Render.com config
└── 📄 package.json       # Backend dependencies
```

## 📋 Scripts

```bash
npm start          # Production server
npm run dev        # Development with nodemon
npm run demo       # Demo mode (no database)
npm run build      # Build frontend
npm test           # Run tests
```

## 🔒 Security Features

- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation
- ✅ File upload restrictions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🎉 What's Next?

- [ ] Set up MongoDB Atlas
- [ ] Configure Paystack payments
- [ ] Add Google Maps integration
- [ ] Deploy to production
- [ ] Add push notifications
- [ ] Implement ride tracking

---

**Ready to deploy? Follow the [Render Deployment Guide](./RENDER_DEPLOYMENT.md)** 🚀
