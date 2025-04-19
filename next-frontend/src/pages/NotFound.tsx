
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-automate-black p-4">
      <div className="automate-card max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-automate-purple/20 flex items-center justify-center">
            <AlertCircle size={32} className="text-automate-purple" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-xl text-white mb-6">Page Not Found</p>
        <p className="text-gray-400 mb-8">
          The page <span className="font-mono text-automate-purple">{location.pathname}</span> doesn't exist or has been moved.
        </p>
        <Link to="/" className="automate-button inline-flex items-center">
          <Home size={18} className="mr-2" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
