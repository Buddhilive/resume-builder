"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import {
  ResumeHeader,
  ResumeSummary,
  ResumeExperience,
  ResumeEducation,
  ResumeSkills,
  ResumeCertifications,
} from "@/components/resume-components";

interface ResumeData {
  content: Array<{
    type: string;
    props: Record<string, unknown>;
  }>;
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const renderComponent = (component: { type: string; props: Record<string, unknown> }, index: number) => {
    switch (component.type) {
      case "ResumeHeader":
        return <ResumeHeader key={index} {...component.props} />;
      case "ResumeSummary":
        return <ResumeSummary key={index} {...component.props} />;
      case "ResumeExperience":
        return <ResumeExperience key={index} {...component.props} />;
      case "ResumeEducation":
        return <ResumeEducation key={index} {...component.props} />;
      case "ResumeSkills":
        return <ResumeSkills key={index} {...component.props} />;
      case "ResumeCertifications":
        return <ResumeCertifications key={index} {...component.props} />;
      default:
        return null;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simplified version for download
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Resume</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: white; 
                color: black;
                line-height: 1.4;
              }
              .resume-container { 
                max-width: 8.5in; 
                margin: 0 auto; 
              }
              h1 { font-size: 24px; margin-bottom: 8px; }
              h2 { font-size: 16px; margin: 16px 0 8px 0; text-transform: uppercase; }
              .header-info { margin-bottom: 16px; }
              .experience-item { margin-bottom: 12px; }
              .experience-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
              .job-title { font-weight: bold; }
              .company { font-style: italic; }
              .date { font-weight: bold; }
              .location { color: #555; }
              @media print {
                body { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body>
            <div class="resume-container">
              ${document.querySelector('.resume-preview-content')?.innerHTML || ''}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume Preview
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                onClick={handlePrint}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Print/Save PDF
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-[8.5in] bg-white p-8 shadow-lg resume-preview-content">
            {data?.content?.map(renderComponent)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};