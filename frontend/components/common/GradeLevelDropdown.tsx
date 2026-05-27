import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useData } from "@/context/DataContext"

type Props = {
  selectedGradeLevel: string;
  onChangeGradeLevel: (value: string) => void;
}

export default function GradeLevelDropdown({
  selectedGradeLevel,
  onChangeGradeLevel,
}: Props) {
  const { sections } = useData()

  const yearLevels = Array.from(
    new Set(sections.map((section) => section.year_level))
  )

  const label = selectedGradeLevel || "Select Grade Level"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="gs-secondary-text flex w-85 items-center justify-center gap-1 rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 outline-none">
        <h1 className="truncate">{label}</h1>
        <ChevronDown />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="border-none bg-[#13162A] text-white shadow-none">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={`rounded-none cursor-pointer ${
              !selectedGradeLevel ? "text-[#8B84FF] font-medium" : ""
            }`}
            onClick={() => onChangeGradeLevel("")}
          >
            All Grade Levels
          </DropdownMenuItem>

          {yearLevels.map((yearLevel) => (
            <DropdownMenuItem
              key={yearLevel}
              className={`rounded-none cursor-pointer ${
                selectedGradeLevel === yearLevel
                  ? "text-[#8B84FF] font-medium"
                  : ""
              }`}
              onClick={() => onChangeGradeLevel(yearLevel)}
            >
              {yearLevel}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
