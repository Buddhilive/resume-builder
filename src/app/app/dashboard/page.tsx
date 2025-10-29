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
import { getAllResumeDocuments, deleteResumeDocument, ResumeDocument } from "@/lib/db";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("modified");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    document: ResumeDocument | null;
  }>({ isOpen: false, document: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 10;

  // Load resumes on component mount
  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setIsLoading(true);
    try {
      const documents = await getAllResumeDocuments();
      setResumes(documents);
    } catch (error) {
      console.error('Failed to load resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (document: ResumeDocument) => {
    setDeleteConfirm({ isOpen: true, document });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.document) return;
    
    setIsDeleting(true);
    try {
      await deleteResumeDocument(deleteConfirm.document.id);
      toast.success(`Resume "${deleteConfirm.document.name}" deleted successfully`);
      
      // Reload resumes
      await loadResumes();
    } catch (error) {
      console.error('Failed to delete resume:', error);
      toast.error('Failed to delete resume');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, document: null });
    }
  };

  // Sort resumes based on selected criteria
  const sortedResumes = [...resumes].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedResumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResumes = sortedResumes.slice(startIndex, startIndex + itemsPerPage);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading resumes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h1>
            <p className="text-gray-600">Manage and edit your resume documents</p>
          </div>
          <Link href="/app/editor">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Resume
            </Button>
          </Link>
        </div>

        {/* Empty state */}
        {resumes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">Create your first resume to get started</p>
            <Link href="/app/editor">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Resume
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
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
                <div className="text-sm text-gray-600">
                  {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                  {paginatedResumes.map((resume) => (
                    <TableRow key={resume.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <Link 
                            href={`/app/editor/${resume.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {resume.name}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(resume.createdAt)}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(resume.modifiedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/app/editor/${resume.id}`}>
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
                            onClick={() => handleDelete(resume)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
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
          title="Delete Resume"
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