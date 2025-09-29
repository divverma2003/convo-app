import { useState, useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import "../styles/message-container.css";

const FetchMessageContainer = ({
  message = "Loading...",
  isLoading,
  showSpinner = isLoading ? true : false,
  className = "",
  children,
}) => {
  const [dots, setDots] = useState("");

  // Animated dots effect
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDots((prev) => {
          // reset after 3 dots
          if (prev === "...") return "";
          return prev + ".";
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setDots("");
    }
  }, [isLoading]);

  if (!isLoading && !children) return null;

  return (
    <div className={`fetch-message-container ${className}`}>
      {isLoading ? (
        <div className="fetch-content">
          {showSpinner && (
            <LoaderIcon className="text-white animate-spin size-6 text-primary" />
          )}
          <p className="fetch-message">
            {message}
            {dots}
          </p>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default FetchMessageContainer;
