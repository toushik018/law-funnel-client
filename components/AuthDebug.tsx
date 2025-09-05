import React, { useState, useEffect } from "react";
import { AuthService } from "../services/authService";

interface AuthDebugProps {
  onClose: () => void;
}

/**
 * Debug component to help diagnose authentication issues
 * Especially useful for Safari/MacBook compatibility issues
 */
export default function AuthDebug({ onClose }: AuthDebugProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    // Get browser compatibility info
    const info = AuthService.getBrowserCompatibilityInfo();
    setDebugInfo(info);
  }, []);

  const runAuthTest = async () => {
    try {
      const authResult = await AuthService.checkAuth();
      setTestResults({
        success: authResult.isAuthenticated,
        user: authResult.user,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      setTestResults({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const testLogin = async () => {
    try {
      // This is just a test - don't use real credentials
      console.log("This would test login functionality");
    } catch (error) {
      console.error("Login test failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Authentication Debug Panel
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Browser Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Browser Information</h3>
          {debugInfo && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div>
                <strong>Browser:</strong>{" "}
                {debugInfo.isSafari
                  ? "Safari"
                  : debugInfo.isChrome
                  ? "Chrome"
                  : debugInfo.isFirefox
                  ? "Firefox"
                  : "Other"}
              </div>
              <div>
                <strong>Platform:</strong> {debugInfo.platform}
              </div>
              <div>
                <strong>macOS:</strong> {debugInfo.isMacOS ? "Yes" : "No"}
              </div>
              <div>
                <strong>Cookies Enabled:</strong>{" "}
                {debugInfo.cookiesEnabled ? "Yes" : "No"}
              </div>
              <div>
                <strong>Secure Context (HTTPS):</strong>{" "}
                {debugInfo.secureContext ? "Yes" : "No"}
              </div>
              <div>
                <strong>Third-party Cookies:</strong>{" "}
                {debugInfo.thirdPartyCookiesBlocked ? "Blocked" : "Allowed"}
              </div>
              <div className="mt-2">
                <strong>User Agent:</strong>
                <div className="bg-white p-2 rounded text-xs break-all">
                  {debugInfo.userAgent}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Authentication Test */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Authentication Test</h3>
          <button
            onClick={runAuthTest}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Test Authentication
          </button>

          {testResults && (
            <div
              className={`p-4 rounded-lg ${
                testResults.success ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="font-semibold">
                Status:{" "}
                {testResults.success
                  ? "✅ Authenticated"
                  : "❌ Not Authenticated"}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Time: {testResults.timestamp}
              </div>
              {testResults.user && (
                <div className="mt-2">
                  <strong>User:</strong> {testResults.user.name} (
                  {testResults.user.email})
                </div>
              )}
              {testResults.error && (
                <div className="mt-2 text-red-600">
                  <strong>Error:</strong> {testResults.error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Troubleshooting Tips */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Safari/MacBook Troubleshooting
          </h3>
          <div className="bg-yellow-50 p-4 rounded-lg text-sm space-y-2">
            <div>
              <strong>If you're using Safari:</strong>
            </div>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Go to Safari → Preferences → Privacy</li>
              <li>Uncheck "Prevent cross-site tracking"</li>
              <li>Under "Cookies and website data" select "Always allow"</li>
              <li>Refresh the page and try logging in again</li>
            </ol>

            <div className="mt-4">
              <strong>Alternative solutions:</strong>
            </div>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Try using Chrome or Firefox instead of Safari</li>
              <li>Clear all cookies and website data for this site</li>
              <li>Disable any ad blockers or privacy extensions</li>
              <li>
                Make sure you're using HTTPS (the URL should start with
                https://)
              </li>
            </ul>
          </div>
        </div>

        {/* Current Domain Info */}
        <div className="text-xs text-gray-500">
          <div>Current domain: {window.location.hostname}</div>
          <div>Protocol: {window.location.protocol}</div>
          <div>Full URL: {window.location.href}</div>
        </div>
      </div>
    </div>
  );
}
