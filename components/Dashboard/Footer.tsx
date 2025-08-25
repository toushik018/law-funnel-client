import React from "react";

interface FooterProps {
  onNavigate: (path: string) => void;
}

const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600"></p>
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Law Funnel
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate("/impressum")}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Impressum
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
