# Land Registration System

A comprehensive land registration and management system built with the MERN stack (MongoDB, Express.js, React, Node.js). This system allows farmers to register and manage their land parcels while providing government officials with analytics and oversight capabilities.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Development Guidelines](#development-guidelines)
- [License](#license)

## Features

### For Farmers
- User registration and authentication
- Land parcel registration and management
- Crop tracking and yield recording
- Water usage monitoring
- Sustainability score tracking
- Dashboard with analytics

### For Government Officials
- View all registered farmers and land parcels
- Analytics dashboard with regional sustainability metrics
- Soil type distribution analysis
- Policy management
- Reporting capabilities

## Technologies Used

### Frontend
- React 19
- React Router v7
- Tailwind CSS v4
- Vite 7
- Axios for API requests

### Backend
- Node.js
- Express.js v5
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Bcrypt.js for password hashing
- Dotenv for environment management

### Database
- MongoDB

### Development Tools
- pnpm for package management
- ESLint for code linting
- Nodemon for development server auto-restart

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- pnpm (v7 or higher)
- MongoDB (v4.4 or higher)

## Project Structure

```
land-registration-system/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML template
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── server.js           # Entry point
│   └── package.json        # Backend dependencies
└── README.md               # This file
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install backend dependencies:
   ```bash
   cd server
   pnpm install
   cd ..
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   pnpm install
   cd ..
   ```

## Environment Variables

### Backend (.env in server directory)
```env
# Server Environment Variables
PORT=5000
NODE_ENV=development

# Database configuration
MONGO_URI=mongodb://localhost:27017/greenlands-db

# JWT configuration
JWT_SECRET=land_registration_secret_key
JWT_EXPIRE=7d

# Email configuration (for notifications)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=

# Frontend URL
CLIENT_URL=https://ogollas-final-project.vercel.app/
```

### Frontend (.env in client directory)
```env
# Client Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Greenlands

# Development settings
NODE_ENV=development

# Feature flags
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_LAND_MANAGEMENT=true
```

## Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd server
   pnpm run dev
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd client
   pnpm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Production Mode

1. Build the frontend:
   ```bash
   cd client
   pnpm run build
   ```

2. Start the backend server:
   ```bash
   cd server
   pnpm start
   ```

3. The application will be available at `http://localhost:5000`

## Deployment

### Deploying to Render (Backend) and Vercel (Frontend)

#### 1. Set up MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Configure database access and network access
4. Get your connection string

#### 2. Deploy Backend to Render
1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the service:
   - Name: `greenlands-api`
   - Environment: `Node`
   - Build command: `npm install`
   - Start command: `npm start`
   - Root directory: `server`
   - Plan: Free

5. Set Environment Variables in Render:
   ```
   NODE_ENV=production
   PORT=8080
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret  # This is critical for JWT to work properly
   CLIENT_URL=https://your-vercel-app-url.vercel.app
   ```

#### 3. Deploy Frontend to Vercel
1. Create a new project on Vercel
2. Import your GitHub repository
3. Configure the project:
   - Framework: `Vite`
   - Root directory: `client`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

4. Set Environment Variables in Vercel:
   ```
   VITE_API_URL=https://your-render-app-url.onrender.com/api
   ```

#### 4. Update Environment Variables After Deployment
After your applications are deployed:

1. In Render, update the `CLIENT_URL` to match your Vercel frontend URL:
   ```
   CLIENT_URL=https://your-vercel-app-url.vercel.app
   ```

2. In Vercel, update the `VITE_API_URL` to match your Render backend URL:
   ```
   VITE_API_URL=https://your-render-app-url.onrender.com/api
   ```

#### 5. Important Notes for Deployment
- Make sure to use a strong, secure `JWT_SECRET` in your Render environment variables
- Ensure the `MONGO_URI` is correctly configured with your MongoDB Atlas connection string
- Verify that the `CLIENT_URL` in Render matches your Vercel frontend URL
- Make sure the `VITE_API_URL` in Vercel matches your Render backend URL

### Troubleshooting Common Deployment Issues

#### JWT Malformed Error
If you encounter a "JsonWebTokenError: jwt malformed" error:

1. Ensure the `JWT_SECRET` environment variable is set correctly in Render
2. Make sure you're using a strong, secure secret (not the default development secret)
3. Check that the token is being properly stored and retrieved in the client
4. Verify that CORS is properly configured

#### CORS Errors
If you encounter CORS errors:

1. Ensure the `CLIENT_URL` environment variable in Render matches your Vercel frontend URL
2. Check that the CORS configuration in `server.js` is correct

#### API Endpoints Not Found
If API endpoints return 404 errors:

1. Ensure the `VITE_API_URL` in Vercel matches your Render backend URL
2. Verify that your Render backend is running correctly

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Land Management (Farmer)
- `POST /api/land` - Create a new land parcel (protected)
- `GET /api/land` - Get all land parcels for a farmer (protected)
- `GET /api/land/:id` - Get a specific land parcel (protected)
- `PUT /api/land/:id` - Update a land parcel (protected)
- `DELETE /api/land/:id` - Delete a land parcel (protected)
- `POST /api/land/:id/crops` - Add crop to land parcel (protected)
- `POST /api/land/:id/water` - Add water usage record (protected)

### Government
- `GET /api/government/analytics` - Get analytics data (protected, government only)
- `GET /api/government/farmers` - Get all farmers (protected, government only)
- `GET /api/government/lands` - Get all land parcels (protected, government only)

## Development Guidelines

### Code Style
- Follow the existing code style in the project
- Use functional components in React
- Use async/await for asynchronous operations
- Write meaningful commit messages

### Branching Strategy
- Create feature branches from `main`
- Use descriptive branch names (e.g., `feature/user-authentication`)
- Create pull requests for code review

### Testing
- Write unit tests for critical functionality
- Test API endpoints with tools like Postman
- Ensure cross-browser compatibility

### Security
- Never commit sensitive information to the repository
- Use environment variables for configuration
- Validate and sanitize all user inputs
- Implement proper authentication and authorization

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support


For support, please contact the development team or open an issue in the repository.
