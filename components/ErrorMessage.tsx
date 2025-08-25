import React from 'react';
import AlertIcon from './icons/AlertIcon';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  title?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, title }) => {
  return (
    <div className="bg-rose-50 border border-rose-200 p-6 rounded-lg flex flex-col items-center text-center animate-fade-in">
      <AlertIcon className="w-12 h-12 text-rose-500 mb-4" />
      <h3 className="text-xl font-bold text-rose-900">{title || 'Ein Fehler ist aufgetreten'}</h3>
      <p className="mt-2 text-rose-700 max-w-md">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
      >
        Wiederholen
      </button>
    </div>
  );
};

export default ErrorMessage;