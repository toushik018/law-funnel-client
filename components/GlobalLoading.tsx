import React from "react";

interface GlobalLoadingProps {
  message?: string;
}

export default function GlobalLoading({
  message = "Loading...",
}: GlobalLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="text-center">
        {/* Loading Animation */}
        <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <svg
            className="h-8 w-8 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Law Funnel</h2>
        <p className="text-gray-600 mb-4">{message}</p>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

        {/* Subtitle */}
        <p className="mt-6 text-sm text-gray-500">
          Initializing your legal document processing platform
        </p>
      </div>
    </div>
  );
}
