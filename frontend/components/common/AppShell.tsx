"use client"

import { useState, useEffect, ReactNode } from "react"
import Sidebar from "@/components/common/Sidebar"
import Header from "@/components/common/Header"
import { DataProvider } from "@/context/DataContext"

export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)")

    const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setSidebarOpen(!event.matches)
    }

    handleMediaChange(mediaQuery)
    mediaQuery.addEventListener("change", handleMediaChange)

    return () => mediaQuery.removeEventListener("change", handleMediaChange)
  }, [])

  return (
    <DataProvider>
      <div className="relative flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="gs-primary-bg flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((state) => !state)}
          />
          <main className="gs-primary-bg min-h-0 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </DataProvider>
  )
}
