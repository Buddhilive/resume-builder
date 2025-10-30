"use client"

import * as React from "react"
import {
  FileText,
  FileUser,
  Home
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
/* import { NavUser } from "@/components/nav-user" */
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "./ui/theme-toggle"

// This is sample data.
const data = {
  user: {
    name: "Buddhilive",
    email: "info@buddhilive.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Resume Builder",
      logo: FileUser,
      plan: "Free",
    }
  ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Resumes",
      url: "/app/resumes",
      icon: FileUser,
    },
    {
      title: "Cover Letters",
      url: "/app/cover-letters",
      icon: FileText,
    },
  ],
  projects: [
    /* {
      name: "Design Engineering",
      url: "#",
      icon: FileUser,
    }, */
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        <ThemeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
