"use client";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

    try {
      // Show loading state
      this.showLoadingState(true);

      // Create high-quality canvas from the element
      const canvas = await html2canvas(element, {
        scale: config.scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
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
      throw new Error('Failed to export PDF. Please try again.');
    } finally {
      this.showLoadingState(false);
    }
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
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = 'black';
      tempContainer.style.padding = '40px';

      // Add print-specific styles
      const style = document.createElement('style');
      style.textContent = `
        .temp-resume-container {
          max-width: 8.5in;
          margin: 0 auto;
          background: white;
          color: black;
        }
        .temp-resume-container h1 {
          font-size: 24px;
          margin: 0 0 8px 0;
          font-weight: bold;
        }
        .temp-resume-container h2 {
          font-size: 16px;
          margin: 20px 0 10px 0;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: 1px solid #333;
          padding-bottom: 2px;
        }
        .temp-resume-container .contact-info {
          margin-bottom: 20px;
          font-size: 11px;
        }
        .temp-resume-container .experience-item {
          margin-bottom: 15px;
        }
        .temp-resume-container .experience-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .temp-resume-container .experience-description {
          margin-left: 0;
          white-space: pre-line;
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
}

export default PDFExporter;