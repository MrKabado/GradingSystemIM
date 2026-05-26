import { ReactNode } from "react"
import Sidebar from "@/components/common/Sidebar"
import Header from "@/components/common/Header"
import { DataProvider } from "@/context/DataContext"

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DataProvider>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex w-full flex-col">
            <Header />
            {children}
          </div>
        </div>
      </DataProvider>
    </>
  )
}
