![Resume Builder](public/RESUME-BUILDER-LOGO.png)
# Resume Builder

> Free AI-powered Resume & Cover Letter Builder - No sign-up required to prototype

## Overview

Resume Builder is a modern web application that helps you create professional, ATS-friendly resumes and compelling cover letters in minutes. Powered by AI, it uses Chrome's Built-in AI APIs to provide advanced features while maintaining your privacy.

**Features:**
- ✅ **Truly Free** - No paywall. Export PDFs and iterate as much as you like
- ⚡ **AI-Powered** - Generate role-specific bullet points, summaries, and complete cover letters with our built-in AI assistant
- 📋 **ATS Friendly** - Professionally formatted resumes optimized for applicant tracking systems
- 🌐 **AI Translation** - Translate your resumes and cover letters to any language while maintaining professional formatting
- 🔒 **Privacy Friendly** - Leverages Chrome's on-device AI for privacy

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org) - React framework with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **UI Components:** Custom shadcn/ui-based components
- **PDF Export:** Custom PDF utilities
- **AI Features:** Chrome Built-in AI APIs (experimental)
  - Language Detection API
  - Translator API
  - Summarizer API
  - Writer API

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Chrome Built-in AI Setup

The Resume Builder uses Chrome's experimental Built-in AI APIs. To enable these features:

### Requirements

- **Chrome Canary** or **Chrome Dev** (not available in stable Chrome)
- Experimental flags enabled
- On-device AI model downloaded (~3-5 GB)
- Stable internet connection for initial model download

### How to Enable

1. Download and install [Chrome Canary](https://www.google.com/chrome/canary/) or [Chrome Dev](https://www.google.com/chrome/dev/)
2. Navigate to `chrome://flags`
3. Search for and enable the following flags:
   - `Summarization API for Gemini Nano`
   - `Writer API for Gemini Nano`
   - `Language Detection API`
   - `Translation API`
4. Restart Chrome
5. Visit `chrome://components` and click "Check for update" on **Optimization Guide On Device Model**
6. Return to the Settings page in Resume Builder and refresh API status

> **Note:** First-time setup of the AI models can take 5-15 minutes depending on your internet speed.

## Available AI Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Language Detection** | Check in Settings | Detects the language of text content in your documents |
| **Translator** | Check in Settings | Translates content between different languages |
| **Summarizer** | Check in Settings | Creates summaries of long text content |
| **Writer** | Check in Settings | Generates professional content like cover letters |

You can check the availability of these features in the **Settings** page of the application.

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx              # Home page
│   └── app/
│       ├── layout.tsx
│       ├── editor/
│       │   ├── resume/
│       │   └── cover-letter/
│       ├── resumes/
│       ├── cover-letters/
│       └── settings/         # Settings & API status page
├── components/
│   ├── ui/                   # UI components
│   ├── mdx-editor/          # MDX editor components
│   ├── ai-writer-dialog.tsx
│   ├── ats-validator.tsx
│   ├── pdf-export-test.tsx
│   └── ...
├── hooks/
│   ├── use-pdf-export.ts
│   ├── use-cover-letter-pdf-export.ts
│   └── use-mobile.ts
└── lib/
    ├── ai/                   # AI utilities
    ├── pdf-utils.ts         # PDF export utilities
    ├── ats-utils.ts         # ATS validation utilities
    ├── provider.ts          # Chrome AI provider
    └── ...
```

## Development

### Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Run linting
pnpm lint
```

### Key Features to Explore

- **Resume Editor** - Rich text editing with AI suggestions
- **Cover Letter Generator** - AI-powered cover letter creation
- **ATS Validator** - Checks resume compatibility with ATS
- **PDF Export** - Generate downloadable PDF resumes
- **Multi-language Support** - Translate documents with AI

## Settings & Configuration

The Settings page provides:
- Real-time checking of Chrome Built-in AI API availability
- Instructions for enabling experimental AI features
- Status monitoring for Language Detection, Translator, Summarizer, and Writer APIs
- Documentation links for each feature

Visit `/app/settings` to access the Settings page.

## Important Notes

### Experimental Features

Chrome Built-in AI APIs are experimental and subject to change:
- APIs may be modified or removed in future Chrome versions
- Feature availability depends on your Chrome channel and enabled flags
- Initial model downloads require significant bandwidth (3-5 GB)
- On-device processing ensures privacy - no data is sent to external servers

### Browser Compatibility

- ✅ Chrome Canary / Chrome Dev (with experimental flags)
- ⚠️ Not available in Chrome Stable
- ❌ Not supported in other browsers (Firefox, Safari, Edge, etc.)

## Privacy & Terms

- **Privacy Policy:** https://www.buddhilive.com/privacy-policy/
- **Terms & Conditions:** https://www.buddhilive.com/terms-and-conditions/
- **Documentation:** https://www.buddhilive.com/docs/chrome-ai

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Chrome Built-in AI](https://developer.chrome.com/docs/ai)
- [Chrome Canary](https://www.google.com/chrome/canary/)
- [ATS Resume Formatting Guide](https://www.buddhilive.com/docs/ats)

## Contributing

Feedback and contributions are welcome! Please check out our [GitHub repository](https://github.com/Buddhilive/resume-builder) for more details.

## License

© 2025 Buddhi LIVE Resume Builder - All rights reserved.
