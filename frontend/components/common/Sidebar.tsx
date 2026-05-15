"use client"

import { usePathname } from "next/navigation"
import {
  Layers,
  Box,
  CircleUserRound,
  UsersRound,
  BookCopy,
  ChartNoAxesColumn,
  NotepadText,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react"
import { useState } from "react"

export default function Sidebar() {
  const pathname = usePathname()
  const [panelOpen, setPanelOpen] = useState(true)

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path)

  return (
    <div>
      {panelOpen ? (
        <div className="gs-secondary-bg flex h-screen w-80 flex-col justify-between overflow-y-auto border-r border-[#545878] p-5">
          {/* TOP */}
          <div>
            {/* LOGO */}
            <div className="relative border-b-[0.5px] border-[#545878] pb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex justify-center rounded-lg bg-[#6366F1] px-2 py-1">
                    <Layers className="h-5 w-5 text-white" strokeWidth={2} />
                  </span>
                  <h1 className="text-xl font-semibold text-white">
                    GRADESYNC
                  </h1>
                </div>
                <PanelRightOpen
                  className="gs-secondary-text cursor-pointer"
                  onClick={() => setPanelOpen(!panelOpen)}
                />
              </div>

              <p className="gs-secondary-text absolute top-10 left-16 text-sm">
                Admin portal
              </p>
            </div>

            {/* NAV */}
            <div className="mt-10 space-y-10">
              {/* MAIN */}
              <div>
                <h1 className="gs-secondary-text mb-2 ml-4 text-xs">MAIN</h1>

                <ul>
                  <li>
                    <a
                      href="/dashboard"
                      className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                        isActive("/pages/dashboard")
                          ? "gs-sidebar-active"
                          : "gs-secondary-text"
                      }`}
                    >
                      <Box className="h-6 w-6" />
                      Overview
                    </a>
                  </li>

                  <li>
                    <a
                      href="/students"
                      className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                        isActive("/pages/students")
                          ? "gs-sidebar-active"
                          : "gs-secondary-text"
                      }`}
                    >
                      <CircleUserRound className="h-6 w-6" />
                      Students
                    </a>
                  </li>

                  <li>
                    <a
                      href="/sections"
                      className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                        isActive("/sections")
                          ? "gs-sidebar-active"
                          : "gs-secondary-text"
                      }`}
                    >
                      <UsersRound className="h-6 w-6" />
                      Sections
                    </a>
                  </li>

                  <li>
                    <a
                      href="/subjects"
                      className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                        isActive("/subjects")
                          ? "gs-sidebar-active"
                          : "gs-secondary-text"
                      }`}
                    >
                      <BookCopy className="h-6 w-6" />
                      Subjects
                    </a>
                  </li>

                  <li>
                    <a
                      href="/grades"
                      className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                        isActive("/grades")
                          ? "gs-sidebar-active"
                          : "gs-secondary-text"
                      }`}
                    >
                      <ChartNoAxesColumn className="h-6 w-6" />
                      Grades
                    </a>
                  </li>
                </ul>
              </div>

              {/* REPORTS */}
              <div>
                <h1 className="gs-secondary-text mb-3 ml-4 text-xs">REPORTS</h1>

                <ul>
                  <li>
                    <a
                      href="/grade-reports"
                      className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                        isActive("/grade-reports")
                          ? "gs-sidebar-active"
                          : "gs-secondary-text"
                      }`}
                    >
                      <NotepadText className="h-6 w-6" />
                      Grade Reports
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* USER */}
          <div className="flex items-center gap-4 border-t border-[#545878] pt-4">
            <div className="rounded-full bg-[#6366F1] p-2 font-semibold text-white">
              AD
            </div>

            <div>
              <h1 className="text-sm text-white">Admin</h1>
              <p className="gs-secondary-text text-xs">Administrator</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="gs-secondary-bg flex h-screen w-auto flex-col justify-between overflow-y-auto border-r border-[#545878] px-2 py-5">
          {/* TOP */}
          <div>
            {/* LOGO */}
            <div className="relative border-b-[0.5px] border-[#545878] pb-8">
              <div className="flex flex-col items-center justify-between gap-2">
                <span className="flex justify-center rounded-lg bg-[#6366F1] px-2 py-1">
                  <Layers className="h-5 w-5 text-white" strokeWidth={2} />
                </span>
                <PanelRightClose
                  className="gs-secondary-text cursor-pointer"
                  onClick={() => setPanelOpen(!panelOpen)}
                />
              </div>
            </div>

            {/* NAV */}
            <div className="mt-10 space-y-10">
              {/* MAIN */}
              <div>
                <h1 className="gs-secondary-text mb-2 ml-4 text-xs">M</h1>

                <ul>
                  <li>
                    <a
                      href="/dashboard"
                      className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                        isActive("/pages/dashboard")
                          ? "gs-sidebar-active"
                          : "gs-secondary-text"
                      }`}
                    >
                      <Box className="h-6 w-6" />
                    </a>
                  </li>

                  <li>
                    <a
                      href="/students"
                      className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                        isActive("/pages/students")
                          ? "gs-sidebar-active"
                          : "gs-secondary-text"
                      }`}
                    >
                      <CircleUserRound className="h-6 w-6" />
                    </a>
                  </li>

                  <li>
                    <a
                      href="/sections"
                      className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                        isActive("/sections")
                          ? "gs-sidebar-active"
                          : "gs-secondary-text"
                      }`}
                    >
                      <UsersRound className="h-6 w-6" />
                    </a>
                  </li>

                  <li>
                    <a
                      href="/subjects"
                      className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                        isActive("/subjects")
                          ? "gs-sidebar-active"
                          : "gs-secondary-text"
                      }`}
                    >
                      <BookCopy className="h-6 w-6" />
                    </a>
                  </li>

                  <li>
                    <a
                      href="/grades"
                      className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                        isActive("/grades")
                          ? "gs-sidebar-active"
                          : "gs-secondary-text"
                      }`}
                    >
                      <ChartNoAxesColumn className="h-6 w-6" />
                    </a>
                  </li>
                </ul>
              </div>

              {/* REPORTS */}
              <div>
                <h1 className="gs-secondary-text mb-3 ml-4 text-xs">R</h1>

                <ul>
                  <li>
                    <a
                      href="/grade-reports"
                      className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                        isActive("/grade-reports")
                          ? "gs-sidebar-active"
                          : "gs-secondary-text"
                      }`}
                    >
                      <NotepadText className="h-6 w-6" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* USER */}
          <div className="flex items-center gap-4 border-t border-[#545878] pt-4">
            <div className="rounded-full bg-[#6366F1] p-2 font-semibold text-white">
              AD
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
