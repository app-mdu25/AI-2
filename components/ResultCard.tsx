import React from 'react';
import { DownloadIcon, PhotoIcon } from './icons';

interface ResultCardProps {
  isLoading: boolean;
  generatedImage: string | null;
  error: string | null;
}

const Spinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <div className="w-12 h-12 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-gray-300">AI กำลังสร้างสรรค์รูปภาพของคุณ...</p>
        <p className="text-sm text-gray-500">ขั้นตอนนี้อาจใช้เวลาสักครู่</p>
    </div>
);

export const ResultCard: React.FC<ResultCardProps> = ({ isLoading, generatedImage, error }) => {
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'ai-wardrobe-creation.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 aspect-square flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">ขั้นตอนที่ 4: ลุคใหม่ของคุณ</h2>
      </div>
      <div className="flex-grow flex items-center justify-center p-4">
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center text-red-400 p-4">
            <p className="font-semibold">โอ้ ไม่นะ, เกิดข้อผิดพลาดบางอย่าง!</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        ) : generatedImage ? (
          <div className="flex flex-col items-center gap-4 w-full">
            <img src={generatedImage} alt="Generated result" className="rounded-lg max-w-full max-h-80 object-contain shadow-lg" />
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center px-4 py-2 text-md font-semibold text-white rounded-lg transition-all duration-300 bg-green-600 hover:bg-green-500"
            >
              <DownloadIcon />
              ดาวน์โหลดรูปภาพ
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <PhotoIcon />
            <p className="mt-2 font-medium">รูปภาพที่คุณสร้างจะปรากฏที่นี่</p>
          </div>
        )}
      </div>
    </div>
  );
};