"use client";

import React from "react";

// ATS-friendly Resume Header Component
export const ResumeHeader: React.FC<{
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
}> = ({
  fullName = "Your Name",
  email = "email@example.com",
  phone = "+1 (555) 123-4567",
  location = "City, State",
  website = "www.yourportfolio.com",
  linkedin = "linkedin.com/in/yourprofile",
}) => {
  return (
    <div className="mb-6 border-b-2 border-border pb-4">
      <h1 className="text-3xl font-bold text-foreground">{fullName}</h1>
      <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
        {email && <span>{email}</span>}
        {phone && <span>•</span>}
        {phone && <span>{phone}</span>}
        {location && <span>•</span>}
        {location && <span>{location}</span>}
      </div>
      <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
        {website && <span>{website}</span>}
        {linkedin && <span>•</span>}
        {linkedin && <span>{linkedin}</span>}
      </div>
    </div>
  );
};

// ATS-friendly Professional Summary Component
export const ResumeSummary: React.FC<{
  title?: string;
  content?: string;
}> = ({ title = "PROFESSIONAL SUMMARY", content = "" }) => {
  return (
    <div className="mb-6">
      <h2 className="mb-2 text-lg font-bold text-foreground">{title}</h2>
      <p className="text-sm leading-relaxed text-foreground">{content}</p>
    </div>
  );
};

// ATS-friendly Work Experience Component
export const ResumeExperience: React.FC<{
  title?: string;
  experiences?: Array<{
    jobTitle?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
}> = ({
  title = "WORK EXPERIENCE",
  experiences = [
    {
      jobTitle: "Senior Developer",
      company: "Tech Company",
      location: "City, State",
      startDate: "Jan 2022",
      endDate: "Present",
      description: "Led development of key features.",
    },
  ],
}) => {
  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-bold text-foreground">{title}</h2>
      {experiences?.map((exp, idx) => (
        <div key={idx} className="mb-4 text-sm text-foreground">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold text-foreground">{exp.jobTitle}</p>
              <p className="text-muted-foreground">{exp.company}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">
                {exp.startDate} - {exp.endDate}
              </p>
              <p className="text-muted-foreground">{exp.location}</p>
            </div>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
            {exp.description}
          </p>
        </div>
      ))}
    </div>
  );
};

// ATS-friendly Education Component
export const ResumeEducation: React.FC<{
  title?: string;
  education?: Array<{
    degree?: string;
    school?: string;
    field?: string;
    graduationDate?: string;
    gpa?: string;
  }>;
}> = ({
  title = "EDUCATION",
  education = [
    {
      degree: "Bachelor of Science",
      school: "University Name",
      field: "Computer Science",
      graduationDate: "May 2022",
      gpa: "3.8",
    },
  ],
}) => {
  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-bold text-foreground">{title}</h2>
      {education?.map((edu, idx) => (
        <div key={idx} className="mb-3 text-sm text-foreground">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold text-foreground">{edu.degree}</p>
              <p className="text-muted-foreground">{edu.school}</p>
              <p className="text-muted-foreground">{edu.field}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{edu.graduationDate}</p>
              {edu.gpa && <p className="text-muted-foreground">GPA: {edu.gpa}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ATS-friendly Skills Component
export const ResumeSkills: React.FC<{
  title?: string;
  skills?: Array<{
    category?: string;
    items?: string;
  }>;
}> = ({
  title = "SKILLS",
  skills = [
    {
      category: "Programming Languages",
      items: "JavaScript, TypeScript, Python, React, Next.js",
    },
  ],
}) => {
  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-bold text-foreground">{title}</h2>
      {skills?.map((skill, idx) => (
        <div key={idx} className="mb-2 text-sm text-foreground">
          <p className="font-semibold text-foreground">{skill.category}:</p>
          <p className="text-muted-foreground">{skill.items}</p>
        </div>
      ))}
    </div>
  );
};

// ATS-friendly Certifications Component
export const ResumeCertifications: React.FC<{
  title?: string;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
  }>;
}> = ({
  title = "CERTIFICATIONS",
  certifications = [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
    },
  ],
}) => {
  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-bold text-foreground">{title}</h2>
      {certifications?.map((cert, idx) => (
        <div key={idx} className="mb-2 text-sm text-foreground">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold text-foreground">{cert.name}</p>
              <p className="text-muted-foreground">{cert.issuer}</p>
            </div>
            <p className="font-semibold text-foreground">{cert.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
