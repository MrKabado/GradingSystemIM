"use client"

import { useState } from "react"
import { SquarePen, Trash2, X } from "lucide-react"
import SectionDropdown from "@/components/common/SectionDropdown"
import { useData } from "@/context/DataContext"
import api from "@/lib/api"
import { toast } from "sonner"

export default function StudentsPage() {
  const [student_id, setStudentId] = useState("")
  const [first_name, setFirstName] = useState("")
  const [middle_name, setMiddleName] = useState("")
  const [last_name, setLastName] = useState("")
  const [section_id, setSectionId] = useState("")

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState("add")

  const { sections, students } = useData()

  const openAddModal = () => {
    setForm("add")

    setSelectedStudentId(null)

    setStudentId("")
    setFirstName("")
    setMiddleName("")
    setLastName("")
    setSectionId("")

    setModalOpen(true)
  }

  const openEditModal = (student: any) => {
    setForm("edit")

    setSelectedStudentId(student.id)

    setStudentId(student.student_id)
    setFirstName(student.first_name)
    setMiddleName(student.middle_name)
    setLastName(student.last_name)
    setSectionId(student.section_id)

    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !student_id ||
      !first_name ||
      !middle_name ||
      !last_name ||
      !section_id
    ) {
      toast.error("Please input the required fields")
      return
    }

    try {
      if (form === "add") {
        await api.post("/api/students", {
          student_id,
          first_name,
          middle_name,
          last_name,
          section_id,
        })

        toast.success("Student added successfully")
      } else {
        await api.put(`/api/students/${selectedStudentId}`, {
          student_id,
          first_name,
          middle_name,
          last_name,
          section_id,
        })

        toast.success("Student updated successfully")
      }

      setModalOpen(false)
    } catch (error) {
      console.log("Student form submit error", error)
      toast.error("Something went wrong")
    }
  }

  const openDeleteModal = (id: number) => {
    setSelectedDeleteId(id)
    setDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/api/students/${selectedDeleteId}`)

      toast.success("Student deleted successfully")

      setDeleteModalOpen(false)
      setSelectedDeleteId(null)
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete student")
    }
  }

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
          onClick={openAddModal}
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

        <SectionDropdown
        />

        <SectionDropdown
        />
      </div>

      {students.length === 0 ? (
        <div className="gs-card rounded-lg p-4 text-center">
          <h1>No student records found</h1>
          <p className="text-sm gs-secondary-text">
            Start by adding a new student.
          </p>
        </div>
      ) : (
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
                {students.map((student: any, index: number) => (
                  <tr
                    key={student.id}
                    className="transition hover:bg-[#22273D]"
                  >
                    <td className="gs-secondary-text px-4 py-3">{index + 1}</td>

                    <td className="px-4 py-3 font-medium text-white">
                      <a
                        href="#"
                        className="capitalize transition hover:text-[#8B84FF]"
                      >
                        {student.first_name} {student.middle_name}{" "}
                        {student.last_name}
                      </a>
                    </td>

                    <td className="gs-secondary-text px-4 py-3">
                      {student.student_id}
                    </td>

                    <td className="gs-secondary-text px-4 py-3">
                      {student.section?.year_level}
                    </td>

                    <td className="px-4 py-3">
                      <span className="w-fit rounded-lg border-[0.5px] border-[#31326E] bg-[#23264A] px-2 py-1 text-[#8B84FF]">
                        Section {student.section?.section}
                      </span>
                    </td>

                    <td className="gap-1 px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="flex w-fit items-center rounded-full border-2 border-[#152B30] bg-green-400 px-1 py-1 text-xs"></span>

                        <p className="gs-secondary-text">Active</p>
                      </div>
                    </td>

                    <td className="space-x-2 px-4 py-3 text-center">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(student)}
                          className="gs-primary-border-color gs-secondary-text flex cursor-pointer items-center gap-1 rounded-lg border bg-[#22273D] px-2 py-1 hover:bg-[#2B304A]"
                        >
                          <SquarePen className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          className="gs-primary-border-color gs-secondary-text flex h-full cursor-pointer items-center gap-1 rounded-lg border bg-[#22273D] px-2 py-1 hover:bg-[#2B304A]"
                          onClick={() => openDeleteModal(student.id)}
                        >
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
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="gs-card max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#545878] bg-[#13162A] shadow-xl">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-[#545878] px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {form === "add" ? "Add student" : "Edit student"}
                </h2>

                <p className="gs-secondary-text mt-1 text-xs">
                  {form === "add"
                    ? "Fill in the details to enroll a new student."
                    : "Update student details."}
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
            <form className="space-y-4 px-5 py-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Student ID
                </label>

                <input
                  type="text"
                  className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white outline-none"
                  value={student_id}
                  onChange={(e) => setStudentId(e.target.value)}
                  maxLength={8}
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
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">
                    Middle name
                  </label>

                  <input
                    type="text"
                    className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white outline-none"
                    value={middle_name}
                    onChange={(e) => setMiddleName(e.target.value)}
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
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Section
                </label>

                <select
                  className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white outline-none"
                  value={section_id}
                  onChange={(e) => setSectionId(e.target.value)}
                >
                  <option value="">Select</option>

                  {sections.map((section: any) => (
                    <option key={section.id} value={section.id}>
                      {section.section}
                    </option>
                  ))}
                </select>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap justify-end gap-2 border-t border-[#545878] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="gs-secondary-btn inline-flex cursor-pointer items-center justify-center px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-[#6366F1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5558e8]"
                >
                  {form === "add" ? "Create student" : "Update student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#545878] bg-[#13162A] p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-white">Delete Student</h2>

            <p className="gs-secondary-text mt-2 text-sm">
              Are you sure you want to delete this student? This action cannot
              be undone.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-lg border border-[#545878] px-4 py-2 text-sm text-white hover:bg-[#22273D]"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
