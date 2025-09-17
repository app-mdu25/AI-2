import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ClothingPicker } from './components/ClothingPicker';
import { BackgroundSelector } from './components/BackgroundSelector';
import { AdditionalPrompt } from './components/AdditionalPrompt';
import { ResultCard } from './components/ResultCard';
import { SparklesIcon, ClearIcon } from './components/icons';
import { generateWardrobeImage } from './services/geminiService';
import type { ImageData, BackgroundOption } from './types';
import { BACKGROUND_OPTIONS } from './constants';

// Utility to convert a File object to ImageData
const fileToImageData = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      if (!result) {
          reject(new Error("Failed to read file."));
          return;
      }
      resolve({
        base64: result.split(',')[1],
        mimeType: file.type,
        name: file.name,
        previewUrl: result,
      });
    };
    reader.onerror = (error) => reject(error);
  });
};


export default function App() {
  const [faceImage, setFaceImage] = useState<ImageData | null>(null);
  const [clothingImage, setClothingImage] = useState<ImageData | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundOption>(BACKGROUND_OPTIONS[0]);
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPosing, setIsPosing] = useState(false);

  const handleFaceImageUpload = useCallback(async (file: File) => {
    setError(null);
    try {
      const imageData = await fileToImageData(file);
      setFaceImage(imageData);
    } catch (e) {
      setError('ประมวลผลรูปภาพใบหน้าไม่สำเร็จ กรุณาลองไฟล์อื่น');
    }
  }, []);
  
  const handleClothingImageSelected = useCallback((image: ImageData) => {
    setError(null);
    setClothingImage(image);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!faceImage || !clothingImage || !selectedBackground) {
      setError("กรุณาทำตามขั้นตอนทั้งหมด: อัปโหลดใบหน้า, เลือกเสื้อผ้า, และเลือกพื้นหลัง");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateWardrobeImage(faceImage, clothingImage, selectedBackground.prompt, isPosing, additionalPrompt);
      setGeneratedImage(result);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "เกิดข้อผิดพลาดที่ไม่รู้จักระหว่างการสร้างภาพ";
        console.error(e);
        setError(`การสร้างล้มเหลว: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [faceImage, clothingImage, selectedBackground, isPosing, additionalPrompt]);

  const handleClearAll = useCallback(() => {
    setFaceImage(null);
    setClothingImage(null);
    setSelectedBackground(BACKGROUND_OPTIONS[0]);
    setAdditionalPrompt('');
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
    setIsPosing(false);
  }, []);

  const isGenerateDisabled = useMemo(() => {
    return !faceImage || !clothingImage || !selectedBackground || isLoading;
  }, [faceImage, clothingImage, selectedBackground, isLoading]);

  const isClearDisabled = useMemo(() => {
    return !faceImage && !clothingImage && !generatedImage && !error && selectedBackground.id === BACKGROUND_OPTIONS[0].id && !isPosing && !additionalPrompt;
  }, [faceImage, clothingImage, generatedImage, error, selectedBackground, isPosing, additionalPrompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <ImageUploader onImageUpload={handleFaceImageUpload} imageData={faceImage} title="ขั้นตอนที่ 1: อัปโหลดรูปภาพของคุณ" description="อัปโหลดรูปภาพหน้าตรงที่ชัดเจนของคุณ"/>
            <ClothingPicker onClothingSelected={handleClothingImageSelected} clothingImage={clothingImage} />
          </div>
          
          {/* Right Column: Controls & Output */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <BackgroundSelector 
              selectedBackground={selectedBackground}
              onBackgroundChange={setSelectedBackground}
            />

            <AdditionalPrompt value={additionalPrompt} onChange={setAdditionalPrompt} />

            <div className="bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-700 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">โพสท่าแบบนายแบบ/นางแบบ</h3>
                    <p className="text-sm text-gray-400">เปิดใช้งานเพื่อสร้างท่าทางแบบไดนามิก</p>
                </div>
                <label htmlFor="posing-toggle" className="inline-flex relative items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={isPosing} 
                        onChange={() => setIsPosing(!isPosing)} 
                        id="posing-toggle" 
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerateDisabled}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300 ease-in-out bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
              >
                <SparklesIcon />
                {isLoading ? 'กำลังสร้างสรรค์ลุคของคุณ...' : 'สร้างรูปภาพ'}
              </button>
              <button
                onClick={handleClearAll}
                disabled={isClearDisabled}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-md font-semibold text-gray-300 rounded-xl shadow-lg transition-all duration-300 ease-in-out bg-gray-700 hover:bg-red-600 hover:text-white disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                aria-label="Clear all inputs and results"
              >
                <ClearIcon />
                ล้างทั้งหมด
              </button>
            </div>
            
            <ResultCard 
              isLoading={isLoading}
              generatedImage={generatedImage}
              error={error}
            />
          </div>

        </div>
      </main>
    </div>
  );
}