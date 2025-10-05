import { CircleX } from "lucide-react";
import "../styles/message-container.css";

const ErrorMessageContainer = ({ message }) => {
  return (
    <div className={`fetch-message-container`}>
      <p className="fetch-message">{message}</p>
      <CircleX className="size-10 text-red-800" />
    </div>
  );
};

export default ErrorMessageContainer;
