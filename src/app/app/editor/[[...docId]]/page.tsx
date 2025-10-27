"use client";

import React, { useState } from "react";
import { Puck, Config } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/lib/puck-config";

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

  return (
    <div className="flex h-full flex-1 gap-0">
      <Puck
        config={puckConfig as Config}
        data={data}
        onPublish={(publishData) => {
          setData(publishData);
          console.log("Resume saved:", publishData);
        }}
      />
    </div>
  );
}
