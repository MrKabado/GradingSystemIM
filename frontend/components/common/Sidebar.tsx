"use client";

import { usePathname } from "next/navigation";
import {
  Layers,
  Box,
  CircleUserRound,
  UsersRound,
  BookCopy,
  ChartNoAxesColumn,
  NotepadText,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path);

  return (
    <div className="h-screen w-80 p-5 gs-secondary-bg flex flex-col justify-between border-r border-[#545878] overflow-y-auto">
      
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="relative border-b-[0.5px] pb-8 border-[#545878]">
          <div className="flex items-center gap-3">
            <div className="flex justify-center px-2 py-1 bg-[#6366F1] rounded-lg">
              <Layers className="text-white w-5 h-5" strokeWidth={2} />
            </div>
            <h1 className="text-white text-xl font-semibold">GRADESYNC</h1>
          </div>

          <p className="absolute top-10 left-16 gs-secondary-text text-sm">
            Admin portal
          </p>
        </div>

        {/* NAV */}
        <div className="space-y-10 mt-10">
          
          {/* MAIN */}
          <div>
            <h1 className="text-xs gs-secondary-text mb-2 ml-4">MAIN</h1>

            <ul>
              <li>
                <a
                  href="/dashboard"
                  className={`w-full py-2 px-3 text-lg mb-1 flex gap-2 items-center gs-sidebar-hover-active ${
                    isActive("/pages/dashboard")
                      ? "gs-sidebar-active"
                      : "gs-secondary-text"
                  }`}
                >
                  <Box className="w-6 h-6" />
                  Overview
                </a>
              </li>

              <li>
                <a
                  href="/students"
                  className={`w-full py-2 px-3 text-lg mb-1 flex gap-2 items-center gs-sidebar-hover-active ${
                    isActive("/pages/students")
                      ? "gs-sidebar-active"
                      : "gs-secondary-text"
                  }`}
                >
                  <CircleUserRound className="w-6 h-6" />
                  Students
                </a>
              </li>

              <li>
                <a
                  href="/sections"
                  className={`w-full py-2 px-3 text-lg mb-1 flex gap-2 items-center gs-sidebar-hover-active ${
                    isActive("/sections")
                      ? "gs-sidebar-active"
                      : "gs-secondary-text"
                  }`}
                >
                  <UsersRound className="w-6 h-6" />
                  Sections
                </a>
              </li>

              <li>
                <a
                  href="/subjects"
                  className={`w-full py-2 px-3 text-lg mb-1 flex gap-2 items-center gs-sidebar-hover-active ${
                    isActive("/subjects")
                      ? "gs-sidebar-active"
                      : "gs-secondary-text"
                  }`}
                >
                  <BookCopy className="w-6 h-6" />
                  Subjects
                </a>
              </li>

              <li>
                <a
                  href="/grades"
                  className={`w-full py-2 px-3 text-lg mb-1 flex gap-2 items-center gs-sidebar-hover-active ${
                    isActive("/grades")
                      ? "gs-sidebar-active"
                      : "gs-secondary-text"
                  }`}
                >
                  <ChartNoAxesColumn className="w-6 h-6" />
                  Grades
                </a>
              </li>
            </ul>
          </div>

          {/* REPORTS */}
          <div>
            <h1 className="text-xs gs-secondary-text mb-3 ml-4">REPORTS</h1>

            <ul>
              <li>
                <a
                  href="/grade-reports"
                  className={`w-full py-2 px-3 text-lg mb-1 flex gap-2 items-center gs-sidebar-hover-active ${
                    isActive("/grade-reports")
                      ? "gs-sidebar-active"
                      : "gs-secondary-text"
                  }`}
                >
                  <NotepadText className="w-6 h-6" />
                  Grade Reports
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* USER */}
      <div className="flex gap-4 items-center border-t border-[#545878] pt-4">
        <div className="bg-[#6366F1] text-white p-2 rounded-full font-semibold">
          AD
        </div>

        <div>
          <h1 className="text-white text-sm">Admin</h1>
          <p className="gs-secondary-text text-xs">Administrator</p>
        </div>
      </div>
    </div>
  );
}