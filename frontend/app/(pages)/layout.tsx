import { ReactNode } from "react"
import Sidebar from "@/components/common/Sidebar"
import Header from "@/components/common/Header"

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col w-full">
          <Header />
          {children}
        </div>
      </div>
    </>
  )
}
