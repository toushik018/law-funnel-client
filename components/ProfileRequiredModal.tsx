import React from "react";

interface ProfileRequiredModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

export default function ProfileRequiredModal({
  isOpen,
  onContinue,
}: ProfileRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-fade-in">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
          Complete Your Profile
        </h3>

        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-3">
            To continue using Law Funnel, please complete your profile
            information including:
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Company details</li>
            <li>• Contact information</li>
            <li>• Banking information</li>
            <li>• Legal firm details</li>
          </ul>
        </div>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> This information is
            required to generate proper legal notices and invoices.
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
