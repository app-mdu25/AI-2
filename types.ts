
export interface ClothingOption {
  id: string;
  name: string;
  imageUrl: string;
}

export interface BackgroundOption {
  id: string;
  name: string;
  prompt: string;
}

export interface ImageData {
  base64: string;
  mimeType: string;
  name: string;
  previewUrl: string;
}
