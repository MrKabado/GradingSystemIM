import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useData } from "@/context/DataContext"

export default function SectionDropdown() {
  const { sections } = useData();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="gs-secondary-text flex w-85 items-center justify-center gap-1 rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 outline-none">
        <h1>Select Section</h1>
        <ChevronDown />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="border-none bg-[#13162A] text-white shadow-none">
        <DropdownMenuGroup>
          {
            sections.map((section, i) => (
              <DropdownMenuItem className="rounded-none">{section.section}</DropdownMenuItem>
            ))
          }
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}