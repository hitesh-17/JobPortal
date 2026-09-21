import React from "react";

const AuthLoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">

        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        {/* Text */}
        <p className="mt-4 text-sm font-medium text-gray-600">
          Checking authentication...
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Please wait
        </p>

      </div>
    </div>
  );
};

export default AuthLoadingScreen;