"use client"

import { Eye, SquarePen, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

const cards = [
  {
    name: "Total Students",
    value: "3",
  },
  {
    name: "Passed",
    value: "2",
  },
  {
    name: "Failed",
    value: "1",
  },
  {
    name: "Class Average",
    value: "66.7%",
  },
]

const quarters = ["Q1", "Q2", "Q3", "Q4"]

const students = [
  {
    id: 1,
    name: "Jerson Jay Bonghanoy",
    grades: {
      Q1: 88,
      Q2: 88,
      Q3: 88,
      Q4: 88,
    },
    average: 88,
    remarks: "Passed",
  },
  {
    id: 2,
    name: "John Gave Dela Cerna",
    grades: {
      Q1: 72,
      Q2: 68,
      Q3: 70,
      Q4: 70,
    },
    average: 70,
    remarks: "Failed",
  },
  {
    id: 3,
    name: "Mark Maturan",
    grades: {
      Q1: 95,
      Q2: 92,
      Q3: 96,
      Q4: 99,
    },
    average: 94.3,
    remarks: "Passed",
  },
]

export default function GradesPage() {
  return (
    <div className="gs-main-page">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Grades</h1>

          <p className="gs-secondary-text text-sm">
            Manage and monitor all students grades
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex justify-evenly gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="gs-secondary-text flex w-80 items-center justify-center gap-1 rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 outline-none">
            <h1>Select Year Level</h1>
            <ChevronDown />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuGroup className="gs-secondary-text border-none bg-[#13162A] text-white">
              <DropdownMenuItem className="rounded-none">
                Grade 7
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-none">
                Grade 8
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-none">
                Grade 9
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-none">
                Grade 10
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="gs-secondary-text flex w-80 items-center justify-center gap-1 rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 outline-none">
            <h1>Select Section</h1>
            <ChevronDown />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuGroup className="gs-secondary-text border-none bg-[#13162A] text-white">
              <DropdownMenuItem className="rounded-none">
                Section A
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-none">
                Section B
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-none">
                Section C
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-none">
                Section D
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="text"
          placeholder="Search student..."
          className="w-full rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 text-white outline-none"
        />
      </div>

      {/* CARDS */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div key={index} className="gs-card rounded-lg px-4 py-2">
            <h1 className="gs-secondary-text text-md">{card.name}</h1>

            <p className="gs-primary-text text-2xl font-semibold">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="gs-card mt-6 overflow-x-auto rounded-lg border-[#545878]">
        <table className="min-w-full text-left text-sm">
          {/* HEADER */}
          <thead className="border-t border-b border-[#545878] bg-[#1C2035]">
            <tr className="gs-secondary-text text-xs tracking-wider uppercase">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Student Name</th>

              {quarters.map((quarter) => (
                <th key={quarter} className="px-4 py-3">
                  {quarter}
                </th>
              ))}

              <th className="px-4 py-3">Average</th>
              <th className="px-4 py-3">Remarks</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-[#2E3350]">
            {students.map((student, index) => (
              <tr key={student.id} className="transition hover:bg-[#22273D]">
                {/* INDEX */}
                <td className="gs-secondary-text px-4 py-3">{index + 1}</td>

                {/* NAME */}
                <td className="gs-primary-text px-4 py-3 font-medium">
                  {student.name}
                </td>

                {/* GRADES */}
                {quarters.map((quarter) => (
                  <td key={quarter} className="gs-secondary-text px-4 py-3">
                    {student.grades[quarter as keyof typeof student.grades]}
                  </td>
                ))}

                {/* AVERAGE */}
                <td className="gs-secondary-text px-4 py-3">
                  {student.average}
                </td>

                {/* REMARKS */}
                <td className="px-4 py-3">
                  <span
                    className={`rounded-lg border px-2 py-1 text-xs ${
                      student.remarks === "Passed"
                        ? "gs-success-bg gs-success-text"
                        : "bg-[#3B2437] text-red-400"
                    }`}
                  >
                    {student.remarks}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="gs-secondary-text flex items-center gap-1 rounded-lg border bg-[#22273D] px-2 py-1 hover:bg-[#2B304A]">
                      <Eye className="h-4 w-4" />
                      View
                    </button>

                    <button className="gs-secondary-text flex items-center gap-1 rounded-lg border bg-[#22273D] px-2 py-1 hover:bg-[#2B304A]">
                      <SquarePen className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
