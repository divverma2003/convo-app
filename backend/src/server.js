import "../instrument.mjs";
import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import * as Sentry from "@sentry/node";

import { inngest, functions } from "./config/inngest.js";
import chatRoutes from "./routes/chat.route.js";

const app = express();

app.use(express.json()); // for parsing application/json -->CLIENT_URLapp.use(clerkMiddleware()); // req.auth will be available in the request object

// Route handlers
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
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
