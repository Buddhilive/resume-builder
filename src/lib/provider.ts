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
