/* eslint-disable @typescript-eslint/no-explicit-any */
export const isBuiltInAIAvailabile = async () => {
  const isLanguageModelAvailable = await (
    window as any
  ).LanguageModel.availability();
  if (isLanguageModelAvailable === "available") {
    return true;
  }
  return false;
};

export const isLanguageDetectorAvailable = async () => {
  try {
    const canDetect = await (window as any).LanguageDetector.availability();
    console.log("Language detector availability result:", canDetect);
    return canDetect === "available";
  } catch (error) {
    console.error("Language detector availability check failed:", error);
    return false;
  }
};

export const isTranslatorAvailable = async (
  sourceLanguage: string,
  targetLanguage: string
) => {
  try {
    const canTranslate = await (window as any).Translator.availability({
      sourceLanguage,
      targetLanguage,
    });
    console.log("Translator availability result:", canTranslate);
    return canTranslate === "available" || canTranslate === "downloadable";
  } catch (error) {
    console.error("Translator availability check failed:", error);
    return false;
  }
};

export const isWriterAvailable = async () => {
  try {
    if (!('Writer' in window)) {
      console.log("Writer API not found in window");
      return false;
    }
    
    const availability = await (window as any).Writer.availability();
    console.log("Writer availability result:", availability);
    return availability === "available" || availability === "downloadable";
  } catch (error) {
    console.error("Writer availability check failed:", error);
    return false;
  }
};

export const isSummarizerAvailable = async () => {
  try {
    if (!('Summarizer' in window)) {
      console.log("Summarizer API not found in window");
      return false;
    }
    
    const availability = await (window as any).Summarizer.availability();
    console.log("Summarizer availability result:", availability);
    return availability === "available" || availability === "downloadable";
  } catch (error) {
    console.error("Summarizer availability check failed:", error);
    return false;
  }
};
