import React, { useState, useCallback, useRef } from 'react';
import type { ImageData } from '../types';
import { UploadIcon } from './icons';

interface ClothingPickerProps {
    onClothingSelected: (image: ImageData) => void;
    clothingImage: ImageData | null;
}

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

const Spinner = () => <div className="w-8 h-8 border-4 border-t-transparent border-indigo-400 rounded-full animate-spin"></div>;

export const ClothingPicker: React.FC<ClothingPickerProps> = ({ onClothingSelected, clothingImage }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        try {
            const imageData = await fileToImageData(file);
            onClothingSelected(imageData);
        } catch (e) {
            setError('ประมวลผลรูปภาพเสื้อผ้าไม่สำเร็จ กรุณาลองไฟล์อื่น');
        } finally {
            setIsLoading(false);
        }
    }, [onClothingSelected]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    }, [processFile]);

    const handleClick = () => {
        if (!isLoading) {
            inputRef.current?.click();
        }
    };
    
    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }, []);

    return (
        <div className="bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-700">
            <h2 className="text-xl font-semibold mb-2 text-white">ขั้นตอนที่ 2: อัปโหลดชุดเสื้อผ้า</h2>
            <p className="text-gray-400 mb-4">อัปโหลดรูปภาพของเสื้อผ้าที่คุณต้องการสวมใส่</p>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <div 
                className={`relative border-2 border-dashed border-gray-600 rounded-xl p-4 text-center transition-colors duration-300 min-h-[200px] flex flex-col items-center justify-center ${isLoading ? 'cursor-wait' : 'cursor-pointer hover:border-indigo-500 hover:bg-gray-700/50'}`}
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
                    disabled={isLoading}
                />
                {isLoading ? (
                    <Spinner />
                ) : clothingImage ? (
                    <>
                        <img src={clothingImage.previewUrl} alt="Clothing Preview" className="max-h-48 rounded-lg mx-auto object-contain" />
                        <p className="mt-2 text-sm text-gray-300 truncate">{clothingImage.name}</p>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <UploadIcon />
                        <p className="mt-2 font-semibold text-indigo-400">คลิกเพื่ออัปโหลด หรือลากและวาง</p>
                        <p className="text-xs text-gray-500">ไฟล์ PNG หรือ JPG ของเสื้อผ้า</p>
                    </div>
                )}
            </div>
        </div>
    );
};