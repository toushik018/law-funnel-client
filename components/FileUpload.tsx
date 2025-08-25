import React, { useState, useCallback } from 'react';
import UploadIcon from './icons/UploadIcon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
  }, [disabled]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if(file.type === "application/pdf") {
        onFileSelect(file);
      } else {
        alert("Bitte laden Sie eine PDF-Datei hoch.");
      }
      e.dataTransfer.clearData();
    }
  }, [onFileSelect, disabled]);

  const baseClasses = "w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-300";
  const disabledClasses = 'bg-zinc-100 opacity-60 cursor-not-allowed';
  const enabledClasses = isDragging 
    ? 'border-indigo-400 bg-indigo-50' 
    : 'bg-white border-zinc-300 hover:border-indigo-300 hover:bg-zinc-100/50';

  return (
    <div className="w-full flex flex-col items-center">
      <label
        htmlFor="file-upload"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${baseClasses} ${disabled ? disabledClasses : `${enabledClasses} cursor-pointer`}`}
      >
        <UploadIcon className="w-10 h-10 text-zinc-400 mb-3" />
        <span className="text-base font-semibold text-zinc-700">Rechnungs-PDF hier ablegen</span>
        <span className="text-zinc-500 text-sm mt-1">oder zum Hochladen klicken</span>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
      <p className="mt-4 text-xs text-zinc-500 text-center">Ihre Datei wird sicher verarbeitet und nicht gespeichert.</p>
    </div>
  );
};

export default FileUpload;
