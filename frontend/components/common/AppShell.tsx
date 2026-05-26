"use client"

import { useState, ReactNode } from "react"
import Sidebar from "@/components/common/Sidebar"
import Header from "@/components/common/Header"
import { DataProvider } from "@/context/DataContext"

export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <DataProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div className="gs-primary-bg flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header />
          <main className="gs-primary-bg min-h-0 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </DataProvider>
  )
}
