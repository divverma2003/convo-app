import * as Sentry from "@sentry/react";
import { Navigate, Route, Routes } from "react-router";
const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

import { useAuth } from "@clerk/clerk-react";
import AuthPage from "./pages/AuthPage";
import CallPage from "./pages/CallPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PageLoader from "./components/PageLoader";
import Footer from "./components/Footer";
const App = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for Clerk to load before rendering
  if (!isLoaded) {
    return <PageLoader />;
  }

  return (
    <div>
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

          <Route path="*" element={<NotFoundPage />} />
        </SentryRoutes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
