import { useState, useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import "../styles/message-container.css";

const ErrorMessageContainer = ({ message, className = "" }) => {
  return (
    <div className={`fetch-message-container ${className}`}>
      <p className="fetch-message">{message}</p>
    </div>
  );
};

export default ErrorMessageContainer;
