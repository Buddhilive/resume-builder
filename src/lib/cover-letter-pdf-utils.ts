import jsPDF from 'jspdf';

export interface CoverLetterPDFOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export async function exportCoverLetterToPDF(
  markdownContent: string,
  options: CoverLetterPDFOptions = {}
): Promise<void> {
  const {
    filename = 'cover-letter.pdf',
    format = 'a4',
    orientation = 'portrait',
    margins = { top: 20, bottom: 20, left: 20, right: 20 }
  } = options;

  try {
    // Create PDF instance
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });

    // Convert markdown to plain text for simple PDF generation
    // In a real implementation, you might want to use a proper markdown parser
    const plainText = markdownContent
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/`(.*?)`/g, '$1') // Remove code formatting
      .replace(/^\s*[-\*\+]\s/gm, '• ') // Convert markdown lists to bullet points
      .trim();

    // Calculate page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const textWidth = pageWidth - margins.left - margins.right;

    // Set font
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    // Split text into lines that fit the page width
    const lines = pdf.splitTextToSize(plainText, textWidth);
    
    let yPosition = margins.top;
    const lineHeight = 5;

    lines.forEach((line: string) => {
      // Check if we need a new page
      if (yPosition + lineHeight > pageHeight - margins.bottom) {
        pdf.addPage();
        yPosition = margins.top;
      }

      pdf.text(line, margins.left, yPosition);
      yPosition += lineHeight;
    });

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating cover letter PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}