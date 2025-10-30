"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ForwardRefEditor } from "@/components/mdx-editor/ForwardRefEditor";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCoverLetterPDFExport } from "@/hooks/use-cover-letter-pdf-export";
import {
  FileText,
  Save,
  Download,
  Trash2,
  Loader2,
  Languages,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  saveCoverLetterDocument,
  loadCoverLetterDocument,
  deleteCoverLetterDocument,
  CoverLetterDocument,
} from "@/lib/db";
import { toast } from "sonner";
import { isBuiltInAIAvailabile } from "@/lib/provider";
import {
  translateCoverLetterContent,
  checkCoverLetterTranslationAvailability,
  SUPPORTED_LANGUAGES,
  type SupportedLanguageCode,
} from "@/lib/ai/cover-letter-translator";
import { type MDXEditorMethods } from '@mdxeditor/editor';

export default function CoverLetterEditorPage() {
  const params = useParams();
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);

  // Get document ID from URL parameters
  const documentId = params?.docId?.[0] || null;
  const isNewDocument = !documentId;

  const [currentDocument, setCurrentDocument] = useState<CoverLetterDocument | null>(null);
  const [documentName, setDocumentName] = useState("Untitled Cover Letter");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [isTranslationAvailable, setIsTranslationAvailable] = useState(false);
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState<SupportedLanguageCode>("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);

  // PDF Export functionality
  const { isExporting, exportError, exportFromContent, clearError } = useCoverLetterPDFExport();

  // Effect to load document when component mounts or documentId changes
  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) {
        // New document - use default content
        setCurrentDocument(null);
        setDocumentName("Untitled Cover Letter");
        setContent("# Your Cover Letter\n\nStart writing your cover letter here...");
        return;
      }

      setIsLoading(true);
      try {
        const document = await loadCoverLetterDocument(documentId);
        if (document) {
          setCurrentDocument(document);
          setDocumentName(document.name);
          setContent(document.content);
          setLastSaved(document.modifiedAt);
          toast.success(`Cover letter "${document.name}" loaded successfully`);
        } else {
          toast.error("Cover letter not found");
          router.push("/app/editor/cover-letter");
        }
      } catch (error) {
        console.error("Failed to load document:", error);
        toast.error("Failed to load cover letter");
        router.push("/app/editor/cover-letter");
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
    checkAIAvailability();
  }, [documentId, router]);

  const checkAIAvailability = async () => {
    const isAIAvailable = await isBuiltInAIAvailabile();
    setIsAIEnabled(isAIAvailable);

    if (isAIAvailable) {
      const isTranslationReady = await checkCoverLetterTranslationAvailability();
      setIsTranslationAvailable(isTranslationReady);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Use current document ID if editing existing document
      const savedDocumentId = await saveCoverLetterDocument(
        currentDocument?.id || null,
        documentName,
        content
      );

      // Update last saved time
      setLastSaved(new Date());

      // If it's a new document, update the URL and current document state
      if (!currentDocument) {
        const newDocument: CoverLetterDocument = {
          id: savedDocumentId,
          name: documentName,
          content: content,
          createdAt: new Date(),
          modifiedAt: new Date(),
        };
        setCurrentDocument(newDocument);

        // Update URL to include the document ID
        router.push(`/app/editor/cover-letter/${savedDocumentId}`);
        toast.success(`Cover letter "${documentName}" created successfully`);
      } else {
        // Update existing document
        setCurrentDocument({
          ...currentDocument,
          name: documentName,
          content: content,
          modifiedAt: new Date(),
        });
        toast.success(`Cover letter "${documentName}" saved successfully`);
      }
    } catch (error) {
      console.error("Failed to save cover letter:", error);
      toast.error("Failed to save cover letter. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentDocument) {
      toast.error("No document to delete");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCoverLetterDocument(currentDocument.id);
      toast.success(`Cover letter "${currentDocument.name}" deleted successfully`);
      router.push("/app/editor/cover-letter");
    } catch (error) {
      console.error("Failed to delete cover letter:", error);
      toast.error("Failed to delete cover letter. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleExport = async () => {
    clearError();
    
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `cover-letter-${timestamp}.pdf`;

      await exportFromContent(content, {
        filename,
        format: "a4",
        orientation: "portrait",
      });

      toast.success("Cover letter exported successfully");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to export PDF");
    }
  };

  const handleTranslate = async () => {
    if (!isTranslationAvailable || !selectedTargetLanguage) {
      toast.error("Translation is not available");
      return;
    }

    setIsTranslating(true);
    setTranslationProgress(0);

    try {
      const result = await translateCoverLetterContent(
        content,
        { targetLanguage: selectedTargetLanguage },
        (progress) => setTranslationProgress(progress)
      );

      setContent(result.translatedContent);
      
      // Update editor content
      if (editorRef.current) {
        editorRef.current.setMarkdown(result.translatedContent);
      }

      toast.success(
        `Cover letter translated from ${
          SUPPORTED_LANGUAGES[result.sourceLanguage as SupportedLanguageCode] ||
          result.sourceLanguage
        } to ${
          SUPPORTED_LANGUAGES[result.targetLanguage as SupportedLanguageCode] ||
          result.targetLanguage
        }`
      );
    } catch (error) {
      console.error("Translation failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Translation failed"
      );
    } finally {
      setIsTranslating(false);
      setTranslationProgress(0);
    }
  };

  const handleWriteWithAI = () => {
    // Placeholder for AI writing functionality
    toast.info("AI writing feature coming soon!");
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="flex h-[calc(100vh-48px)] overflow-y-auto flex-col bg-background">
      {/* Loading overlay for document loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading cover letter...</span>
          </div>
        </div>
      )}

      {/* Top Toolbar */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Document Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="font-semibold text-foreground bg-transparent border-none outline-none focus:ring-2 focus:ring-primary focus:bg-background px-2 py-1 rounded"
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">
                • Last saved{" "}
                {Math.floor((Date.now() - lastSaved.getTime()) / 60000) || 0}{" "}
                mins ago
                {currentDocument && (
                  <>
                    • Created {currentDocument.createdAt.toLocaleDateString()}
                    {!isNewDocument && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded dark:bg-green-900/40 dark:text-green-300">
                        Saved
                      </span>
                    )}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* AI Write button */}
            {isAIEnabled && (
              <Button
                onClick={handleWriteWithAI}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Sparkles className="h-4 w-4" />
                Write with AI
              </Button>
            )}

            {/* Translation */}
            {isAIEnabled && isTranslationAvailable && (
              <div className="flex items-center gap-2">
                <Select
                  value={selectedTargetLanguage}
                  onValueChange={(value: SupportedLanguageCode) =>
                    setSelectedTargetLanguage(value)
                  }
                >
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SUPPORTED_LANGUAGES).map(
                      ([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleTranslate}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  title="Translate Cover Letter"
                  disabled={isTranslating || isLoading}
                >
                  <Languages className="h-4 w-4" />
                  {isTranslating
                    ? `${translationProgress}%`
                    : "Translate"}
                </Button>
              </div>
            )}

            {/* Save button */}
            <Button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>

            {/* Export to PDF button */}
            <Button
              onClick={handleExport}
              disabled={isExporting || isLoading}
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>

            {/* Delete button - only show for existing documents */}
            {currentDocument && (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </div>

        {/* PDF Export Error Display */}
        {exportError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 dark:bg-red-950/30 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-300">
              {exportError}
            </span>
            <Button
              onClick={clearError}
              variant="ghost"
              size="sm"
              className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              ✕
            </Button>
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden bg-background">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading cover letter editor...</p>
            </div>
          </div>
        ) : (
          <div className="h-full p-6">
            <div className="max-w-4xl mx-auto h-full">
              <ForwardRefEditor
                ref={editorRef}
                markdown={content}
                onChange={handleContentChange}
                placeholder="Start writing your cover letter..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Cover Letter"
        description={`Are you sure you want to delete "${documentName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}