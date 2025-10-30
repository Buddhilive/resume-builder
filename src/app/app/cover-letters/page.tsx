"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Edit, Trash2, Plus, FileText, Loader2 } from "lucide-react";
import { getAllCoverLetterDocuments, deleteCoverLetterDocument, CoverLetterDocument } from "@/lib/db";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";

export default function CoverLettersPage() {
  const [coverLetters, setCoverLetters] = useState<CoverLetterDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("modified");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    document: CoverLetterDocument | null;
  }>({ isOpen: false, document: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 10;

  // Load cover letters on component mount
  useEffect(() => {
    loadCoverLetters();
  }, []);

  const loadCoverLetters = async () => {
    setIsLoading(true);
    try {
      const documents = await getAllCoverLetterDocuments();
      setCoverLetters(documents);
    } catch (error) {
      console.error('Failed to load cover letters:', error);
      toast.error('Failed to load cover letters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (document: CoverLetterDocument) => {
    setDeleteConfirm({ isOpen: true, document });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.document) return;
    
    setIsDeleting(true);
    try {
      await deleteCoverLetterDocument(deleteConfirm.document.id);
      toast.success(`Cover letter "${deleteConfirm.document.name}" deleted successfully`);
      
      // Reload cover letters
      await loadCoverLetters();
    } catch (error) {
      console.error('Failed to delete cover letter:', error);
      toast.error('Failed to delete cover letter');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, document: null });
    }
  };

  // Sort cover letters based on selected criteria
  const sortedCoverLetters = [...coverLetters].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "modified":
      default:
        return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCoverLetters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoverLetters = sortedCoverLetters.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg text-gray-900 dark:text-gray-100">Loading cover letters...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-48px)] overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Cover Letters</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and edit your cover letter documents</p>
          </div>
          <Link href="/app/editor/cover-letter">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Cover Letter
            </Button>
          </Link>
        </div>

        {/* Empty state */}
        {coverLetters.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No cover letters yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first cover letter to get started</p>
            <Link href="/app/editor/cover-letter">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Cover Letter
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modified">Last Modified</SelectItem>
                      <SelectItem value="created">Date Created</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {coverLetters.length} cover letter{coverLetters.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCoverLetters.map((coverLetter) => (
                    <TableRow key={coverLetter.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <Link 
                            href={`/app/editor/cover-letter/${coverLetter.id}`}
                            className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {coverLetter.name}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {formatDate(coverLetter.createdAt)}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {formatDate(coverLetter.modifiedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/app/editor/cover-letter/${coverLetter.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(coverLetter)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, document: null })}
          onConfirm={confirmDelete}
          title="Delete Cover Letter"
          description={`Are you sure you want to delete "${deleteConfirm.document?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}