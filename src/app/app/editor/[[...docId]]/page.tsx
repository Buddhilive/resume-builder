"use client";

import React, { useState } from "react";
import { Puck, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/lib/puck-config";
import { PreviewModal } from "@/components/preview-modal";
import { ATSValidator } from "@/components/ats-validator";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  Save, 
  Download, 
  FileText, 
  Settings, 
  Undo2, 
  Redo2
} from "lucide-react";

export default function EditorPage() {
  const [data, setData] = useState({
    content: [
      {
        type: "ResumeHeader",
        props: {
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
          title: "PROFESSIONAL SUMMARY",
          content:
            "Results-driven Software Engineer with 5+ years of experience building scalable web applications. Proven expertise in React, TypeScript, and cloud technologies. Strong track record of delivering high-impact solutions and mentoring junior developers.",
        },
      },
      {
        type: "ResumeExperience",
        props: {
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

  console.log("Current ATS Score:", atsScore); // Use the score

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Resume saved:", data);
    setIsSaving(false);
  };

  const handleExport = () => {
    // Export functionality
    console.log("Exporting resume...");
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
              <span className="text-sm text-gray-500">• Last saved 2 mins ago</span>
            </div>
          </div>

          {/* Center Section - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Undo2 className="h-4 w-4" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Redo2 className="h-4 w-4" />
              Redo
            </Button>
            <Separator orientation="vertical" className="h-6" />
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
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>

          {/* Right Section - Settings */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
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
      </div>

      {/* Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-white">
          <Puck
            config={puckConfig as Config}
            data={data}
            onPublish={(publishData) => {
              setData(publishData);
              console.log("Resume saved:", publishData);
            }}
            ui={{
              leftSideBarVisible: true,
              rightSideBarVisible: true,
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
