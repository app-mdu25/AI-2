import React from 'react';

interface AdditionalPromptProps {
  value: string;
  onChange: (value: string) => void;
}

export const AdditionalPrompt: React.FC<AdditionalPromptProps> = ({ value, onChange }) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-700">
      <h3 className="text-lg font-semibold text-white">ขั้นตอนเสริม: เพิ่มคำสั่ง Prompt</h3>
      <p className="text-sm text-gray-400 mb-4">
        เช่น 'เพิ่มแว่นกันแดด' หรือ 'เปลี่ยนสีผมเป็นสีบลอนด์'
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ใส่คำสั่งเพิ่มเติมที่นี่..."
        className="w-full h-24 bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 resize-none transition-colors duration-300"
        aria-label="Additional prompt input"
      />
    </div>
  );
};