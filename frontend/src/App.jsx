import * as Sentry from "@sentry/react";
import { Navigate, Route, Routes } from "react-router";
const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

import { useAuth } from "@clerk/clerk-react";
import AuthPage from "./pages/AuthPage";
import CallPage from "./pages/CallPage";
import HomePage from "./pages/HomePage";
const App = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for Clerk to load before rendering
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SentryRoutes>
        <Route
          path="/"
          element={
            isSignedIn ? <HomePage /> : <Navigate to={"/auth"} replace />
          }
        />
        <Route
          path="/auth"
          element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}
        />
        {/*TODO: add call page */}
        <Route
          path="/call/:id"
          element={
            isSignedIn ? <CallPage /> : <Navigate to={"/auth"} replace />
          }
        />

        <Route
          path="*"
          element={
            isSignedIn ? (
              <Navigate to={"/"} replace />
            ) : (
              <Navigate to={"/auth"} replace />
            )
          }
        />
      </SentryRoutes>
    </div>
  );
};

export default App;
