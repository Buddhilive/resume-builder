/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isLanguageDetectorAvailable,
  isTranslatorAvailable,
} from "../provider";

export interface CoverLetterTranslationOptions {
  targetLanguage: string;
}

export interface CoverLetterTranslationResult {
  translatedContent: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

// Language codes supported by Chrome AI
export const SUPPORTED_LANGUAGES = {
  es: "Spanish",
  ja: "Japanese",
  en: "English",
} as const;

export type SupportedLanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Detect language of the cover letter content
export const detectCoverLetterLanguage = async (
  content: string
): Promise<{ detectedLanguage: string; confidence: number }> => {
  const isAvailable = await isLanguageDetectorAvailable();
  if (!isAvailable) {
    throw new Error("Language detector is not available");
  }

  try {
    const detector = await (window as any).LanguageDetector.create({
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
          console.log(`Downloaded ${e.loaded * 100}%`);
        });
      },
    });

    if (!content.trim()) {
      throw new Error("No content found to detect language");
    }

    // Use the content directly for detection
    const results = await detector.detect(content);

    if (results && results.length > 0) {
      return {
        detectedLanguage: results[0].detectedLanguage,
        confidence: results[0].confidence,
      };
    }

    throw new Error("Could not detect language");
  } catch (error) {
    console.error("Language detection failed:", error);
    throw error;
  }
};

// Translate cover letter content
export const translateCoverLetterContent = async (
  content: string,
  options: CoverLetterTranslationOptions,
  onProgress?: (progress: number) => void
): Promise<CoverLetterTranslationResult> => {
  if (!content.trim()) {
    throw new Error("No content to translate");
  }

  try {
    // First detect the source language
    const detectionResult = await detectCoverLetterLanguage(content);
    const sourceLanguage = detectionResult.detectedLanguage;

    // Check if translation is needed
    if (sourceLanguage === options.targetLanguage) {
      return {
        translatedContent: content,
        sourceLanguage,
        targetLanguage: options.targetLanguage,
        confidence: detectionResult.confidence,
      };
    }

    // Check if translator is available for this language pair
    const isAvailable = await isTranslatorAvailable(sourceLanguage, options.targetLanguage);
    if (!isAvailable) {
      throw new Error(`Translation from ${sourceLanguage} to ${options.targetLanguage} is not available`);
    }

    // Create translator
    const translator = await (window as any).Translator.create({
      sourceLanguage,
      targetLanguage: options.targetLanguage,
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
          const progress = Math.round(e.loaded * 100);
          onProgress?.(progress);
          console.log(`Translation model downloaded ${progress}%`);
        });
      },
    });

    onProgress?.(100);

    // Split content into smaller chunks if it's too long
    const maxChunkSize = 1000; // Adjust based on API limits
    const chunks: string[] = [];
    
    if (content.length <= maxChunkSize) {
      chunks.push(content);
    } else {
      // Split by paragraphs first, then by sentences if needed
      const paragraphs = content.split('\n\n');
      let currentChunk = '';
      
      for (const paragraph of paragraphs) {
        if ((currentChunk + paragraph).length <= maxChunkSize) {
          currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
        } else {
          if (currentChunk) {
            chunks.push(currentChunk);
          }
          currentChunk = paragraph;
        }
      }
      
      if (currentChunk) {
        chunks.push(currentChunk);
      }
    }

    // Translate each chunk
    const translatedChunks: string[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      try {
        const translatedChunk = await translator.translate(chunks[i]);
        translatedChunks.push(translatedChunk);
        
        // Update progress
        const chunkProgress = Math.round(((i + 1) / chunks.length) * 100);
        onProgress?.(chunkProgress);
      } catch (error) {
        console.error(`Failed to translate chunk ${i + 1}:`, error);
        throw error;
      }
    }

    const translatedContent = translatedChunks.join('\n\n');

    return {
      translatedContent,
      sourceLanguage,
      targetLanguage: options.targetLanguage,
      confidence: detectionResult.confidence,
    };
  } catch (error) {
    console.error("Translation failed:", error);
    throw error;
  }
};

// Check if translation is available
export const checkCoverLetterTranslationAvailability = async (): Promise<boolean> => {
  try {
    const detectorAvailable = await isLanguageDetectorAvailable();
    
    // Check if translator is available for some common language pairs
    const commonPairs = [
      { source: 'en', target: 'es' },
      { source: 'en', target: 'ja' },
      { source: 'es', target: 'en' },
      { source: 'ja', target: 'en' }
    ];
    
    const translatorChecks = await Promise.all(
      commonPairs.map(pair => isTranslatorAvailable(pair.source, pair.target))
    );
    
    const translatorAvailable = translatorChecks.some(available => available);
    
    return detectorAvailable && translatorAvailable;
  } catch (error) {
    console.error("Error checking translation availability:", error);
    return false;
  }
};