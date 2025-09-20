import * as Sentry from "@sentry/node";
import { ENV } from "./env.js";

Sentry.init({
  dsn: ENV.SENTRY_DSN,
  sendDefaultPii: true,
});
