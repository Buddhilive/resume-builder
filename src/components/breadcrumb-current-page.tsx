"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { BreadcrumbPage } from "@/components/ui/breadcrumb";

function formatSegment(segment: string) {
  if (!segment) return "";
  // numeric or uuid-like segments probably represent IDs — show a generic label
  if (/^[0-9]+$/.test(segment) || /^[0-9a-fA-F-]{8,}$/.test(segment)) {
    return "Document";
  }
  // replace dashes or underscores, capitalize words
  return segment
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function BreadcrumbCurrentPage() {
  const pathname = usePathname() ?? "/";

  // Split pathname into segments and pick the last meaningful segment
  const segments = pathname.split("/").filter(Boolean);
  const last = segments.length ? segments[segments.length - 1] : "";

  const label = last ? formatSegment(last) : "Home";

  return <BreadcrumbPage>{label}</BreadcrumbPage>;
}
