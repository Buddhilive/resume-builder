"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { usePDFExport } from '@/hooks/use-pdf-export';
import { FileText, Loader2 } from 'lucide-react';

// Test component for PDF export functionality
export const PDFExportTestButton: React.FC = () => {
  const { isExporting, exportError, exportFromData, clearError } = usePDFExport();

  const testData = {
    content: [
      {
        type: "ResumeHeader",
        props: {
          id: "header-test",
          fullName: "Jane Doe",
          email: "jane.doe@email.com",
          phone: "+1 (555) 987-6543",
          location: "New York, NY",
          website: "www.janedoe.com",
          linkedin: "linkedin.com/in/janedoe",
        },
      },
      {
        type: "ResumeSummary",
        props: {
          id: "summary-test",
          title: "PROFESSIONAL SUMMARY",
          content: "Experienced Software Engineer with 7+ years of experience in full-stack development. Expertise in React, Node.js, and cloud technologies. Proven track record of leading teams and delivering scalable solutions.",
        },
      },
      {
        type: "ResumeExperience",
        props: {
          id: "experience-test",
          title: "WORK EXPERIENCE",
          experiences: [
            {
              jobTitle: "Senior Software Engineer",
              company: "Tech Solutions Inc",
              location: "New York, NY",
              startDate: "Mar 2021",
              endDate: "Present",
              description: "• Lead a team of 5 developers in building scalable web applications\n• Implemented CI/CD pipelines reducing deployment time by 60%\n• Architected microservices handling 1M+ requests per day",
            },
          ],
        },
      },
    ],
    root: {},
  };

  const handleTestExport = async () => {
    clearError();
    try {
      await exportFromData(testData, {
        filename: 'test-resume.pdf',
        format: 'a4',
        orientation: 'portrait',
      });
    } catch (error) {
      console.error('Test export failed:', error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleTestExport}
        disabled={isExporting}
        variant="outline"
        className="flex items-center gap-2"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        {isExporting ? "Generating PDF..." : "Test PDF Export"}
      </Button>
      
      {exportError && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          Error: {exportError}
          <Button
            onClick={clearError}
            variant="ghost"
            size="sm"
            className="ml-2 h-auto p-1"
          >
            ✕
          </Button>
        </div>
      )}
    </div>
  );
};

export default PDFExportTestButton;