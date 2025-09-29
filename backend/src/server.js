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

app.use(
  cors({
    origin: ENV.CORS_ORIGIN || `http://localhost:5173`,
    credentials: true, // Allow cookies and authentication headers (from Clerk)
  })
); // Enable CORS for requests from the frontend
app.use(express.json()); // for parsing application/json --> req.body
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
