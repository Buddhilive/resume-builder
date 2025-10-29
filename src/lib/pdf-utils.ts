"use client";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ColorConverter } from './color-converter';

export interface PDFOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  scale?: number;
  margins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface ResumeData {
  content: Array<{
    type: string;
    props: Record<string, unknown>;
  }>;
  root?: Record<string, unknown>;
}

export interface ExperienceItem {
  jobTitle?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface EducationItem {
  degree?: string;
  school?: string;
  field?: string;
  graduationDate?: string;
  gpa?: string;
}

export interface SkillItem {
  category?: string;
  items?: string;
}

export interface CertificationItem {
  name?: string;
  issuer?: string;
  date?: string;
}

export interface ComponentProps {
  // Header props
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  
  // Common props
  title?: string;
  content?: string;
  
  // Experience props
  experiences?: ExperienceItem[];
  
  // Education props
  education?: EducationItem[];
  
  // Skills props
  skills?: SkillItem[];
  
  // Certifications props
  certifications?: CertificationItem[];
}

export class PDFExporter {
  private static readonly DEFAULT_OPTIONS: Required<PDFOptions> = {
    filename: 'resume.pdf',
    format: 'a4',
    orientation: 'portrait',
    quality: 1.0,
    scale: 2,
    margins: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
    },
  };

  /**
   * Export an HTML element to PDF
   */
  static async exportElementToPDF(
    element: HTMLElement,
    options: Partial<PDFOptions> = {}
  ): Promise<void> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };

    // Store original styles for restoration
    let injectedStyleElement: HTMLStyleElement | null = null;
    let originalStyles: Map<HTMLElement, string> = new Map();

    try {
      // Show loading state
      this.showLoadingState(true);

      // Apply color conversion to the original element (temporarily)
      const conversionResult = await this.convertColorsInElement(element);
      injectedStyleElement = conversionResult.injectedStyleElement;
      originalStyles = conversionResult.originalStyles;

      // Create high-quality canvas from the element
      console.log('Starting html2canvas conversion...');
      console.log('Element dimensions:', {
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight,
        offsetWidth: element.offsetWidth,
        offsetHeight: element.offsetHeight
      });

      const canvas = await html2canvas(element, {
        scale: config.scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: true, // Enable logging for debugging
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        ignoreElements: (element) => {
          // Ignore loading overlays and modals
          return element.id === 'pdf-export-loader' || 
                 element.classList.contains('modal') ||
                 element.classList.contains('overlay');
        },
        onclone: (clonedDoc, element) => {
          console.log('html2canvas cloned document successfully');
          // Apply any additional fixes to the cloned document if needed
          const clonedElement = clonedDoc.querySelector('[data-puck-root]') || element;
          console.log('Found cloned element:', clonedElement);
          return clonedElement;
        }
      });

      console.log('html2canvas conversion completed. Canvas dimensions:', {
        width: canvas.width,
        height: canvas.height
      });

      // Calculate PDF dimensions
      const { pdfWidth, pdfHeight } = this.calculatePDFDimensions(config.format);
      
      // Create PDF instance
      const pdf = new jsPDF({
        orientation: config.orientation,
        unit: 'mm',
        format: config.format,
      });

      // Calculate image dimensions to fit the page with margins
      const availableWidth = pdfWidth - config.margins.left - config.margins.right;
      const availableHeight = pdfHeight - config.margins.top - config.margins.bottom;

      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * availableWidth) / canvas.width;

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/jpeg', config.quality);

      // Check if content fits on one page
      if (imgHeight <= availableHeight) {
        // Single page
        pdf.addImage(
          imgData,
          'JPEG',
          config.margins.left,
          config.margins.top,
          imgWidth,
          imgHeight
        );
      } else {
        // Multiple pages
        const pageCount = Math.ceil(imgHeight / availableHeight);
        const pageHeight = canvas.height / pageCount;

        for (let i = 0; i < pageCount; i++) {
          if (i > 0) pdf.addPage();

          // Create canvas for this page
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          
          if (pageCtx) {
            pageCanvas.width = canvas.width;
            pageCanvas.height = pageHeight;

            // Draw the portion of the original canvas for this page
            pageCtx.drawImage(
              canvas,
              0, i * pageHeight,
              canvas.width, pageHeight,
              0, 0,
              canvas.width, pageHeight
            );

            const pageImgData = pageCanvas.toDataURL('image/jpeg', config.quality);
            
            pdf.addImage(
              pageImgData,
              'JPEG',
              config.margins.left,
              config.margins.top,
              imgWidth,
              availableHeight
            );
          }
        }
      }

      // Add metadata
      pdf.setProperties({
        title: 'Resume',
        subject: 'Professional Resume',
        author: 'Resume Builder',
        creator: 'Resume Builder App',
      });

      // Save the PDF
      pdf.save(config.filename);

      console.log('PDF exported successfully:', config.filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      
      // Try a simpler approach if the main method fails
      console.log('Attempting fallback PDF export method...');
      try {
        await this.fallbackPDFExport(element, config);
        console.log('Fallback PDF export succeeded');
        return;
      } catch (fallbackError) {
        console.error('Fallback PDF export also failed:', fallbackError);
      }
      
      throw new Error('Failed to export PDF. Please try again.');
    } finally {
      // Cleanup: restore original styles and remove injected stylesheets
      this.restoreOriginalStyles(originalStyles);
      
      if (injectedStyleElement && injectedStyleElement.parentNode) {
        injectedStyleElement.parentNode.removeChild(injectedStyleElement);
        console.log('Removed injected stylesheet');
      }
      
      this.showLoadingState(false);
    }
  }

  /**
   * Fallback PDF export method with simpler html2canvas options
   */
  private static async fallbackPDFExport(element: HTMLElement, config: Required<PDFOptions>): Promise<void> {
    console.log('Using fallback PDF export method...');
    
    // Use simpler html2canvas options
    const canvas = await html2canvas(element, {
      scale: 1, // Lower scale for compatibility
      useCORS: true,
      allowTaint: true, // Allow tainted canvas
      backgroundColor: '#ffffff',
      logging: true,
      // Let html2canvas determine dimensions automatically
    });

    console.log('Fallback canvas created with dimensions:', {
      width: canvas.width,
      height: canvas.height
    });

    // Calculate PDF dimensions
    const { pdfWidth, pdfHeight } = this.calculatePDFDimensions(config.format);
    
    // Create PDF instance
    const pdf = new jsPDF({
      orientation: config.orientation,
      unit: 'mm',
      format: config.format,
    });

    // Calculate image dimensions to fit the page with margins
    const availableWidth = pdfWidth - config.margins.left - config.margins.right;
    const availableHeight = pdfHeight - config.margins.top - config.margins.bottom;

    const imgWidth = availableWidth;
    const imgHeight = (canvas.height * availableWidth) / canvas.width;

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/jpeg', config.quality);

    // Add image to PDF
    if (imgHeight <= availableHeight) {
      // Single page
      pdf.addImage(
        imgData,
        'JPEG',
        config.margins.left,
        config.margins.top,
        imgWidth,
        imgHeight
      );
    } else {
      // Multiple pages - simplified approach
      const pageCount = Math.ceil(imgHeight / availableHeight);
      const sourceHeight = canvas.height / pageCount;

      for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage();

        // Create canvas for this page
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        
        if (pageCtx) {
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;

          pageCtx.drawImage(
            canvas,
            0, i * sourceHeight,
            canvas.width, sourceHeight,
            0, 0,
            canvas.width, sourceHeight
          );

          const pageImgData = pageCanvas.toDataURL('image/jpeg', config.quality);
          
          pdf.addImage(
            pageImgData,
            'JPEG',
            config.margins.left,
            config.margins.top,
            imgWidth,
            availableHeight
          );
        }
      }
    }

    // Add metadata
    pdf.setProperties({
      title: 'Resume',
      subject: 'Professional Resume',
      author: 'Resume Builder',
      creator: 'Resume Builder App',
    });

    // Save the PDF
    pdf.save(config.filename);
  }

  /**
   * Export resume data to PDF by creating a temporary render
   */
  static async exportResumeDataToPDF(
    resumeData: ResumeData,
    options: Partial<PDFOptions> = {}
  ): Promise<void> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };

    try {
      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '8.5in';
      tempContainer.style.backgroundColor = 'rgb(255, 255, 255)';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = 'rgb(0, 0, 0)';
      tempContainer.style.padding = '40px';

      // Add print-specific styles
      const style = document.createElement('style');
      style.textContent = `
        .temp-resume-container {
          max-width: 8.5in;
          margin: 0 auto;
          background: rgb(255, 255, 255);
          color: rgb(0, 0, 0);
        }
        .temp-resume-container h1 {
          font-size: 24px;
          margin: 0 0 8px 0;
          font-weight: bold;
          color: rgb(0, 0, 0);
        }
        .temp-resume-container h2 {
          font-size: 16px;
          margin: 20px 0 10px 0;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: 1px solid rgb(51, 51, 51);
          padding-bottom: 2px;
          color: rgb(0, 0, 0);
        }
        .temp-resume-container .contact-info {
          margin-bottom: 20px;
          font-size: 11px;
          color: rgb(0, 0, 0);
        }
        .temp-resume-container .experience-item {
          margin-bottom: 15px;
        }
        .temp-resume-container .experience-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-weight: bold;
          color: rgb(0, 0, 0);
        }
        .temp-resume-container .experience-description {
          margin-left: 0;
          white-space: pre-line;
          color: rgb(0, 0, 0);
        }
        .temp-resume-container .skills-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .temp-resume-container .skill-category {
          margin-bottom: 8px;
        }
        .temp-resume-container .skill-category strong {
          font-weight: bold;
          color: rgb(0, 0, 0);
        }
      `;
      document.head.appendChild(style);

      // Generate HTML content from resume data
      const htmlContent = this.generateHTMLFromResumeData(resumeData);
      tempContainer.innerHTML = `<div class="temp-resume-container">${htmlContent}</div>`;

      // Add to DOM temporarily
      document.body.appendChild(tempContainer);

      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 100));

      // Export to PDF
      await this.exportElementToPDF(tempContainer, config);

      // Cleanup
      document.body.removeChild(tempContainer);
      document.head.removeChild(style);
    } catch (error) {
      console.error('Error exporting resume data to PDF:', error);
      throw error;
    }
  }

  /**
   * Generate HTML from resume data
   */
  private static generateHTMLFromResumeData(resumeData: ResumeData): string {
    if (!resumeData?.content) return '';

    let html = '';

    resumeData.content.forEach((component) => {
      switch (component.type) {
        case 'ResumeHeader':
          html += this.generateHeaderHTML(component.props);
          break;
        case 'ResumeSummary':
          html += this.generateSummaryHTML(component.props);
          break;
        case 'ResumeExperience':
          html += this.generateExperienceHTML(component.props);
          break;
        case 'ResumeEducation':
          html += this.generateEducationHTML(component.props);
          break;
        case 'ResumeSkills':
          html += this.generateSkillsHTML(component.props);
          break;
        case 'ResumeCertifications':
          html += this.generateCertificationsHTML(component.props);
          break;
      }
    });

    return html;
  }

  private static generateHeaderHTML(props: ComponentProps): string {
    return `
      <div class="header-section">
        <h1>${props.fullName || ''}</h1>
        <div class="contact-info">
          ${props.email ? `${props.email}` : ''}
          ${props.phone ? ` • ${props.phone}` : ''}
          ${props.location ? ` • ${props.location}` : ''}
          ${props.website ? ` • ${props.website}` : ''}
          ${props.linkedin ? ` • ${props.linkedin}` : ''}
        </div>
      </div>
    `;
  }

  private static generateSummaryHTML(props: ComponentProps): string {
    return `
      <div class="summary-section">
        <h2>${props.title || 'Professional Summary'}</h2>
        <p>${props.content || ''}</p>
      </div>
    `;
  }

  private static generateExperienceHTML(props: ComponentProps): string {
    let html = `<div class="experience-section"><h2>${props.title || 'Work Experience'}</h2>`;
    
    if (props.experiences && Array.isArray(props.experiences)) {
      props.experiences.forEach((exp) => {
        html += `
          <div class="experience-item">
            <div class="experience-header">
              <div>
                <strong>${exp.jobTitle || ''}</strong>
                ${exp.company ? ` - ${exp.company}` : ''}
                ${exp.location ? `, ${exp.location}` : ''}
              </div>
              <div>${exp.startDate || ''} - ${exp.endDate || ''}</div>
            </div>
            <div class="experience-description">${exp.description || ''}</div>
          </div>
        `;
      });
    }
    
    html += '</div>';
    return html;
  }

  private static generateEducationHTML(props: ComponentProps): string {
    let html = `<div class="education-section"><h2>${props.title || 'Education'}</h2>`;
    
    if (props.education && Array.isArray(props.education)) {
      props.education.forEach((edu) => {
        html += `
          <div class="education-item">
            <div class="experience-header">
              <div>
                <strong>${edu.degree || ''}</strong>
                ${edu.field ? ` in ${edu.field}` : ''}
                ${edu.school ? ` - ${edu.school}` : ''}
              </div>
              <div>${edu.graduationDate || ''}</div>
            </div>
            ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
          </div>
        `;
      });
    }
    
    html += '</div>';
    return html;
  }

  private static generateSkillsHTML(props: ComponentProps): string {
    let html = `<div class="skills-section"><h2>${props.title || 'Skills'}</h2>`;
    
    if (props.skills && Array.isArray(props.skills)) {
      html += '<div class="skills-grid">';
      props.skills.forEach((skill) => {
        html += `
          <div class="skill-category">
            <strong>${skill.category || ''}:</strong> ${skill.items || ''}
          </div>
        `;
      });
      html += '</div>';
    }
    
    html += '</div>';
    return html;
  }

  private static generateCertificationsHTML(props: ComponentProps): string {
    let html = `<div class="certifications-section"><h2>${props.title || 'Certifications'}</h2>`;
    
    if (props.certifications && Array.isArray(props.certifications)) {
      props.certifications.forEach((cert) => {
        html += `
          <div class="certification-item">
            <div class="experience-header">
              <div><strong>${cert.name || ''}</strong> - ${cert.issuer || ''}</div>
              <div>${cert.date || ''}</div>
            </div>
          </div>
        `;
      });
    }
    
    html += '</div>';
    return html;
  }

  /**
   * Calculate PDF dimensions based on format
   */
  private static calculatePDFDimensions(format: 'a4' | 'letter'): { pdfWidth: number; pdfHeight: number } {
    if (format === 'a4') {
      return { pdfWidth: 210, pdfHeight: 297 }; // A4 in mm
    } else {
      return { pdfWidth: 215.9, pdfHeight: 279.4 }; // Letter in mm
    }
  }

  /**
   * Show/hide loading state
   */
  private static showLoadingState(show: boolean): void {
    const existingLoader = document.getElementById('pdf-export-loader');
    
    if (show && !existingLoader) {
      const loader = document.createElement('div');
      loader.id = 'pdf-export-loader';
      loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-family: Arial, sans-serif;
      `;
      loader.innerHTML = `
        <div style="text-align: center;">
          <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
          <div>Generating PDF...</div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      document.body.appendChild(loader);
    } else if (!show && existingLoader) {
      document.body.removeChild(existingLoader);
    }
  }

  /**
   * Get optimal PDF settings for resume
   */
  static getResumeOptimalSettings(): Partial<PDFOptions> {
    return {
      format: 'a4',
      orientation: 'portrait',
      quality: 0.9,
      scale: 2,
      margins: {
        top: 15,
        bottom: 15,
        left: 15,
        right: 15,
      },
    };
  }

  /**
   * Convert modern CSS color functions to RGB in an element and its children
   * This ensures compatibility with html2canvas for PDF export
   */
  private static async convertColorsInElement(element: HTMLElement): Promise<{
    injectedStyleElement: HTMLStyleElement | null;
    originalStyles: Map<HTMLElement, string>;
  }> {
    const originalStyles = new Map<HTMLElement, string>();
    
    try {
      console.log('Starting color conversion for PDF export...');
      
      // Store and convert inline styles
      this.convertInlineStyles(element, originalStyles);

      // Convert all child elements
      const allElements = element.querySelectorAll('*');
      console.log(`Converting colors in ${allElements.length} child elements`);
      
      allElements.forEach((child) => {
        if (child instanceof HTMLElement) {
          this.convertInlineStyles(child, originalStyles);
        }
      });

      // Create and inject a style element with converted colors from CSS variables
      const convertedStyleElement = this.createConvertedStyleSheet();
      if (convertedStyleElement) {
        document.head.appendChild(convertedStyleElement);
        console.log('Injected converted CSS variables stylesheet');
      }

      console.log('Color conversion completed successfully for PDF export');
      
      return {
        injectedStyleElement: convertedStyleElement,
        originalStyles
      };
    } catch (error) {
      console.warn('Error during color conversion:', error);
      // Continue with export even if color conversion fails
      return {
        injectedStyleElement: null,
        originalStyles
      };
    }
  }

  /**
   * Convert inline styles for a single element
   */
  private static convertInlineStyles(element: HTMLElement, originalStyles?: Map<HTMLElement, string>): void {
    const style = element.style;
    const stylesToConvert = [
      'color', 'backgroundColor', 'background', 'borderColor', 
      'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
      'outline', 'outlineColor', 'textDecorationColor', 'boxShadow', 'textShadow'
    ];

    let conversionsApplied = 0;

    // Store original style if map is provided
    if (originalStyles && !originalStyles.has(element)) {
      originalStyles.set(element, element.getAttribute('style') || '');
    }

    stylesToConvert.forEach(property => {
      const value = style.getPropertyValue(property);
      if (value) {
        const convertedValue = ColorConverter.parseAndConvertToRgb(value);
        if (convertedValue !== value) {
          style.setProperty(property, convertedValue);
          conversionsApplied++;
          console.log(`Converted ${property}: ${value} → ${convertedValue}`);
        }
      }
    });

    if (conversionsApplied > 0) {
      console.log(`Applied ${conversionsApplied} color conversions to element`);
    }
  }

  /**
   * Restore original styles to elements
   */
  private static restoreOriginalStyles(originalStyles: Map<HTMLElement, string>): void {
    try {
      console.log(`Restoring original styles for ${originalStyles.size} elements`);
      
      originalStyles.forEach((originalStyle, element) => {
        if (originalStyle) {
          element.setAttribute('style', originalStyle);
        } else {
          element.removeAttribute('style');
        }
      });
      
      console.log('Original styles restored successfully');
    } catch (error) {
      console.warn('Error restoring original styles:', error);
    }
  }

  /**
   * Create a style element with converted CSS variables and common styles
   */
  private static createConvertedStyleSheet(): HTMLStyleElement | null {
    try {
      const styleElement = document.createElement('style');
      
      // Define converted CSS variables based on the current theme
      const convertedCSS = `
        :root {
          --background: rgb(255, 255, 255);
          --foreground: rgb(9, 9, 11);
          --card: rgb(255, 255, 255);
          --card-foreground: rgb(9, 9, 11);
          --popover: rgb(255, 255, 255);
          --popover-foreground: rgb(9, 9, 11);
          --primary: rgb(24, 24, 27);
          --primary-foreground: rgb(250, 250, 250);
          --secondary: rgb(244, 244, 245);
          --secondary-foreground: rgb(24, 24, 27);
          --muted: rgb(244, 244, 245);
          --muted-foreground: rgb(113, 113, 122);
          --accent: rgb(244, 244, 245);
          --accent-foreground: rgb(24, 24, 27);
          --destructive: rgb(239, 68, 68);
          --destructive-foreground: rgb(248, 250, 252);
          --border: rgb(228, 228, 231);
          --input: rgb(228, 228, 231);
          --ring: rgb(147, 197, 253);
          --chart-1: rgb(220, 38, 127);
          --chart-2: rgb(255, 206, 84);
          --chart-3: rgb(54, 162, 235);
          --chart-4: rgb(255, 99, 132);
          --chart-5: rgb(153, 102, 255);
        }

        /* Convert common Tailwind utilities that might use modern color functions */
        .bg-background { background-color: rgb(255, 255, 255) !important; }
        .text-foreground { color: rgb(9, 9, 11) !important; }
        .bg-card { background-color: rgb(255, 255, 255) !important; }
        .text-card-foreground { color: rgb(9, 9, 11) !important; }
        .bg-primary { background-color: rgb(24, 24, 27) !important; }
        .text-primary { color: rgb(24, 24, 27) !important; }
        .text-primary-foreground { color: rgb(250, 250, 250) !important; }
        .bg-secondary { background-color: rgb(244, 244, 245) !important; }
        .text-secondary { color: rgb(244, 244, 245) !important; }
        .text-secondary-foreground { color: rgb(24, 24, 27) !important; }
        .bg-muted { background-color: rgb(244, 244, 245) !important; }
        .text-muted { color: rgb(244, 244, 245) !important; }
        .text-muted-foreground { color: rgb(113, 113, 122) !important; }
        .bg-accent { background-color: rgb(244, 244, 245) !important; }
        .text-accent { color: rgb(244, 244, 245) !important; }
        .text-accent-foreground { color: rgb(24, 24, 27) !important; }
        .bg-destructive { background-color: rgb(239, 68, 68) !important; }
        .text-destructive { color: rgb(239, 68, 68) !important; }
        .text-destructive-foreground { color: rgb(248, 250, 252) !important; }
        .border-border { border-color: rgb(228, 228, 231) !important; }
        .border-input { border-color: rgb(228, 228, 231) !important; }
        .ring-ring { --tw-ring-color: rgb(147, 197, 253) !important; }

        /* Common text colors */
        .text-black { color: rgb(0, 0, 0) !important; }
        .text-white { color: rgb(255, 255, 255) !important; }
        .text-gray-50 { color: rgb(249, 250, 251) !important; }
        .text-gray-100 { color: rgb(243, 244, 246) !important; }
        .text-gray-200 { color: rgb(229, 231, 235) !important; }
        .text-gray-300 { color: rgb(209, 213, 219) !important; }
        .text-gray-400 { color: rgb(156, 163, 175) !important; }
        .text-gray-500 { color: rgb(107, 114, 128) !important; }
        .text-gray-600 { color: rgb(75, 85, 99) !important; }
        .text-gray-700 { color: rgb(55, 65, 81) !important; }
        .text-gray-800 { color: rgb(31, 41, 55) !important; }
        .text-gray-900 { color: rgb(17, 24, 39) !important; }

        /* Common background colors */
        .bg-white { background-color: rgb(255, 255, 255) !important; }
        .bg-black { background-color: rgb(0, 0, 0) !important; }
        .bg-gray-50 { background-color: rgb(249, 250, 251) !important; }
        .bg-gray-100 { background-color: rgb(243, 244, 246) !important; }
        .bg-gray-200 { background-color: rgb(229, 231, 235) !important; }

        /* Ensure all text is properly colored for PDF */
        * {
          color-scheme: normal !important;
        }
      `;

      styleElement.textContent = convertedCSS;
      return styleElement;
    } catch (error) {
      console.warn('Error creating converted stylesheet:', error);
      return null;
    }
  }
}

export default PDFExporter;