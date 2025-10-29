# PDF Export Feature Documentation

## Overview

The Resume Builder now includes a comprehensive PDF export feature that allows users to export their resumes as high-quality PDF files. This feature uses `jsPDF` and `html2canvas` libraries to generate PDFs from resume data.

## Features

### 1. **High-Quality PDF Generation**
- Uses high-resolution canvas rendering (2x scale by default)
- Optimized for print with proper page sizing (A4/Letter)
- ATS-compatible formatting with clean structure

### 2. **Multiple Export Methods**
- **From Resume Data**: Export directly from the resume data structure
- **From HTML Element**: Export from rendered HTML elements (preview modal)
- **Customizable Options**: Format, orientation, quality, margins

### 3. **User Experience**
- Loading states during export
- Error handling with user-friendly messages
- Progress indication
- Automatic filename generation with timestamps

## Technical Implementation

### Core Components

#### 1. **PDFExporter Class** (`src/lib/pdf-utils.ts`)
The main utility class that handles PDF generation:

```typescript
import { PDFExporter } from '@/lib/pdf-utils';

// Export from resume data
await PDFExporter.exportResumeDataToPDF(resumeData, options);

// Export from HTML element
await PDFExporter.exportElementToPDF(element, options);
```

#### 2. **usePDFExport Hook** (`src/hooks/use-pdf-export.ts`)
React hook for managing PDF export state:

```typescript
import { usePDFExport } from '@/hooks/use-pdf-export';

const { isExporting, exportError, exportFromData, clearError } = usePDFExport();
```

#### 3. **PDF Options Interface**
Configurable options for PDF generation:

```typescript
interface PDFOptions {
  filename?: string;           // Default: 'resume.pdf'
  format?: 'a4' | 'letter';   // Default: 'a4'
  orientation?: 'portrait' | 'landscape'; // Default: 'portrait'
  quality?: number;            // Default: 0.9 (90%)
  scale?: number;              // Default: 2 (2x resolution)
  margins?: {                  // Default margins in mm
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}
```

## Usage Examples

### 1. **Basic Export from Editor**
```typescript
const handleExport = async () => {
  try {
    await exportFromData(resumeData, {
      filename: 'my-resume.pdf',
      format: 'a4'
    });
  } catch (error) {
    console.error('Export failed:', error);
  }
};
```

### 2. **Export from Preview Modal**
```typescript
const handlePDFExport = async () => {
  const pdfData = { content: data.content, root: {} };
  await exportFromData(pdfData, {
    filename: `resume-${new Date().toISOString().slice(0, 10)}.pdf`
  });
};
```

### 3. **Export with Custom Options**
```typescript
const customOptions = {
  filename: 'professional-resume.pdf',
  format: 'letter' as const,
  orientation: 'portrait' as const,
  quality: 0.95,
  margins: {
    top: 20,
    bottom: 20,
    left: 25,
    right: 25,
  }
};

await exportFromData(resumeData, customOptions);
```

## Integration Points

### 1. **Editor Page** (`src/app/app/editor/[[...docId]]/page.tsx`)
- Export PDF button in the toolbar
- Loading state management
- Error display and handling
- Auto-filename generation with timestamps

### 2. **Preview Modal** (`src/components/preview-modal.tsx`)
- Multiple export options (Print, PDF, HTML)
- Preview-specific PDF export
- Enhanced user experience

### 3. **Resume Components**
All resume components are compatible with PDF export:
- `ResumeHeader`
- `ResumeSummary`
- `ResumeExperience`
- `ResumeEducation`
- `ResumeSkills`
- `ResumeCertifications`

## Best Practices

### 1. **Performance**
- Use optimal settings: `PDFExporter.getResumeOptimalSettings()`
- Avoid excessive scale values (recommended: 1-3)
- Consider file size vs. quality trade-offs

### 2. **User Experience**
- Always show loading states during export
- Provide clear error messages
- Allow users to dismiss errors
- Use descriptive filenames

### 3. **ATS Compatibility**
- The PDF export is optimized for ATS systems
- Uses clean structure and standard fonts
- Avoids complex layouts and graphics
- Maintains proper text hierarchy

## Error Handling

The system includes comprehensive error handling:

```typescript
// Automatic error handling in the hook
const { exportError, clearError } = usePDFExport();

// Manual error handling
try {
  await exportFromData(data);
} catch (error) {
  console.error('PDF export failed:', error);
  // Handle error appropriately
}
```

Common errors and solutions:
- **Canvas rendering failed**: Check if elements are properly rendered
- **PDF generation failed**: Verify data structure and options
- **File save failed**: Check browser permissions and storage

## Dependencies

The PDF export feature requires these packages:
- `jspdf`: PDF generation library
- `html2canvas`: HTML to canvas conversion
- Standard React hooks for state management

## Browser Compatibility

The PDF export feature works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Considerations

- PDF generation is CPU-intensive for large resumes
- Higher scale values increase generation time
- Complex layouts may take longer to render
- Consider showing progress indicators for better UX

## Testing

Use the test component for development:
```typescript
import PDFExportTestButton from '@/components/pdf-export-test';

// Add to any page for testing
<PDFExportTestButton />
```

## Future Enhancements

Potential improvements:
- Batch export for multiple resumes
- Template-based PDF generation
- Watermark support
- Digital signature integration
- Progress bars for large documents
- PDF preview before download