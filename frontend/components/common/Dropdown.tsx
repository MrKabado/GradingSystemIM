import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

type PropsType = {
  selectName: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export default function CustomDropdownMenu({ selectName, option1, option2, option3, option4 }: PropsType) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="gs-secondary-text flex w-80 items-center justify-center gap-1 rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 outline-none">
        <h1>{selectName}</h1>
        <ChevronDown />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="border-none bg-[#13162A] text-white shadow-none">
        <DropdownMenuGroup>
          <DropdownMenuItem className="rounded-none">{option1}</DropdownMenuItem>
          <DropdownMenuItem className="rounded-none">{option2}</DropdownMenuItem>
          <DropdownMenuItem className="rounded-none">{option3}</DropdownMenuItem>
          <DropdownMenuItem className="rounded-none">{option4}</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}