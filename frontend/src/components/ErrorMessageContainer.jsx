import { useState, useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import "../styles/message-container.css";

const ErrorMessageContainer = ({ message }) => {
  return (
    <div className={`fetch-message-container`}>
      <p className="fetch-message">{message}</p>
    </div>
  );
};

export default ErrorMessageContainer;
