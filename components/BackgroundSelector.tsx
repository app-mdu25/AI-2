import React from 'react';
import { BACKGROUND_OPTIONS } from '../constants';
import type { BackgroundOption } from '../types';

interface BackgroundSelectorProps {
  selectedBackground: BackgroundOption;
  onBackgroundChange: (option: BackgroundOption) => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ selectedBackground, onBackgroundChange }) => {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = BACKGROUND_OPTIONS.find(opt => opt.id === e.target.value);
    if(selectedOption) {
        onBackgroundChange(selectedOption);
    }
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-700">
      <h2 className="text-xl font-semibold mb-2 text-white">ขั้นตอนที่ 3: เลือกฉาก</h2>
      <p className="text-gray-400 mb-4">เลือกฉากหลังสำหรับลุคใหม่ของคุณ</p>
      <div className="relative">
        <select
          value={selectedBackground.id}
          onChange={handleChange}
          className="w-full appearance-none bg-gray-700 border border-gray-600 text-white py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-gray-600 focus:border-indigo-500 transition-colors duration-300"
        >
          {BACKGROUND_OPTIONS.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};