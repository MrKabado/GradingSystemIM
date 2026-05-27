"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Layers,
  Box,
  CircleUserRound,
  UsersRound,
  BookCopy,
  ChartNoAxesColumn,
  NotepadText,
  PanelRightOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Box },
  { label: "Students", href: "/students", icon: CircleUserRound },
  { label: "Sections", href: "/sections", icon: UsersRound },
  { label: "Subjects", href: "/subjects", icon: BookCopy },
  { label: "Grades", href: "/grades", icon: ChartNoAxesColumn },
]

const reportItems = [
  { label: "Grade Reports", href: "/grade-reports", icon: NotepadText },
]

type SidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`)

  const linkClass = (path: string) =>
    cn(
      "gs-sidebar-hover-active mb-1 flex items-center py-2 text-lg",
      open ? "w-full gap-2 px-3" : "w-full justify-center px-2",
      isActive(path) ? "gs-sidebar-active" : "gs-secondary-text"
    )

  return (
    <aside
      className={cn(
        "gs-secondary-bg flex h-full shrink-0 flex-col justify-between overflow-y-auto border-r border-[#545878] transition-[width] duration-200 ease-in-out",
        open ? "w-80 p-5" : "w-18 px-2 py-5"
      )}
    >
      <div>
        <div
          className={cn(
            "relative border-b border-[#545878] pb-8",
            open ? "border-b-[0.5px]" : ""
          )}
        >
          <div
            className={cn(
              "flex items-center",
              open ? "justify-between" : "flex-col gap-3"
            )}
          >
            <div
              className={cn(
                "flex items-center",
                open ? "gap-3" : "flex-col"
              )}
            >
              <button
                type="button"
                onClick={() => !open && onOpenChange(true)}
                className={cn(
                  "flex justify-center rounded-lg bg-[#6366F1] px-2 py-1",
                  !open && "cursor-pointer transition hover:bg-indigo-700"
                )}
                aria-label={open ? "GradeSync home" : "Expand sidebar"}
              >
                <Layers className="h-5 w-5 text-white" strokeWidth={2} />
              </button>
              {open && (
                <h1 className="text-xl font-semibold text-white">GRADESYNC</h1>
              )}
            </div>

            {open && (
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="gs-secondary-text cursor-pointer rounded p-1 transition hover:text-white"
                aria-label="Collapse sidebar"
              >
                <PanelRightOpen className="h-5 w-5" />
              </button>
            )}
          </div>

          {open && (
            <p className="gs-secondary-text absolute top-10 left-14 text-sm">
              Admin portal
            </p>
          )}
        </div>

        <div className="mt-10 space-y-10">
          <div>
            {open && (
              <h2 className="gs-secondary-text mb-2 ml-4 text-xs">MAIN</h2>
            )}
            <ul>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={item.label}
                      className={linkClass(item.href)}
                    >
                      <Icon className="h-6 w-6 shrink-0" />
                      {open && <span>{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            {open && (
              <h2 className="gs-secondary-text mb-3 ml-4 text-xs">REPORTS</h2>
            )}
            <ul>
              {reportItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={item.label}
                      className={linkClass(item.href)}
                    >
                      <Icon className="h-6 w-6 shrink-0" />
                      {open && <span>{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-[#545878] pt-4",
          open ? "flex items-center gap-4" : "flex justify-center"
        )}
      >
        <div className="rounded-full bg-[#6366F1] p-2 font-semibold text-white">
          AD
        </div>
        {open && (
          <div>
            <h2 className="text-sm text-white">Admin</h2>
            <p className="gs-secondary-text text-xs">Administrator</p>
          </div>
        )}
      </div>
    </aside>
  )
}
