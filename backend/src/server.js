import "../instrument.mjs";
import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import * as Sentry from "@sentry/node";
import cors from "cors";

import { inngest, functions } from "./config/inngest.js";
import chatRoutes from "./routes/chat.route.js";

const app = express();

// Configure CORS to allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://convo-app-frontend-kappa.vercel.app",
  ENV.CLIENT_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);
app.use(express.json()); // for parsing application/json
app.use(clerkMiddleware()); // req.auth will be available in the request object

// Route handlers
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);

// Test route
if (ENV.NODE_ENV !== "production") {
  app.get("/debug-sentry", (req, res) => {
    throw new Error("My first Sentry error!");
  });
}

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

Sentry.setupExpressErrorHandler(app);

const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log(`Server is running on http://localhost:${ENV.PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
