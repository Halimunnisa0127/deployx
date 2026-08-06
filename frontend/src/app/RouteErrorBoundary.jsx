import { useRouteError } from "react-router-dom";
import ErrorState from "../components/ui/ErrorState";

export default function RouteErrorBoundary() {
  const error = useRouteError();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0a] p-4">
      <div className="w-full max-w-2xl">
        <ErrorState 
          title={error?.status === 404 ? "Page Not Found" : "Application Error"} 
          message={error?.status === 404 ? "The page you are looking for does not exist or has been moved." : error?.message || error?.statusText || "An unexpected error occurred in the application. Please try again."} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    </div>
  );
}

