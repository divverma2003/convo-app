import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { Home, ArrowLeft, MessageSquare } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-center">
        <div className="auth-hero">
          <div className="brand-container">
            <img src="/logo.png" alt="Convo Logo" className="brand-logo" />
            <span className="brand-name">Convo</span>
          </div>

          <h1 className="hero-title">Page not found</h1>
          <p className="hero-subtitle">
            Oops! The page you're looking for seems to have wandered off. Don't
            worry, it happens to the best of us. Let's get you back on track to
            meaningful conversations.
          </p>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">
                <MessageSquare />
              </span>
              <span>Return to your conversations</span>
            </div>

            <div className="feature-item">
              <span className="feature-icon">
                <Home />
              </span>
              <span>Explore the home page</span>
            </div>

            <div className="feature-item">
              <span className="feature-icon">
                <ArrowLeft />
              </span>
              <span>Go back to previous page</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button className="cta-button" onClick={() => navigate("/")}>
              Go Home
              <span className="button-arrow">→</span>
            </button>

            <button
              className="cta-button"
              onClick={() => navigate(-1)}
              style={{
                background: "transparent",
                border: "2px solid #8b5c33",
                color: "#8b5c33",
              }}
            >
              Go Back
              <span className="button-arrow">←</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
