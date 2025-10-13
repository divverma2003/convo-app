import { LoaderIcon } from "lucide-react";

const PageLoader = ({ message }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-900">
      <LoaderIcon className="text-white animate-spin size-10 text-primary" />
      {message && <p className="text-white m-1">{message}</p>}
    </div>
  );
};
export default PageLoader;
