'use client';

import { useState, useCallback } from 'react';
import { exportCoverLetterToPDF, CoverLetterPDFOptions } from '@/lib/cover-letter-pdf-utils';

export function useCoverLetterPDFExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportFromContent = useCallback(async (
    markdownContent: string,
    options: CoverLetterPDFOptions = {}
  ) => {
    setIsExporting(true);
    setExportError(null);

    try {
      await exportCoverLetterToPDF(markdownContent, options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export PDF';
      setExportError(errorMessage);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setExportError(null);
  }, []);

  return {
    isExporting,
    exportError,
    exportFromContent,
    clearError,
  };
}