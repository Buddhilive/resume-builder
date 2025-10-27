// ATS Optimization Utilities
// This module provides utilities to ensure resume compatibility with Applicant Tracking Systems

/**
 * ATS Compatibility Checks
 * Ensures resume components are optimized for ATS parsing
 */

export const atsCompatibility = {
  /**
   * Check if text uses ATS-friendly formatting
   * Avoid: Tables, images, special characters, unusual fonts
   */
  validateText: (text: string): boolean => {
    // Check for special characters that might cause parsing issues
    const specialChars = /[^\w\s\-\.\/&,()]/g;
    const matches = text.match(specialChars) || [];
    return matches.length === 0 || matches.length < text.length * 0.1; // Allow up to 10% special chars
  },

  /**
   * Sanitize text for ATS compatibility
   */
  sanitizeText: (text: string): string => {
    return text
      .replace(/[™®©]/g, "") // Remove trademark symbols
      .replace(/[""'']/g, '"') // Normalize quotes
      .replace(/[\u2013\u2014]/g, "-") // Normalize dashes
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();
  },

  /**
   * Recommended ATS-friendly fonts
   */
  atsCompatibleFonts: [
    "Arial",
    "Verdana",
    "Helvetica",
    "Georgia",
    "Times New Roman",
    "Courier New",
  ],

  /**
   * Get ATS optimization score (0-100)
   */
  getOptimizationScore: (resumeData: unknown): number => {
    let score = 100;

    if (typeof resumeData !== "object" || resumeData === null) {
      return 0;
    }

    const data = resumeData as Record<string, unknown>;

    // Check for tables (negative for ATS)
    if (typeof data.content === "string" && data.content.includes("<table")) {
      score -= 20;
    }

    // Check for images (negative for ATS)
    if (typeof data.content === "string" && data.content.includes("<img")) {
      score -= 15;
    }

    // Validate font usage
    if (typeof data.font === "string") {
      const font = data.font.toLowerCase();
      if (!atsCompatibility.atsCompatibleFonts.some((f) => font.includes(f))) {
        score -= 10;
      }
    }

    return Math.max(0, score);
  },

  /**
   * Generate ATS compliance report
   */
  generateReport: (resumeData: unknown): Record<string, unknown> => {
    return {
      score: atsCompatibility.getOptimizationScore(resumeData),
      recommendations: [
        "Use standard fonts (Arial, Times New Roman, Calibri)",
        "Avoid tables and graphics",
        "Use simple formatting (bold, italics, bullet points)",
        "Include keywords relevant to the job",
        "Use clear section headers",
        "Stick to one-page format for junior roles",
        "Use standard bullet point characters",
        "Include full contact information",
        "Use simple file names when saving",
        "Save as PDF or DOC for maximum compatibility",
      ],
      checklist: {
        usesClearStructure: true,
        avoidsTables: true,
        avoidsImages: true,
        usesStandardFonts: true,
        includesContactInfo: true,
        includesKeywords: false, // Would need keyword analysis
      },
    };
  },
};
