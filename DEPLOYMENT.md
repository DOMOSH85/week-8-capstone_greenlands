# Greenlands Deployment Guide

This guide provides step-by-step instructions for deploying the Greenlands application with a React frontend on Vercel, a Node.js backend on Render, and MongoDB Atlas as the database.

## Prerequisites

1. GitHub account
2. MongoDB Atlas account
3. Render account
4. Vercel account

## 1. Set up MongoDB Atlas

### Step 1: Create a MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account or log in if you already have one

### Step 2: Create a New Cluster
1. Click "Build a Cluster"
2. Select the free tier (M0 Sandbox)
3. Choose a cloud provider and region closest to your users
4. Click "Create Cluster"

### Step 3: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a new user with:
   - Username: `greenlands_user`
   - Password: Choose a secure password
   - Privileges: "Atlas Admin"
4. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, you can add your current IP or allow access from anywhere (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string and replace `<password>` with your actual password
4. Example: `mongodb+srv://greenlands_user:your_password@cluster0.xxxxx.mongodb.net/greenlands-db?retryWrites=true&w=majority`

## 2. Deploy Backend to Render

### Step 1: Push Code to GitHub
1. Create a new GitHub repository for your project
2. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/greenlands.git
   git push -u origin main
   ```

### Step 2: Create Render Account
1. Go to [Render](https://render.com/) and sign up/sign in

### Step 3: Deploy Backend Service
1. Click "New Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - Name: `greenlands-api`
   - Environment: `Node`
   - Build command: `npm install`
   - Start command: `npm start`
   - Root directory: `server`
   - Plan: Free

### Step 4: Set Environment Variables
In the Render dashboard, go to your service settings and add these environment variables:
```
NODE_ENV=production
PORT=8080
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=https://your-vercel-app-url.vercel.app
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will automatically deploy your backend
3. Note the URL of your deployed backend (e.g., `https://greenlands-api.onrender.com`)

## 3. Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [Vercel](https://vercel.com/) and sign up/sign in

### Step 2: Deploy Frontend
1. Click "New Project"
2. Import your GitHub repository
3. Configure the project:
   - Framework: `Vite`
   - Root directory: `client`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

### Step 3: Set Environment Variables
In the Vercel dashboard, go to your project settings and add these environment variables:
```
VITE_API_URL=https://your-render-app-url.onrender.com/api
```

### Step 4: Deploy
1. Click "Deploy"
2. Vercel will automatically build and deploy your frontend
3. Note the URL of your deployed frontend (e.g., `https://greenlands.vercel.app`)

## 4. Update Environment Variables

### Backend (Render)
Update the `CLIENT_URL` environment variable in Render to match your Vercel frontend URL:
```
CLIENT_URL=https://greenlands.vercel.app
```

### Frontend (Vercel)
Update the `VITE_API_URL` environment variable in Vercel to match your Render backend URL:
```
VITE_API_URL=https://greenlands-api.onrender.com/api
```

## 5. Test the Integration

1. Visit your frontend URL
2. Try registering a new user
3. Log in with the new user
4. Test CRUD operations for land management
5. Verify government analytics work correctly

## 6. Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CLIENT_URL` in Render matches your Vercel frontend URL
2. **Database Connection Errors**: Verify your MongoDB Atlas connection string and network access
3. **Environment Variables Not Set**: Check that all required environment variables are set in both Render and Vercel
4. **API Endpoints Not Found**: Ensure the `VITE_API_URL` in Vercel matches your Render backend URL

### Logs and Debugging

1. Check Render logs for backend errors:
   - Go to your Render dashboard
   - Click on your service
   - View logs in the "Logs" tab

2. Check Vercel logs for frontend errors:
   - Go to your Vercel dashboard
   - Click on your project
   - View logs in the "Functions" tab

## 7. Scaling Considerations

### MongoDB Atlas
- For production, consider upgrading from the free tier to a paid tier for better performance and reliability

### Render
- Consider upgrading from the free tier to a paid tier for better performance and no sleep mode

### Vercel
- The free tier is usually sufficient for small to medium applications

## 8. Security Considerations

1. Use strong, unique passwords for all services
2. Never commit sensitive information to version control
3. Regularly rotate your JWT secret and database passwords
4. Use HTTPS in production (both Render and Vercel provide this by default)
5. Implement proper input validation and sanitization
6. Consider adding rate limiting to your API endpoints

## 9. Monitoring and Maintenance

1. Set up monitoring for your MongoDB Atlas cluster
2. Monitor Render service uptime and performance
3. Monitor Vercel frontend performance
4. Regularly update dependencies to patch security vulnerabilities
5. Implement proper error logging and monitoring

## 10. Conclusion

Your Greenlands application should now be successfully deployed with:
- Frontend on Vercel
- Backend on Render
- Database on MongoDB Atlas

Remember to test all functionality thoroughly and monitor your application for any issues.