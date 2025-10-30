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
    const canDetect = await (window as any).ai?.languageDetector?.capabilities();
    return canDetect?.available === "readily";
  } catch (error) {
    console.error("Language detector availability check failed:", error);
    return false;
  }
};

export const isTranslatorAvailable = async (sourceLanguage: string, targetLanguage: string) => {
  try {
    const canTranslate = await (window as any).ai?.translator?.capabilities({
      sourceLanguage,
      targetLanguage,
    });
    return canTranslate?.available === "readily";
  } catch (error) {
    console.error("Translator availability check failed:", error);
    return false;
  }
};
