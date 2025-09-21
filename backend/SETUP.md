# Convo App - Backend Setup Guide

## Project Overview

Convo App is a full-stack chat application built with the MERN stack, featuring real-time messaging, user authentication, and cloud deployment.

### Tech Stack

- **Frontend**: React 19 + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Clerk
- **Real-time Chat**: Stream Chat API
- **Background Jobs**: Inngest
- **Error Monitoring**: Sentry
- **Deployment**: Vercel (Backend), Frontend deployment TBD

## Architecture Overview

### Inngest Integration

**INNGEST** connects Clerk authentication functions to our backend database (MongoDB) to create and delete users using OAuth methods. It handles communication between these clients during events. Inngest runs these functions in the background during authentication events to automatically manage user data synchronization.

### Deployment

The backend app is deployed to **Vercel** in production, which is also connected to **INNGEST** for seamless background job processing.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database (local or cloud)
- Clerk account for authentication
- Stream account for chat functionality
- Inngest account for background jobs
- Sentry account for error monitoring (optional)

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stream Chat
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Inngest Background Jobs
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Sentry Error Monitoring (Optional)
SENTRY_DSN=your_sentry_dsn
```

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see above)

4. Start the development server:

   ```bash
   npm run dev
   ```

5. For production:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

### Backend (`/backend`)

```
src/
├── config/          # Configuration files
│   ├── db.js        # MongoDB connection
│   ├── env.js       # Environment variables
│   ├── inngest.js   # Inngest configuration
│   └── sentry.js    # Sentry error monitoring
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
│   └── user.model.js
├── routes/          # API routes
└── server.js        # Main server file
```

### Frontend (`/frontend`)

```
src/
├── App.jsx          # Main App component
├── main.jsx         # Entry point
└── index.css        # Global styles
public/              # Static assets
```

## API Endpoints

- `GET /` - Health check endpoint
- `/api/inngest` - Inngest webhook endpoint for background jobs

## Dependencies

### Backend Dependencies

- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **@clerk/express**: Clerk authentication middleware
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **inngest**: Background job processing
- **stream-chat**: Stream chat server SDK
- **@sentry/node**: Error monitoring

### Frontend Dependencies

- **react**: UI library
- **react-dom**: React DOM rendering
- **@clerk/clerk-react**: Clerk authentication for React
- **vite**: Build tool and dev server

## Development Workflow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Database**: Ensure MongoDB is running and accessible
4. **Authentication**: Configure Clerk dashboard with your app settings
5. **Chat**: Set up Stream Chat dashboard and obtain API keys

## Deployment

### Backend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Frontend

- Configure frontend deployment platform
- Set up build process
- Configure environment variables for production

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure MONGODB_URI is correct and database is accessible
2. **Clerk Setup**: Verify publishable and secret keys are correct
3. **CORS Issues**: Check CORS configuration for frontend URL
4. **Environment Variables**: Ensure all required variables are set

### Development Tips

- Use `nodemon` for automatic server restarts during development
- Check browser console and server logs for errors
- Verify Inngest webhook configuration in dashboard
- Test authentication flow with Clerk dashboard

## Support

- Check official documentation for each service
- Review error logs in Sentry dashboard
- Monitor background jobs in Inngest dashboard
