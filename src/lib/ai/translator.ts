import { isLanguageDetectorAvailable, isTranslatorAvailable } from '../provider';

export interface TranslationOptions {
  targetLanguage: string;
}

export interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
}

// Language codes supported by Chrome AI
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Spanish', 
  ja: 'Japanese',
} as const;

export type SupportedLanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Extract all text content from Puck data structure
const extractTextFromPuckData = (data: any): string[] => {
  const textContents: string[] = [];
  
  if (data.content && Array.isArray(data.content)) {
    data.content.forEach((item: any) => {
      if (item.props && typeof item.props === 'object') {
        // Recursively extract text from props
        const extractTextFromObject = (obj: any): void => {
          Object.values(obj).forEach((value) => {
            if (typeof value === 'string' && value.trim().length > 0) {
              textContents.push(value.trim());
            } else if (Array.isArray(value)) {
              value.forEach((item) => {
                if (typeof item === 'string' && item.trim().length > 0) {
                  textContents.push(item.trim());
                } else if (typeof item === 'object' && item !== null) {
                  extractTextFromObject(item);
                }
              });
            } else if (typeof value === 'object' && value !== null) {
              extractTextFromObject(value);
            }
          });
        };
        
        extractTextFromObject(item.props);
      }
    });
  }
  
  return textContents;
};

// Detect language of the resume content
export const detectResumeLanguage = async (data: any): Promise<LanguageDetectionResult> => {
  const isAvailable = await isLanguageDetectorAvailable();
  if (!isAvailable) {
    throw new Error('Language detector is not available');
  }

  try {
    const detector = await (window as any).ai.languageDetector.create();
    const textContents = extractTextFromPuckData(data);
    
    if (textContents.length === 0) {
      throw new Error('No text content found in resume');
    }

    // Combine multiple text samples for better detection
    const sampleText = textContents.slice(0, 10).join('. ');
    const results = await detector.detect(sampleText);
    
    if (results && results.length > 0) {
      return {
        detectedLanguage: results[0].detectedLanguage,
        confidence: results[0].confidence,
      };
    }
    
    throw new Error('Could not detect language');
  } catch (error) {
    console.error('Language detection failed:', error);
    throw error;
  }
};

// Translate text values in Puck data structure
const translatePuckDataRecursively = async (
  obj: any,
  translator: any
): Promise<any> => {
  if (typeof obj === 'string' && obj.trim().length > 0) {
    try {
      const translated = await translator.translate(obj);
      return translated || obj;
    } catch (error) {
      console.warn('Failed to translate text:', obj, error);
      return obj;
    }
  }
  
  if (Array.isArray(obj)) {
    const translatedArray = [];
    for (const item of obj) {
      translatedArray.push(await translatePuckDataRecursively(item, translator));
    }
    return translatedArray;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const translatedObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Keep keys unchanged, only translate values
      translatedObj[key] = await translatePuckDataRecursively(value, translator);
    }
    return translatedObj;
  }
  
  return obj;
};

// Main translation function
export const translateResumeData = async (
  data: any,
  options: TranslationOptions,
  onProgress?: (progress: number) => void
): Promise<any> => {
  const { targetLanguage } = options;
  
  // First detect the current language
  let detectionResult: LanguageDetectionResult;
  try {
    detectionResult = await detectResumeLanguage(data);
    console.log('Detected language:', detectionResult);
  } catch (error) {
    throw new Error(`Language detection failed: ${error}`);
  }

  // Check if source and target languages are the same
  if (detectionResult.detectedLanguage === targetLanguage) {
    throw new Error(
      `Source language (${SUPPORTED_LANGUAGES[detectionResult.detectedLanguage as SupportedLanguageCode] || detectionResult.detectedLanguage}) and target language (${SUPPORTED_LANGUAGES[targetLanguage as SupportedLanguageCode] || targetLanguage}) are the same.`
    );
  }

  // Check if translation is available for this language pair
  const isAvailable = await isTranslatorAvailable(
    detectionResult.detectedLanguage,
    targetLanguage
  );
  
  if (!isAvailable) {
    throw new Error(
      `Translation from ${detectionResult.detectedLanguage} to ${targetLanguage} is not available`
    );
  }

  try {
    // Create translator instance
    const translator = await (window as any).ai.translator.create({
      sourceLanguage: detectionResult.detectedLanguage,
      targetLanguage: targetLanguage,
    });

    onProgress?.(10);

    // Create a deep copy of the data to avoid modifying the original
    const translatedData = JSON.parse(JSON.stringify(data));
    
    onProgress?.(20);

    // Translate only the content array
    if (translatedData.content && Array.isArray(translatedData.content)) {
      const totalItems = translatedData.content.length;
      
      for (let i = 0; i < translatedData.content.length; i++) {
        const item = translatedData.content[i];
        
        if (item.props && typeof item.props === 'object') {
          // Translate only the props, keeping the structure intact
          translatedData.content[i] = {
            ...item,
            props: await translatePuckDataRecursively(item.props, translator),
          };
        }
        
        // Update progress
        const progress = 20 + Math.floor((i / totalItems) * 70);
        onProgress?.(progress);
      }
    }

    onProgress?.(100);

    return {
      data: translatedData,
      sourceLanguage: detectionResult.detectedLanguage,
      targetLanguage: targetLanguage,
      confidence: detectionResult.confidence,
    };
  } catch (error) {
    console.error('Translation failed:', error);
    throw error;
  }
};

// Check if translation features are available
export const checkTranslationAvailability = async (): Promise<boolean> => {
  try {
    const detectorAvailable = await isLanguageDetectorAvailable();
    
    // Check if at least one translation pair is available
    const translationChecks = [];
    const languages = Object.keys(SUPPORTED_LANGUAGES);
    
    for (const source of languages) {
      for (const target of languages) {
        if (source !== target) {
          translationChecks.push(isTranslatorAvailable(source, target));
        }
      }
    }
    
    const translationResults = await Promise.all(translationChecks);
    const anyTranslationAvailable = translationResults.some(result => result);
    
    return detectorAvailable && anyTranslationAvailable;
  } catch (error) {
    console.error('Failed to check translation availability:', error);
    return false;
  }
};