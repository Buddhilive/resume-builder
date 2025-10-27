"use client";

/**
 * Enhanced Editor Page with ATS Validator Integration
 * This is an example of how to integrate the ATS validator component
 * into your Puck editor for real-time ATS scoring.
 */

import React, { useState } from "react";
import { Puck, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/lib/puck-config";
import { ATSValidator } from "@/components/ats-validator";

/**
 * Optional: Enhanced Editor with ATS Validator
 * To use this version instead:
 * 1. Replace the current editor page with this code
 * 2. Uncomment the ATSValidator component
 * 3. Adjust the layout as needed
 */
export const EnhancedEditorExample = () => {
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
            "Results-driven Software Engineer with 5+ years of experience building scalable web applications. Proven expertise in React, TypeScript, and cloud technologies.",
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
                "Led development of customer-facing features. Architected microservices infrastructure.",
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
              items: "JavaScript, TypeScript, Python, SQL",
            },
            {
              category: "Frontend",
              items: "React, Next.js, Tailwind CSS",
            },
          ],
        },
      },
    ],
    root: {},
  });

  const [atsScore, setAtsScore] = useState(100);

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      {/* Top Toolbar with ATS Validator */}
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="max-w-sm">
          <ATSValidator resumeData={data} onScoreChange={setAtsScore} />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          ATS Score: {atsScore}% | Your resume is optimized for Applicant
          Tracking Systems
        </p>
      </div>

      {/* Main Editor */}
      <div className="flex flex-1 gap-0">
        <Puck
          config={puckConfig as Config}
          data={data}
          onPublish={(publishData) => {
            setData(publishData);
            console.log("Resume saved:", publishData);
          }}
        />
      </div>
    </div>
  );
};

export default EnhancedEditorExample;
