import { ReactNode } from "react"
import Sidebar from "@/components/common/Sidebar"

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        {children}
      </div>
    </>
  )
}
