// hooks/useImageColorExtraction.ts
"use client";

import { useCallback } from 'react';

export const useImageColorExtraction = () => {
  const extractColorFromImage = useCallback(async (file: File): Promise<string | null> => {
    try {
      // Use the browser-specific version of node-vibrant
      const Vibrant = (await import('node-vibrant/browser')).default;
      
      // Create object URL for the file
      const imageUrl = URL.createObjectURL(file);
      
      // Extract colors using Vibrant
      const palette = await Vibrant.from(imageUrl).getPalette();
      
      // Clean up object URL
      URL.revokeObjectURL(imageUrl);
      
      // Priority order for color selection
      const colorPriority = [
        palette.Vibrant,
        palette.DarkVibrant,
        palette.LightVibrant,
        palette.Muted,
        palette.DarkMuted,
        palette.LightMuted,
      ];
      
      // Find the first available color
      for (const swatch of colorPriority) {
        if (swatch) {
          return swatch.hex;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting color from image:', error);
      return null;
    }
  }, []);

  return { extractColorFromImage };
};