/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResumeDocument } from "../db";

export interface AISession {
  destroy?: () => void;
  write: (prompt: string, options?: any) => Promise<string>;
  writeStreaming: (prompt: string, options?: any) => AsyncIterable<string>;
  summarize: (text: string, options?: any) => Promise<string>;
}

export interface WriterOptions {
  tone?: 'formal' | 'neutral' | 'casual';
  format?: 'markdown' | 'plain-text';
  length?: 'short' | 'medium' | 'long';
  sharedContext?: string;
  expectedInputLanguages?: string[];
  expectedContextLanguages?: string[];
  outputLanguage?: string;
}

export interface CoverLetterWriteRequest {
  jobDescription: string;
  resumeDocument: ResumeDocument;
  options?: WriterOptions;
}

export interface WriterProgress {
  loaded: number;
  total: number;
}

export type ProgressCallback = (progress: WriterProgress) => void;

/**
 * Summarizes resume content using the Summarizer API
 */
export async function summarizeResumeContent(
  resumeDocument: ResumeDocument,
  progressCallback?: ProgressCallback
): Promise<string> {
  try {
    if (!('Summarizer' in window)) {
      throw new Error('Summarizer API is not available');
    }

    // Check availability
    const availability = await (window as any).Summarizer.availability();
    if (availability === 'unavailable') {
      throw new Error('Summarizer API is not available');
    }

    // Create summarizer with options
    const summarizer = await (window as any).Summarizer.create({
      type: 'key-points',
      format: 'plain-text',
      length: 'medium',
      sharedContext: 'This is a professional resume that needs to be summarized for context in cover letter generation.',
      monitor: progressCallback ? (m: any) => {
        m.addEventListener('downloadprogress', (e: any) => {
          progressCallback({
            loaded: e.loaded || 0,
            total: 1
          });
        });
      } : undefined
    });

    // Extract text content from resume data
    const resumeText = extractResumeText(resumeDocument);
    
    // Summarize the resume content
    const summary = await summarizer.summarize(resumeText, {
      context: `Professional resume for ${resumeDocument.name}. Focus on key skills, experience, and qualifications.`
    });

    // Clean up
    if (summarizer.destroy) {
      summarizer.destroy();
    }

    return summary;
  } catch (error) {
    console.error('Resume summarization failed:', error);
    throw new Error(
      error instanceof Error 
        ? `Resume summarization failed: ${error.message}`
        : 'Resume summarization failed'
    );
  }
}

/**
 * Creates AI sessions with user gesture (must be called from user interaction)
 */
export async function createAISessions(progressCallback?: ProgressCallback): Promise<{
  writer: AISession;
  summarizer: AISession;
}> {
  try {
    // Check Writer availability
    if (!('Writer' in window)) {
      throw new Error('Writer API is not available');
    }
    
    // Check Summarizer availability
    if (!('Summarizer' in window)) {
      throw new Error('Summarizer API is not available');
    }

    const writerAvailability = await (window as any).Writer.availability();
    const summarizerAvailability = await (window as any).Summarizer.availability();

    if (writerAvailability === 'unavailable') {
      throw new Error('Writer API is not available');
    }
    
    if (summarizerAvailability === 'unavailable') {
      throw new Error('Summarizer API is not available');
    }

    progressCallback?.({ loaded: 10, total: 100 });

    // Create both sessions with user gesture
    const [writer, summarizer] = await Promise.all([
      (window as any).Writer.create({
        tone: 'formal',
        format: 'markdown',
        length: 'medium',
        sharedContext: 'This is a professional cover letter for a job application. The letter should be personalized, engaging, and highlight relevant qualifications from the applicant\'s resume.',
        expectedInputLanguages: ['en'],
        expectedContextLanguages: ['en'],
        outputLanguage: 'en',
        monitor: progressCallback ? (m: any) => {
          m.addEventListener('downloadprogress', (e: any) => {
            progressCallback({
              loaded: 10 + (e.loaded * 30),
              total: 100
            });
          });
        } : undefined
      }),
      (window as any).Summarizer.create({
        type: 'key-points',
        format: 'plain-text',
        length: 'medium',
        sharedContext: 'This is a professional resume that needs to be summarized for context in cover letter generation.',
        monitor: progressCallback ? (m: any) => {
          m.addEventListener('downloadprogress', (e: any) => {
            progressCallback({
              loaded: 40 + (e.loaded * 20),
              total: 100
            });
          });
        } : undefined
      })
    ]);

    progressCallback?.({ loaded: 60, total: 100 });

    return { writer, summarizer };
  } catch (error) {
    console.error('Failed to create AI sessions:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to create AI sessions: ${error.message}`
        : 'Failed to create AI sessions'
    );
  }
}

/**
 * Generates a cover letter using pre-created AI sessions
 */
export async function generateCoverLetter(
  request: CoverLetterWriteRequest,
  writer: AISession,
  summarizer: AISession,
  progressCallback?: ProgressCallback
): Promise<string> {
  try {
    progressCallback?.({ loaded: 60, total: 100 });

    // Extract and summarize the resume content
    const resumeText = extractResumeText(request.resumeDocument);
    
    progressCallback?.({ loaded: 70, total: 100 });

    const resumeSummary = await summarizer.summarize(resumeText, {
      context: `Professional resume for ${request.resumeDocument.name}. Focus on key skills, experience, and qualifications.`
    });

    progressCallback?.({ loaded: 80, total: 100 });

    // Generate the cover letter
    const prompt = `Write a professional cover letter for the following job position: "${request.jobDescription}". 
    
Use the following resume summary as context for the applicant's qualifications:
${resumeSummary}

The cover letter should:
- Be personalized and engaging
- Highlight relevant skills and experience from the resume
- Show enthusiasm for the position
- Be professional in tone
- Include a strong opening and closing
- Be formatted in markdown`;

    const coverLetter = await writer.write(prompt, {
      context: `Applicant's resume summary: ${resumeSummary}. Job description: ${request.jobDescription}`
    });

    progressCallback?.({ loaded: 100, total: 100 });

    return coverLetter;
  } catch (error) {
    console.error('Cover letter generation failed:', error);
    throw new Error(
      error instanceof Error 
        ? `Cover letter generation failed: ${error.message}`
        : 'Cover letter generation failed'
    );
  }
}

/**
 * Generates a cover letter with streaming output using pre-created AI sessions
 */
export async function generateCoverLetterStreaming(
  request: CoverLetterWriteRequest,
  writer: AISession,
  summarizer: AISession,
  onChunk: (chunk: string) => void,
  progressCallback?: ProgressCallback
): Promise<void> {
  try {
    progressCallback?.({ loaded: 60, total: 100 });

    // Extract and summarize the resume content
    const resumeText = extractResumeText(request.resumeDocument);
    
    progressCallback?.({ loaded: 70, total: 100 });

    const resumeSummary = await summarizer.summarize(resumeText, {
      context: `Professional resume for ${request.resumeDocument.name}. Focus on key skills, experience, and qualifications.`
    });

    progressCallback?.({ loaded: 80, total: 100 });

    // Generate the cover letter with streaming
    const prompt = `Write a professional cover letter for the following job position: "${request.jobDescription}". 
    
Use the following resume summary as context for the applicant's qualifications:
${resumeSummary}

The cover letter should:
- Be personalized and engaging
- Highlight relevant skills and experience from the resume
- Show enthusiasm for the position
- Be professional in tone
- Include a strong opening and closing
- Be formatted in markdown`;

    const stream = writer.writeStreaming(prompt, {
      context: `Applicant's resume summary: ${resumeSummary}. Job description: ${request.jobDescription}`
    });

    let progress = 80;
    for await (const chunk of stream) {
      onChunk(chunk);
      progress = Math.min(95, progress + 1); // Gradually increase progress
      progressCallback?.({ loaded: progress, total: 100 });
    }

    progressCallback?.({ loaded: 100, total: 100 });
  } catch (error) {
    console.error('Streaming cover letter generation failed:', error);
    throw new Error(
      error instanceof Error 
        ? `Streaming cover letter generation failed: ${error.message}`
        : 'Streaming cover letter generation failed'
    );
  }
}

/**
 * Extracts text content from resume document data
 */
function extractResumeText(resumeDocument: ResumeDocument): string {
  const data = resumeDocument.data;
  const sections: string[] = [];

  if (!data?.content || !Array.isArray(data.content)) {
    return `Resume: ${resumeDocument.name}`;
  }

  // Process each component in the resume
  data.content.forEach((component) => {
    if (!component?.props) return;

    switch (component.type) {
      case 'ResumeHeader':
        // Extract personal information
        const { fullName, email, phone, location, website, linkedin } = component.props as any;
        if (fullName) sections.push(`Name: ${fullName}`);
        if (email) sections.push(`Email: ${email}`);
        if (phone) sections.push(`Phone: ${phone}`);
        if (location) sections.push(`Location: ${location}`);
        if (website) sections.push(`Website: ${website}`);
        if (linkedin) sections.push(`LinkedIn: ${linkedin}`);
        break;

      case 'ResumeSummary':
        // Extract summary/objective
        const { title: summaryTitle, content } = component.props as any;
        if (content) {
          sections.push(`\n${summaryTitle || 'Summary'}: ${content}`);
        }
        break;

      case 'ResumeExperience':
        // Extract work experience
        const { title: expTitle, experiences } = component.props as any;
        if (experiences && Array.isArray(experiences) && experiences.length > 0) {
          sections.push(`\n${expTitle || 'Work Experience'}:`);
          experiences.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              sections.push(`- ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})`);
              if (exp.location) {
                sections.push(`  Location: ${exp.location}`);
              }
              if (exp.description) {
                sections.push(`  ${exp.description}`);
              }
            }
          });
        }
        break;

      case 'ResumeEducation':
        // Extract education
        const { title: eduTitle, education } = component.props as any;
        if (education && Array.isArray(education) && education.length > 0) {
          sections.push(`\n${eduTitle || 'Education'}:`);
          education.forEach((edu: any) => {
            if (edu.degree && edu.school) {
              sections.push(`- ${edu.degree} from ${edu.school} (${edu.graduationDate || 'N/A'})`);
              if (edu.field) {
                sections.push(`  Field of Study: ${edu.field}`);
              }
              if (edu.gpa) {
                sections.push(`  GPA: ${edu.gpa}`);
              }
            }
          });
        }
        break;

      case 'ResumeSkills':
        // Extract skills
        const { title: skillsTitle, skills } = component.props as any;
        if (skills && Array.isArray(skills) && skills.length > 0) {
          sections.push(`\n${skillsTitle || 'Skills'}:`);
          skills.forEach((skill: any) => {
            if (skill.category && skill.items) {
              sections.push(`- ${skill.category}: ${skill.items}`);
            }
          });
        }
        break;

      case 'ResumeCertifications':
        // Extract certifications
        const { title: certTitle, certifications } = component.props as any;
        if (certifications && Array.isArray(certifications) && certifications.length > 0) {
          sections.push(`\n${certTitle || 'Certifications'}:`);
          certifications.forEach((cert: any) => {
            if (cert.name) {
              sections.push(`- ${cert.name}${cert.issuer ? ` from ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}`);
            }
          });
        }
        break;
    }
  });

  return sections.length > 0 ? sections.join('\n') : `Resume: ${resumeDocument.name}`;
}