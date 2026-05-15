"use client"

import { useState } from "react"
import { SquarePen, Trash2, X, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import CustomDropdownMenu from "@/components/common/Dropdown"

const students = [
  {
    id: 1,
    studentId: "2024-001",
    fullName: "Lebron James",
    gradeLevel: "Grade 10",
    section: "A",
    status: "Active",
  },
  {
    id: 2,
    studentId: "2024-002",
    fullName: "John Casagan",
    gradeLevel: "Grade 9",
    section: "B",
    status: "Active",
  },
  {
    id: 3,
    studentId: "2024-003",
    fullName: "Stephen Curry",
    gradeLevel: "Grade 8",
    section: "C",
    status: "Active",
  },
]

export default function StudentsPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="gs-main-page">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Students</h1>

          <p className="gs-secondary-text text-sm">
            Manage and monitor all enrolled students
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex cursor-pointer items-center rounded-lg bg-indigo-500 px-6 py-2 text-sm text-white hover:bg-indigo-600"
        >
          Add Student
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search student..."
          className="w-full rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 text-white outline-none"
        />

        <CustomDropdownMenu
          selectName="Select Year Level"
          option1="Grade 7"
          option2="Grade 8"
          option3="Grade 9"
          option4="Grade 10"
        />

        <CustomDropdownMenu
          selectName="Select Section"
          option1="Section A"
          option2="Section B"
          option3="Section C"
          option4="Section D"
        />
      </div>

      {/* TABLE */}
      <div className="gs-card space-y-4 rounded-lg py-4">
        <div className="flex items-center justify-between px-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-300">
              Student List
            </h1>

            <p className="gs-secondary-text mt-1 text-xs">
              Manage and monitor all students
            </p>
          </div>

          <div className="rounded-lg bg-[#1E1F44] px-3 py-1 text-[#8B84FF]">
            <h1 className="text-xs">{students.length} Students</h1>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border-[#545878]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-t border-b border-[#545878] bg-[#1C2035]">
              <tr className="gs-secondary-text text-xs tracking-wider uppercase">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Grade Level</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#2E3350]">
              {students.map((student, index) => (
                <tr key={student.id} className="transition hover:bg-[#22273D]">
                  <td className="px-4 py-3 text-white">{index + 1}</td>

                  <td className="px-4 py-3 font-medium text-white">
                    <a href="#" className="transition hover:text-[#8B84FF]">
                      {student.fullName}
                    </a>
                  </td>

                  <td className="gs-secondary-text px-4 py-3">
                    {student.studentId}
                  </td>

                  <td className="gs-secondary-text px-4 py-3">
                    {student.gradeLevel}
                  </td>

                  <td className="px-4 py-3">
                    <span className="w-fit rounded-lg border-[0.5px] border-[#31326E] bg-[#23264A] px-2 py-1 text-[#8B84FF]">
                      Section {student.section}
                    </span>
                  </td>

                  <td className="gap-1 px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="flex w-fit items-center rounded-full border-2 border-[#152B30] bg-green-400 px-1 py-1 text-xs"></span>

                      <p className="gs-secondary-text">{student.status}</p>
                    </div>
                  </td>

                  <td className="space-x-2 px-4 py-3 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button className="gs-primary-border-color gs-secondary-text flex cursor-pointer items-center gap-1 rounded-lg border bg-[#22273D] px-2 py-1 hover:bg-[#2B304A]">
                        <SquarePen className="h-4 w-4" />
                        Edit
                      </button>

                      <button className="gs-primary-border-color gs-secondary-text flex h-full cursor-pointer items-center gap-1 rounded-lg border bg-[#22273D] px-2 py-1 hover:bg-[#2B304A]">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="gs-card max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#545878] bg-[#13162A] shadow-xl">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-[#545878] px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Add student
                </h2>

                <p className="gs-secondary-text mt-1 text-xs">
                  Fill in the details to enroll a new student.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-[#545878] transition hover:bg-[#22273D] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}
            <form className="space-y-4 px-5 py-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Student ID
                </label>

                <input
                  type="text"
                  className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">
                    First name
                  </label>

                  <input
                    type="text"
                    className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">
                    Middle name
                  </label>

                  <input
                    type="text"
                    className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Last name
                </label>

                <input
                  type="text"
                  className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Section
                </label>

                <select className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white outline-none">
                  <option>Section A</option>
                  <option>Section B</option>
                  <option>Section C</option>
                  <option>Section D</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap justify-end gap-2 border-t border-[#545878] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="gs-secondary-btn inline-flex items-center justify-center px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#6366F1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5558e8]"
                >
                  Create student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
