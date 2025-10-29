"use client";

import { useState, useCallback } from 'react';
import { PDFExporter, PDFOptions, ResumeData } from '@/lib/pdf-utils';

export interface UsePDFExportReturn {
  isExporting: boolean;
  exportError: string | null;
  exportFromElement: (element: HTMLElement, options?: Partial<PDFOptions>) => Promise<void>;
  exportFromData: (data: ResumeData, options?: Partial<PDFOptions>) => Promise<void>;
  clearError: () => void;
}

export const usePDFExport = (): UsePDFExportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setExportError(null);
  }, []);

  const exportFromElement = useCallback(async (
    element: HTMLElement,
    options: Partial<PDFOptions> = {}
  ) => {
    setIsExporting(true);
    setExportError(null);

    try {
      const defaultOptions = PDFExporter.getResumeOptimalSettings();
      await PDFExporter.exportElementToPDF(element, { ...defaultOptions, ...options });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export PDF';
      setExportError(errorMessage);
      console.error('PDF export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const exportFromData = useCallback(async (
    data: ResumeData,
    options: Partial<PDFOptions> = {}
  ) => {
    setIsExporting(true);
    setExportError(null);

    try {
      const defaultOptions = PDFExporter.getResumeOptimalSettings();
      await PDFExporter.exportResumeDataToPDF(data, { ...defaultOptions, ...options });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export PDF';
      setExportError(errorMessage);
      console.error('PDF export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    isExporting,
    exportError,
    exportFromElement,
    exportFromData,
    clearError,
  };
};

export default usePDFExport;