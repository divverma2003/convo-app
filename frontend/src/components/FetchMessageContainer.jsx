import { useState, useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import "../styles/message-container.css";

const FetchMessageContainer = ({
  message = "Loading...",
  isLoading,
  showSpinner = isLoading ? true : false,
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

  if (!isLoading) return null;

  return (
    <div className={`fetch-message-container`}>
      {isLoading && (
        <div className="fetch-content">
          <p className="fetch-message">
            {message}
            {dots}
          </p>
          {showSpinner && (
            <LoaderIcon className="text-amber-900 animate-spin size-10 text-primary" />
          )}
        </div>
      )}
    </div>
  );
};

export default FetchMessageContainer;
