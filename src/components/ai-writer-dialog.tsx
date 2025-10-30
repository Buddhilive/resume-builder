"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getAllResumeDocuments, ResumeDocument } from "@/lib/db";
import { createAISessions, generateCoverLetter, CoverLetterWriteRequest, AISession } from "@/lib/ai/writer";
import { Loader2, Search, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AIWriterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContentGenerated: (content: string) => void;
}

export function AIWriterDialog({
  isOpen,
  onClose,
  onContentGenerated,
}: AIWriterDialogProps) {
  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);

  // Load resumes when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadResumes();
    }
  }, [isOpen]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedResumeId("");
      setJobDescription("");
      setSearchTerm("");
      setGenerationProgress(0);
    }
  }, [isOpen]);

  const loadResumes = async () => {
    setLoadingResumes(true);
    try {
      const allResumes = await getAllResumeDocuments();
      setResumes(allResumes);
      if (allResumes.length === 0) {
        toast.info("No resumes found. Create a resume first to use AI writer.");
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
      toast.error("Failed to load resumes");
    } finally {
      setLoadingResumes(false);
    }
  };

  const filteredResumes = resumes.filter((resume) =>
    resume.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedResume = resumes.find((resume) => resume.id === selectedResumeId);

  const handleGenerate = async () => {
    if (!selectedResume) {
      toast.error("Please select a resume");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please describe the position you're applying for");
      return;
    }

    setIsLoading(true);
    setGenerationProgress(0);

    let writer: AISession | null = null;
    let summarizer: AISession | null = null;

    try {
      // Step 1: Create AI sessions with user gesture (must be done here)
      const sessions = await createAISessions((progress) => {
        setGenerationProgress(progress.loaded);
      });
      
      writer = sessions.writer;
      summarizer = sessions.summarizer;

      // Step 2: Generate cover letter using the sessions
      const request: CoverLetterWriteRequest = {
        jobDescription: jobDescription.trim(),
        resumeDocument: selectedResume,
        options: {
          tone: 'formal',
          format: 'markdown',
          length: 'medium',
        },
      };

      const generatedContent = await generateCoverLetter(
        request,
        writer,
        summarizer,
        (progress) => {
          setGenerationProgress(progress.loaded);
        }
      );

      onContentGenerated(generatedContent);
      onClose();
      toast.success("Cover letter generated successfully!");
    } catch (error) {
      console.error("Failed to generate cover letter:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate cover letter"
      );
    } finally {
      // Clean up AI sessions
      try {
        if (writer?.destroy) {
          writer.destroy();
        }
        if (summarizer?.destroy) {
          summarizer.destroy();
        }
      } catch (cleanupError) {
        console.warn("Failed to cleanup AI sessions:", cleanupError);
      }
      
      setIsLoading(false);
      setGenerationProgress(0);
    }
  };

  const canGenerate = selectedResumeId && jobDescription.trim() && !isLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Cover Letter with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Resume Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Resume</label>
            {loadingResumes ? (
              <div className="flex items-center gap-2 p-3 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading resumes...
                </span>
              </div>
            ) : resumes.length === 0 ? (
              <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  No resumes found. Create a resume first.
                </span>
              </div>
            ) : (
              <>
                {/* Search Input */}
                {resumes.length > 3 && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resumes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                )}

                {/* Resume Select */}
                <Select
                  value={selectedResumeId}
                  onValueChange={setSelectedResumeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a resume..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredResumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        <div className="flex flex-col items-start">
                          <span>{resume.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Modified {resume.modifiedAt.toLocaleDateString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Selected Resume Info */}
                {selectedResume && (
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="text-sm">
                      <p className="font-medium">{selectedResume.name}</p>
                      <p className="text-muted-foreground">
                        {selectedResume.data.content?.length || 0} sections •{" "}
                        Modified {selectedResume.modifiedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Position Description
            </label>
            <textarea
              placeholder="Describe the position you're applying for, key requirements, company details, etc. The more specific, the better the generated cover letter will be."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              disabled={isLoading}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {jobDescription.length}/1000 characters
            </p>
          </div>

          {/* Generation Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">
                  {generationProgress < 10
                    ? "Initializing AI..."
                    : generationProgress < 60
                    ? "Setting up AI models..."
                    : generationProgress < 70
                    ? "Analyzing resume..."
                    : generationProgress < 80
                    ? "Summarizing experience..."
                    : "Generating cover letter..."}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {generationProgress}% complete
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}