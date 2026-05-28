import { Menu, X } from "lucide-react"

type HeaderProps = {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export default function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  return (
    <div className="gs-secondary-bg flex items-center justify-between gap-4 p-4 border-b border-[#545878]">
      <div>
        <h1 className="gs-secondary-text text-xl font-semibold">Header</h1>
      </div>

      <button
        type="button"
        onClick={onToggleSidebar}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#1C2035] text-gray-300 transition hover:bg-[#252B4A] md:hidden"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>
  )
}
