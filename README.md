# Convo App

A modern, full-stack real-time chat application built with the MERN stack, featuring instant messaging, user authentication, and cloud deployment.

Link to site: https://convo-app-frontend-kappa.vercel.app

## Features

- **Real-time Messaging**: Instant chat powered by Stream Chat API
- **User Authentication**: Secure OAuth authentication via Clerk
- **Direct Messages**: One-on-one conversations with any user
- **Channel Management**: Create public/private channels with custom members
- **Infinite Scroll**: Paginated user lists and message history
- **Search & Discovery**: Find users and channels with debounced search
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Error Monitoring**: Production error tracking with Sentry
- **Background Jobs**: Automated user sync via Inngest webhooks

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library with latest features
- **Vite** - Lightning-fast build tool
- **Stream Chat React** - Pre-built chat components
- **TanStack Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon library

### Backend

- **Node.js + Express** - Server framework
- **MongoDB + Mongoose** - Database and ODM
- **Clerk** - Authentication and user management
- **Stream Chat** - Real-time messaging infrastructure
- **Inngest** - Background job processing
- **Sentry** - Error monitoring and logging

### Deployment

- **Vercel** - Frontend and backend hosting
- **MongoDB Atlas** - Cloud database
- **Inngest Cloud** - Webhook processing

## Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB database (local or Atlas)
- Accounts for: Clerk, Stream, Inngest, Sentry (optional)

## Environment Variables

### Backend `.env`

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stream Chat
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=signkey-...

# Sentry (Optional)
SENTRY_DSN=your_sentry_dsn
```

### Frontend `.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STREAM_API_KEY=your_stream_api_key
```

## Installation

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:5001`.

## Key Features Explained

### Authentication Flow

1. User signs in via Clerk (OAuth or email)
2. Clerk webhook triggers Inngest function
3. User data syncs to MongoDB
4. Stream Chat token generated for messaging

### Real-time Messaging

- Direct messages use sorted user IDs as channel IDs
- Channels support public/private visibility
- Unread counts tracked per conversation
- Message history with infinite scroll

### User Discovery

- Paginated user lists (25 per page)
- Debounced search (500ms delay)
- Filter out system users (recording bots)
- Keyboard search with real-time results

## Deployment

### Backend (Vercel)

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy from `backend` directory
4. Configure Inngest webhook URL

### Frontend (Vercel)

1. Connect GitHub repository
2. Set environment variables
3. Deploy from `frontend` directory
4. Update Clerk allowed origins

## Troubleshooting

### Common Issues

**MongoDB Connection Error**

- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

**Clerk Authentication Failed**

- Confirm publishable/secret keys match
- Check allowed origins in Clerk dashboard
- Verify webhook endpoint is accessible

**Stream Chat Issues**

- Validate API key and secret
- Check user token generation
- Ensure channel permissions are correct

**Inngest Functions Not Triggering**

- Verify webhook URL in Clerk dashboard
- Check signing key matches
- Review Inngest function logs

## Security

- Environment variables never committed
- Clerk handles password hashing
- Stream tokens expire automatically
- CORS configured for production domains
- Input validation on all forms
