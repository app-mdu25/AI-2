import React, { useCallback, useRef } from 'react';
import type { ImageData } from '../types';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageData: ImageData | null;
  title: string;
  description: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageData, title, description }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
        onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-700">
      <h2 className="text-xl font-semibold mb-2 text-white">{title}</h2>
      <p className="text-gray-400 mb-4">{description}</p>
      <div 
        className="relative border-2 border-dashed border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 hover:bg-gray-700/50 transition-colors duration-300 min-h-[200px] flex flex-col items-center justify-center"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
        {imageData ? (
          <>
            <img src={imageData.previewUrl} alt="Preview" className="max-h-48 rounded-lg mx-auto object-contain" />
            <p className="mt-2 text-sm text-gray-300 truncate">{imageData.name}</p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <UploadIcon />
            <p className="mt-2 font-semibold text-indigo-400">คลิกเพื่ออัปโหลด หรือลากและวาง</p>
            <p className="text-xs text-gray-500">ไฟล์ PNG หรือ JPG</p>
          </div>
        )}
      </div>
    </div>
  );
};