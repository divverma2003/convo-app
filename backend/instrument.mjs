import * as Sentry from "@sentry/node";
import { ENV } from "./src/config/env.js";

Sentry.init({
  dsn: ENV.SENTRY_DSN,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: ENV.NODE_ENV || "development",
  includeLocalVariables: true,

  // Setting this option to true will send default PII (Personally Identifiable Information) such as
  // user email addresses, IP addresses, etc. to Sentry. Be cautious when enabling this in production
  sendDefaultPii: true,
});
