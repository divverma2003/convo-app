import "../styles/auth.css";
import { SignInButton } from "@clerk/clerk-react";
import { MessageSquare, Video, ShieldCheck } from "lucide-react";
const AuthPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="brand-container">
            <img src="/logo.png" alt="Convo Logo" className="brand-logo" />
            <span className="brand-name">Convo</span>
          </div>

          <h1 className="hero-title">Conversation, perfected</h1>
          <p className="hero-subtitle">
            Connect, chat, and collaborate seamlessly with Convo - your go-to
            communication platform. Built with secure, real-time messaging,
            video calling, and more!
          </p>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">
                <MessageSquare />
              </span>
              <span>Real-Time Messaging with Channels</span>
            </div>

            <div className="feature-item">
              <span className="feature-icon">
                <Video />
              </span>
              <span>Video Calls & Meetings</span>
            </div>

            <div className="feature-item">
              <span className="feature-icon">
                <ShieldCheck />
              </span>
              <span>Secure & Private</span>
            </div>
          </div>

          <SignInButton mode="modal">
            <button className="cta-button">
              Get Started with Convo
              <span className="button-arrow">→</span>
            </button>
          </SignInButton>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-image-container">
          <img
            src="/auth-i.jpg"
            alt="Stock Image of a Team Colloborating"
            className="auth-image"
          />
          <div className="image-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
