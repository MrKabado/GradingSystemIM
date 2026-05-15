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
} from "lucide-react"
import { useState } from "react"

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
                  onClick={() => setPanelOpen(false)}
                />
              </div>

              <p className="gs-secondary-text absolute top-10 left-25 text-sm">
                Admin portal
              </p>
            </div>

            {/* NAV */}
            <div className="mt-10 space-y-10">
              {/* MAIN */}
              <div>
                <h1 className="gs-secondary-text mb-2 ml-4 text-xs">MAIN</h1>

                <ul>
                  {navItems.map((item) => {
                    const Icon = item.icon

                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                            isActive(item.href)
                              ? "gs-sidebar-active"
                              : "gs-secondary-text"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                          {item.label}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* REPORTS */}
              <div>
                <h1 className="gs-secondary-text mb-3 ml-4 text-xs">REPORTS</h1>

                <ul>
                  {reportItems.map((item) => {
                    const Icon = item.icon

                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className={`gs-sidebar-hover-active mb-1 flex w-full items-center gap-2 px-3 py-2 text-lg ${
                            isActive(item.href)
                              ? "gs-sidebar-active"
                              : "gs-secondary-text"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                          {item.label}
                        </a>
                      </li>
                    )
                  })}
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
          {/* COLLAPSED TOP */}
          <div>
            <div className="relative border-b-[0.5px] border-[#545878] pb-8">
              <div className="flex flex-col items-center justify-between gap-2">
                <span
                  className="flex cursor-pointer justify-center rounded-lg bg-[#6366F1] px-2 py-1 transition hover:bg-indigo-700"
                  onClick={() => setPanelOpen(true)}
                >
                  <Layers className="h-5 w-5 text-white" strokeWidth={2} />
                </span>
              </div>
            </div>

            {/* COLLAPSED NAV */}
            <div className="mt-10 space-y-10">
              <ul>
                {navItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <li key={item.href}>
                      <a
                        title={item.label}
                        href={item.href}
                        className={`gs-sidebar-hover-active mb-1 flex w-full justify-center px-3 py-2 ${
                          isActive(item.href)
                            ? "gs-sidebar-active"
                            : "gs-secondary-text"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    </li>
                  )
                })}
              </ul>

              <ul>
                {reportItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <li key={item.href}>
                      <a
                        title={item.label}
                        href={item.href}
                        className={`gs-sidebar-hover-active mb-1 flex w-full justify-center px-3 py-2 ${
                          isActive(item.href)
                            ? "gs-sidebar-active"
                            : "gs-secondary-text"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* COLLAPSED USER */}
          <div className="flex justify-center border-t border-[#545878] pt-4">
            <div className="rounded-full bg-[#6366F1] p-2 font-semibold text-white">
              AD
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
