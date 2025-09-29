import { LoaderIcon } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-900">
      <LoaderIcon className="text-white animate-spin size-10 text-primary" />
    </div>
  );
};
export default PageLoader;
