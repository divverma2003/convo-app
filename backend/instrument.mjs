import * as Sentry from "@sentry/node";
import { ENV } from "./src/config/env.js";

if (!ENV.SENTRY_DSN) {
  console.warn(
    "[Sentry] SENTRY_DSN is not set. Skipping Sentry initialization."
  );
} else {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    tracesSampleRate: ENV.NODE_ENV === "production" ? 0.1 : 1.0,
    profilesSampleRate: ENV.NODE_ENV === "production" ? 0.05 : 1.0,
    environment: ENV.NODE_ENV || "development",
    includeLocalVariables: true,

    // Setting this option to true will send default PII (Personally Identifiable Information) such as
    // user email addresses, IP addresses, etc. to Sentry. Be cautious when enabling this in production
    sendDefaultPii: true,
  });
}
