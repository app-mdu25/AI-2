import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWardrobeImage = async (
  faceImage: ImageData,
  clothingImage: ImageData,
  backgroundPrompt: string,
  isPosing: boolean,
  additionalPrompt: string
): Promise<string> => {
  const poseInstruction = isPosing 
    ? 'The person should be striking a dynamic, confident, and fashionable pose like a professional model, suitable for a high-fashion photoshoot.' 
    : 'The person should have a natural and relaxed posture.';
    
  const additionalInstructions = additionalPrompt ? `Additional user instructions: "${additionalPrompt}".` : '';

  const prompt = `Create a photorealistic image of the person from the first image wearing the outfit from the second image. The person should be placed in this scene: ${backgroundPrompt}. ${poseInstruction} ${additionalInstructions} The final image should be seamless, with realistic lighting, shadows, and proportions, matching the atmosphere of the background scene. Focus on making the person look natural in the new environment.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          { inlineData: { data: faceImage.base64, mimeType: faceImage.mimeType } },
          { inlineData: { data: clothingImage.base64, mimeType: clothingImage.mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64ImageBytes = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }

    // Check for safety ratings or other block reasons
    const safetyFeedback = response.candidates?.[0]?.safetyRatings;
    if (safetyFeedback && safetyFeedback.some(rating => rating.blocked)) {
        throw new Error("การสร้างภาพถูกบล็อกเนื่องจากการตั้งค่าความปลอดภัย กรุณาลองใช้ภาพอื่น");
    }

    throw new Error("AI ไม่ได้สร้างรูปภาพใดๆ โมเดลอาจส่งคืนมาเป็นข้อความเท่านั้น");
  } catch(error) {
    console.error("Error generating image with Gemini API:", error);
    if(error instanceof Error) {
        throw new Error(`ข้อผิดพลาดจาก Gemini API: ${error.message}`);
    }
    throw new Error("เกิดข้อผิดพลาดที่ไม่รู้จักขณะสื่อสารกับ Gemini API");
  }
};