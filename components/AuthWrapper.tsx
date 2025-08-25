import React, { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import Login from "./Login";
import Register from "./Register";
import GlobalLoading from "./GlobalLoading";
import ProfileRequiredModal from "./ProfileRequiredModal";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, user, isInitializing } = useAuthStore();
  const [showRegister, setShowRegister] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Handle profile completion check
  useEffect(() => {
    if (isAuthenticated && user && user.profileCompleted === false) {
      setShowProfileModal(true);
    } else {
      setShowProfileModal(false);
    }
  }, [isAuthenticated, user]);

  // Handle profile modal continue action
  const handleProfileContinue = () => {
    setShowProfileModal(false);
    window.history.pushState({}, "", "/profile");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Show global loading during initial authentication check
  if (isInitializing) {
    return <GlobalLoading message="Checking authentication..." />;
  }

  // If user is authenticated, show children or profile modal
  if (isAuthenticated && user) {
    return (
      <>
        {children}
        <ProfileRequiredModal
          isOpen={showProfileModal}
          onContinue={handleProfileContinue}
        />
      </>
    );
  }

  // If not authenticated, show login/register
  return (
    <>
      {showRegister ? (
        <Register onSwitchToLogin={() => setShowRegister(false)} />
      ) : (
        <Login onSwitchToRegister={() => setShowRegister(true)} />
      )}
    </>
  );
}
