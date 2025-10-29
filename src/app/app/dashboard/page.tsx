"use client";

import { useState } from "react";
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
import { Edit, Trash2, Plus } from "lucide-react";

// Mock data for demonstration
const mockResumes = [
  {
    id: 1,
    name: "Software Engineer Resume",
    created: "2024-01-15",
    modified: "2024-01-20",
  },
  {
    id: 2,
    name: "Marketing Manager Resume",
    created: "2024-01-10",
    modified: "2024-01-18",
  },
  {
    id: 3,
    name: "Product Designer Resume",
    created: "2024-01-08",
    modified: "2024-01-16",
  },
  {
    id: 4,
    name: "Data Analyst Resume",
    created: "2024-01-05",
    modified: "2024-01-14",
  },
  {
    id: 5,
    name: "Frontend Developer Resume",
    created: "2024-01-03",
    modified: "2024-01-12",
  },
  {
    id: 6,
    name: "Backend Engineer Resume",
    created: "2024-01-01",
    modified: "2024-01-10",
  },
  {
    id: 7,
    name: "Full Stack Developer Resume",
    created: "2023-12-28",
    modified: "2024-01-08",
  },
  {
    id: 8,
    name: "DevOps Engineer Resume",
    created: "2023-12-25",
    modified: "2024-01-06",
  },
  {
    id: 9,
    name: "UI/UX Designer Resume",
    created: "2023-12-22",
    modified: "2024-01-04",
  },
  {
    id: 10,
    name: "Project Manager Resume",
    created: "2023-12-20",
    modified: "2024-01-02",
  },
  {
    id: 11,
    name: "Business Analyst Resume",
    created: "2023-12-18",
    modified: "2023-12-30",
  },
  {
    id: 12,
    name: "Quality Assurance Resume",
    created: "2023-12-15",
    modified: "2023-12-28",
  },
];

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination
  const totalItems = mockResumes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResumes = mockResumes.slice(startIndex, endIndex);

  const handleEdit = (id: number) => {
    console.log("Edit resume:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete resume:", id);
  };

  const handleNewResume = () => {
    console.log("Create new resume");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust range if we're near the beginning or end
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }
    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Add ellipsis at the beginning if needed
    if (startPage > 1) {
      items.push(
        <PaginationItem key="start">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis at the end if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key="end">
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Resumes</h1>
        <Button onClick={handleNewResume} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Resume
        </Button>
      </div>

      {/* Table Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">entries</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentResumes.map((resume) => (
              <TableRow key={resume.id}>
                <TableCell className="font-medium">{resume.name}</TableCell>
                <TableCell>{new Date(resume.created).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(resume.modified).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleEdit(resume.id)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleDelete(resume.id)}
                      className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {generatePaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
