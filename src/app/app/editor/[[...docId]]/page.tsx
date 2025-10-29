"use client";

import React, { useState, useEffect } from "react";
import { Puck, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/lib/puck-config";
import { PreviewModal } from "@/components/preview-modal";
import { ATSValidator } from "@/components/ats-validator";
import { Button } from "@/components/ui/button";
import { usePDFExport } from "@/hooks/use-pdf-export";
import { 
  Eye, 
  Save, 
  Download, 
  FileText, 
  AlertCircle
} from "lucide-react";
import { ResumeData } from "@/lib/pdf-utils";

export default function EditorPage() {
  const [data, setData] = useState<ResumeData>({
    content: [
      {
        type: "ResumeHeader",
        props: {
          id: "header-1",
          fullName: "John Doe",
          email: "john.doe@email.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          website: "www.johndoe.com",
          linkedin: "linkedin.com/in/johndoe",
        },
      },
      {
        type: "ResumeSummary",
        props: {
          id: "summary-1",
          title: "PROFESSIONAL SUMMARY",
          content:
            "Results-driven Software Engineer with 5+ years of experience building scalable web applications. Proven expertise in React, TypeScript, and cloud technologies. Strong track record of delivering high-impact solutions and mentoring junior developers.",
        },
      },
      {
        type: "ResumeExperience",
        props: {
          id: "experience-1",
          title: "WORK EXPERIENCE",
          experiences: [
            {
              jobTitle: "Senior Full Stack Developer",
              company: "Tech Innovation Labs",
              location: "San Francisco, CA",
              startDate: "Jan 2022",
              endDate: "Present",
              description:
                "• Led development and deployment of customer-facing features used by 100K+ users\n• Architected and implemented microservices infrastructure using Node.js and TypeScript\n• Improved application performance by 40% through optimization and caching strategies\n• Mentored team of 3 junior developers and conducted code reviews",
            },
            {
              jobTitle: "Full Stack Developer",
              company: "Digital Solutions Inc",
              location: "San Francisco, CA",
              startDate: "Jun 2020",
              endDate: "Dec 2021",
              description:
                "• Developed responsive web applications using React and Next.js\n• Built RESTful APIs and database schemas using PostgreSQL\n                • Collaborated with cross-functional teams to deliver projects on time",
            },
          ],
        },
      },
      {
        type: "ResumeEducation",
        props: {
          id: "education-1",
          title: "EDUCATION",
          education: [
            {
              degree: "Bachelor of Science in Computer Science",
              school: "University of California, Berkeley",
              field: "Computer Science",
              graduationDate: "May 2020",
              gpa: "3.8",
            },
          ],
        },
      },
      {
        type: "ResumeSkills",
        props: {
          id: "skills-1",
          title: "SKILLS",
          skills: [
            {
              category: "Programming Languages",
              items: "JavaScript, TypeScript, Python, SQL, HTML, CSS",
            },
            {
              category: "Frontend Technologies",
              items: "React, Next.js, Tailwind CSS, Shadcn/ui, Redux",
            },
            {
              category: "Backend & Databases",
              items: "Node.js, Express, PostgreSQL, MongoDB, Firebase",
            },
            {
              category: "Tools & Platforms",
              items: "Git, Docker, AWS, GitHub, VS Code, Figma",
            },
          ],
        },
      },
      {
        type: "ResumeCertifications",
        props: {
          id: "certifications-1",
          title: "CERTIFICATIONS",
          certifications: [
            {
              name: "AWS Certified Solutions Architect - Associate",
              issuer: "Amazon Web Services",
              date: "2023",
            },
            {
              name: "Google Cloud Professional Data Engineer",
              issuer: "Google Cloud",
              date: "2022",
            },
          ],
        },
      },
    ],
    root: {},
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [atsScore, setAtsScore] = useState(85);
  const [lastSaved, setLastSaved] = useState(new Date());

  // PDF Export functionality
  const { isExporting, exportError, exportFromData, clearError } = usePDFExport();

  // Track changes for better debugging and analytics
  const [changeLog, setChangeLog] = useState<Array<{
    timestamp: number;
    action: string;
    componentType?: string;
    componentId?: string;
  }>>([]);

  // Log changes for debugging and analytics
  const logChange = (action: string, componentType?: string, componentId?: string) => {
    const logEntry = {
      timestamp: Date.now(),
      action,
      componentType,
      componentId,
    };
    setChangeLog(prev => [...prev, logEntry]);
    console.log("Resume change:", logEntry);
  };

  console.log("Current ATS Score:", atsScore);
  console.log("Total components:", data.content.length);

  // Effect to handle data changes and trigger ATS recalculation
  useEffect(() => {
    // This will trigger the ATS validator to recalculate when data changes
    // The ATSValidator component will automatically update the score via onScoreChange
    console.log("Resume data changed, components:", data.content.map(c => ({
      type: c.type,
      id: c.props?.id
    })));
  }, [data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation with actual data persistence logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update last saved time
      setLastSaved(new Date());
      
      // Log the save action
      logChange("save", undefined, undefined);
      
      console.log("Resume saved successfully:", {
        componentCount: data.content.length,
        timestamp: new Date().toISOString(),
        data
      });
      
      // Here you would typically make an API call to save the data
      // await saveResumeData(data);
      
    } catch (error) {
      console.error("Failed to save resume:", error);
      // Handle save error (show toast notification, etc.)
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    // Clear any previous errors
    clearError();
    
    // Export functionality with updated data
    logChange("export", undefined, undefined);
    console.log("Exporting resume with", data.content.length, "components");
    
    try {
      // Generate a filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `resume-${timestamp}.pdf`;
      
      await exportFromData(data, { 
        filename,
        format: 'a4',
        orientation: 'portrait'
      });
      
      console.log('PDF export completed successfully');
    } catch (error) {
      console.error('PDF export failed:', error);
      // Error is handled by the hook
    }
  };

  // Enhanced onChange handler to track component changes and deletions
  const handlePuckChange = (newData: typeof data) => {
    const previousContent = data.content;
    const newContent = newData.content;
    
    // Create detailed change summary
    const changeSummary = {
      previous: {
        count: previousContent.length,
        components: previousContent.map(c => ({ type: c.type, id: c.props?.id }))
      },
      new: {
        count: newContent.length,
        components: newContent.map(c => ({ type: c.type, id: c.props?.id }))
      },
      changes: [] as Array<{type: string, action: string, component?: string, id?: string}>
    };
    
    // Check for component deletions
    if (previousContent.length > newContent.length) {
      const deletedComponents = previousContent.filter(prevItem => 
        !newContent.some(newItem => newItem.props?.id === prevItem.props?.id)
      );
      
      deletedComponents.forEach(component => {
        const componentId = typeof component.props?.id === 'string' ? component.props.id : undefined;
        const changeInfo = {
          type: "component",
          action: "delete",
          component: component.type,
          id: componentId
        };
        changeSummary.changes.push(changeInfo);
        logChange("delete", component.type, componentId);
        console.log(`🗑️ Component deleted: ${component.type} (${componentId})`);
      });
    }
    
    // Check for component additions
    if (newContent.length > previousContent.length) {
      const addedComponents = newContent.filter(newItem => 
        !previousContent.some(prevItem => prevItem.props?.id === newItem.props?.id)
      );
      
      addedComponents.forEach(component => {
        const componentId = typeof component.props?.id === 'string' ? component.props.id : undefined;
        const changeInfo = {
          type: "component",
          action: "add",
          component: component.type,
          id: componentId
        };
        changeSummary.changes.push(changeInfo);
        logChange("add", component.type, componentId);
        console.log(`➕ Component added: ${component.type} (${componentId})`);
      });
    }
    
    // Check for component modifications (content or prop changes)
    newContent.forEach(newItem => {
      const correspondingPrevItem = previousContent.find(
        prevItem => prevItem.props?.id === newItem.props?.id
      );
      
      if (correspondingPrevItem) {
        // Deep comparison of props to detect changes
        const hasPropsChanged = JSON.stringify(correspondingPrevItem.props) !== JSON.stringify(newItem.props);
        
        if (hasPropsChanged) {
          const componentId = typeof newItem.props?.id === 'string' ? newItem.props.id : undefined;
          const changeInfo = {
            type: "component",
            action: "modify",
            component: newItem.type,
            id: componentId
          };
          changeSummary.changes.push(changeInfo);
          logChange("modify", newItem.type, componentId);
          console.log(`✏️ Component modified: ${newItem.type} (${componentId})`);
          
          // Log specific field changes for better debugging
          const prevProps = correspondingPrevItem.props as Record<string, unknown> || {};
          const newProps = newItem.props as Record<string, unknown> || {};
          const changedFields = Object.keys(newProps).filter(key => 
            JSON.stringify(prevProps[key]) !== JSON.stringify(newProps[key])
          );
          
          if (changedFields.length > 0) {
            console.log(`   Changed fields: ${changedFields.join(', ')}`);
          }
        }
      }
    });
    
    // Log overall change summary if there were any changes
    if (changeSummary.changes.length > 0) {
      console.log("📊 Change Summary:", changeSummary);
    }
    
    // Update the data state
    setData(newData);
    
    console.log('Resume data updated:', {
      totalComponents: newData.content.length,
      timestamp: new Date().toISOString(),
      hasChanges: changeSummary.changes.length > 0
    });
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Document Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-900">My Resume</span>
              <span className="text-sm text-gray-500">
                • Last saved {Math.floor((Date.now() - lastSaved.getTime()) / 60000) || 0} mins ago
                • {data.content.length} sections
              </span>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Recent changes indicator */}
            {changeLog.length > 0 && (
              <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                Last: {changeLog[changeLog.length - 1]?.action}
              </div>
            )}
            <Button
              onClick={() => setIsPreviewOpen(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        {/* ATS Validator Row */}
        <div className="mt-4">
          <ATSValidator 
            resumeData={data} 
            onScoreChange={setAtsScore}
          />
        </div>

        {/* PDF Export Error Display */}
        {exportError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{exportError}</span>
            <Button
              onClick={clearError}
              variant="ghost"
              size="sm"
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ✕
            </Button>
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-white">
          <Puck
            config={puckConfig as Config}
            data={data}
            onPublish={(publishData) => {
              handlePuckChange(publishData);
              handleSave(); // Auto-save on publish
              console.log("Resume published:", publishData);
            }}
            ui={{
              leftSideBarVisible: true,
              rightSideBarVisible: true,
            }}
            onChange={(newData) => {
              handlePuckChange(newData);
            }}
          />
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={data}
      />
    </div>
  );
}
