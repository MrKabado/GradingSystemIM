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
  selectedSection?: string;
  onChangeSection?: (value: string) => void;
};

export default function SectionDropdown({
  selectedSection = "",
  onChangeSection = () => {},
}: Props) {
  const { sections } = useData();

  const selected = sections.find(
    (section) => section.id.toString() === selectedSection
  );

  const label = selected?.section || "Select Section";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="gs-secondary-text flex w-full sm:w-[21.25rem] items-center justify-between gap-1 rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 outline-none">
        <h1 className="truncate">{label}</h1>
        <ChevronDown />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="border-none bg-[#13162A] text-white shadow-none">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={`rounded-none cursor-pointer ${
              !selectedSection ? "text-[#8B84FF] font-medium" : ""
            }`}
            onClick={() => onChangeSection("")}
          >
            All Sections
          </DropdownMenuItem>

          {sections.map((section) => (
            <DropdownMenuItem
              key={section.id}
              className={`rounded-none cursor-pointer ${
                selectedSection === section.id.toString()
                  ? "text-[#8B84FF] font-medium"
                  : ""
              }`}
              onClick={() => onChangeSection(section.id.toString())}
            >
              {section.section}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
