import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./resume-builder.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free AI Resume Builder & Cover Letter Generator | ATS-Friendly Templates",
  description:
    "Create professional, ATS-friendly resumes and cover letters for free with AI assistance. No sign-up required. Generate tailored content, translate documents, and export PDFs instantly. Perfect for job seekers worldwide.",
  keywords: [
    "free resume builder",
    "AI resume generator", 
    "cover letter builder",
    "ATS friendly resume",
    "professional resume templates",
    "job application tools",
    "resume maker",
    "CV builder",
    "AI cover letter generator",
    "resume translator",
    "free resume templates",
    "professional CV maker"
  ],
  authors: [{ name: "Buddhi Kavindra" }],
  creator: "Buddhi LIVE Labs",
  publisher: "Buddhi LIVE Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Free AI Resume Builder & Cover Letter Generator",
    description: "Create professional, ATS-friendly resumes and cover letters for free with AI assistance. No sign-up required.",
    url: "https://resume-builder.com",
    siteName: "Resume Builder",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/RESUME-BUILDER-LOGO.png",
        width: 1200,
        height: 630,
        alt: "Resume Builder - Free AI-powered resume and cover letter generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Resume Builder & Cover Letter Generator",
    description: "Create professional, ATS-friendly resumes and cover letters for free with AI assistance.",
    images: ["/RESUME-BUILDER-LOGO.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Resume Builder",
    "description": "Free AI-powered resume and cover letter builder with ATS-friendly templates",
    "url": "https://resume-builder.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "AI-powered content generation",
      "ATS-friendly templates",
      "Free PDF export",
      "Multi-language translation",
      "Cover letter generator",
      "No registration required"
    ],
    "author": {
      "@type": "Organization",
      "name": "Resume Builder"
    },
    "datePublished": "2025-01-01",
    "dateModified": "2025-10-30",
    "inLanguage": "en-US"
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
