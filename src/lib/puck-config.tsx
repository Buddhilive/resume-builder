import { Config } from "@measured/puck";
import React from "react";
import {
  ResumeHeader,
  ResumeSummary,
  ResumeExperience,
  ResumeEducation,
  ResumeSkills,
  ResumeCertifications,
} from "@/components/resume-components";

export const puckConfig: Config = {
  components: {
    ResumeHeader: {
      fields: {
        fullName: {
          type: "text",
          label: "Full Name",
        },
        email: {
          type: "text",
          label: "Email",
        },
        phone: {
          type: "text",
          label: "Phone",
        },
        location: {
          type: "text",
          label: "Location",
        },
        website: {
          type: "text",
          label: "Website / Portfolio",
        },
        linkedin: {
          type: "text",
          label: "LinkedIn URL",
        },
      },
      defaultProps: {
        fullName: "Your Name",
        email: "email@example.com",
        phone: "+1 (555) 123-4567",
        location: "City, State",
        website: "www.yourportfolio.com",
        linkedin: "linkedin.com/in/yourprofile",
      },
      render: ({ fullName, email, phone, location, website, linkedin }) => (
        <ResumeHeader
          fullName={fullName}
          email={email}
          phone={phone}
          location={location}
          website={website}
          linkedin={linkedin}
        />
      ),
    },
    ResumeSummary: {
      fields: {
        title: {
          type: "text",
          label: "Section Title",
        },
        content: {
          type: "textarea",
          label: "Professional Summary",
        },
      },
      defaultProps: {
        title: "PROFESSIONAL SUMMARY",
        content:
          "Results-driven professional with expertise in delivering high-quality solutions. Proven track record of success in fast-paced environments.",
      },
      render: ({ title, content }) => (
        <ResumeSummary title={title} content={content} />
      ),
    },
    ResumeExperience: {
      fields: {
        title: {
          type: "text",
          label: "Section Title",
        },
        experiences: {
          type: "array",
          label: "Work Experience",
          arrayFields: {
            jobTitle: {
              type: "text",
              label: "Job Title",
            },
            company: {
              type: "text",
              label: "Company",
            },
            location: {
              type: "text",
              label: "Location",
            },
            startDate: {
              type: "text",
              label: "Start Date",
            },
            endDate: {
              type: "text",
              label: "End Date",
            },
            description: {
              type: "textarea",
              label: "Description",
            },
          },
        },
      },
      defaultProps: {
        title: "WORK EXPERIENCE",
        experiences: [
          {
            jobTitle: "Senior Developer",
            company: "Tech Company",
            location: "City, State",
            startDate: "Jan 2022",
            endDate: "Present",
            description:
              "Led development of key features. Mentored junior developers. Improved performance by 40%.",
          },
        ],
      },
      render: ({ title, experiences }) => (
        <ResumeExperience title={title} experiences={experiences} />
      ),
    },
    ResumeEducation: {
      fields: {
        title: {
          type: "text",
          label: "Section Title",
        },
        education: {
          type: "array",
          label: "Education",
          arrayFields: {
            degree: {
              type: "text",
              label: "Degree",
            },
            school: {
              type: "text",
              label: "School/University",
            },
            field: {
              type: "text",
              label: "Field of Study",
            },
            graduationDate: {
              type: "text",
              label: "Graduation Date",
            },
            gpa: {
              type: "text",
              label: "GPA (optional)",
            },
          },
        },
      },
      defaultProps: {
        title: "EDUCATION",
        education: [
          {
            degree: "Bachelor of Science",
            school: "University Name",
            field: "Computer Science",
            graduationDate: "May 2022",
            gpa: "3.8",
          },
        ],
      },
      render: ({ title, education }) => (
        <ResumeEducation title={title} education={education} />
      ),
    },
    ResumeSkills: {
      fields: {
        title: {
          type: "text",
          label: "Section Title",
        },
        skills: {
          type: "array",
          label: "Skills",
          arrayFields: {
            category: {
              type: "text",
              label: "Category",
            },
            items: {
              type: "text",
              label: "Skills (comma-separated)",
            },
          },
        },
      },
      defaultProps: {
        title: "SKILLS",
        skills: [
          {
            category: "Programming Languages",
            items: "JavaScript, TypeScript, Python, React, Next.js",
          },
          {
            category: "Tools & Technologies",
            items: "Git, Docker, AWS, PostgreSQL, REST APIs",
          },
        ],
      },
      render: ({ title, skills }) => (
        <ResumeSkills title={title} skills={skills} />
      ),
    },
    ResumeCertifications: {
      fields: {
        title: {
          type: "text",
          label: "Section Title",
        },
        certifications: {
          type: "array",
          label: "Certifications",
          arrayFields: {
            name: {
              type: "text",
              label: "Certification Name",
            },
            issuer: {
              type: "text",
              label: "Issuer",
            },
            date: {
              type: "text",
              label: "Issue Date",
            },
          },
        },
      },
      defaultProps: {
        title: "CERTIFICATIONS",
        certifications: [
          {
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "2023",
          },
        ],
      },
      render: ({ title, certifications }) => (
        <ResumeCertifications title={title} certifications={certifications} />
      ),
    },
  },
};
