"use client"

import { useState } from "react"
import { SquarePen, Trash2, X } from "lucide-react"
import SectionDropdown from "@/components/common/SectionDropdown"
import GradeLevelDropdown from "@/components/common/GradeLevelDropdown"
import { useData } from "@/context/DataContext"
import api from "@/lib/api"
import { toast } from "sonner"

export default function SectionsPage() {
  const { sections } = useData()

  const [year_level, setYearLevel] = useState("")
  const [section, setSection] = useState("")
  const [class_adviser, setClassAdviser] = useState("")

  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null
  )

  // Filters
  const [searchSection, setSearchSection] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedGradeLevel, setSelectedGradeLevel] = useState("")

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState("add")

  const openAddModal = () => {
    setForm("add")

    setSelectedSectionId(null)

    setYearLevel("")
    setSection("")
    setClassAdviser("")

    setModalOpen(true)
  }

  const openEditModal = (sectionData: any) => {
    setForm("edit")

    setSelectedSectionId(sectionData.id)

    setYearLevel(sectionData.year_level)
    setSection(sectionData.section)
    setClassAdviser(sectionData.class_adviser || "")

    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!year_level || !section || !class_adviser) {
      toast.error("Please input the required fields")
      return
    }

    try {
      if (form === "add") {
        await api.post("/api/sections", {
          year_level,
          section,
          class_adviser,
        })

        toast.success("Section added successfully")
      } else {
        await api.put(`/api/sections/${selectedSectionId}`, {
          year_level,
          section,
          class_adviser,
        })

        toast.success("Section updated successfully")
      }

      setModalOpen(false)
    } catch (error) {
      console.log("Section form submit error", error)
      toast.error("Something went wrong")
    }
  }

  const openDeleteModal = (id: number) => {
    setSelectedDeleteId(id)
    setDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/api/sections/${selectedDeleteId}`)

      toast.success("Section deleted successfully")

      setDeleteModalOpen(false)
      setSelectedDeleteId(null)
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete section")
    }
  }

  const filtered = sections.filter((sectionItem: any) => {
    const matchesSearch =
      sectionItem.section
        .toLowerCase()
        .includes(searchSection.toLowerCase()) ||
      sectionItem.class_adviser
        ?.toLowerCase()
        .includes(searchSection.toLowerCase())

    const matchesGrade = selectedGradeLevel
      ? sectionItem.year_level === selectedGradeLevel
      : true

    const matchesSection = selectedSection
      ? sectionItem.id === Number(selectedSection)
      : true

    return matchesSearch && matchesGrade && matchesSection
  })

  return (
    <div className="gs-main-page">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Sections</h1>

          <p className="gs-secondary-text text-sm">
            Manage grade levels and class sections
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex cursor-pointer items-center rounded-lg bg-indigo-500 px-6 py-2 text-sm text-white hover:bg-indigo-600"
        >
          Add Section
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <input
          type="text"
          placeholder="Search sections or adviser..."
          className="w-full rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 text-white outline-none"
          value={searchSection}
          onChange={(e) => setSearchSection(e.target.value)}
        />

        <GradeLevelDropdown
          selectedGradeLevel={selectedGradeLevel}
          onChangeGradeLevel={setSelectedGradeLevel}
        />

        <SectionDropdown
          selectedSection={selectedSection}
          onChangeSection={setSelectedSection}
        />
      </div>

      {sections.length === 0 ? (
        <div className="gs-card rounded-lg p-4 text-center">
          <h1>No section records found</h1>

          <p className="text-sm gs-secondary-text">
            Start by adding a new section.
          </p>
        </div>
      ) : (
        <div className="gs-card space-y-4 rounded-lg py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-300">
                Section List
              </h1>

              <p className="gs-secondary-text mt-1 text-xs">
                All sections in the system
              </p>
            </div>

            <div className="rounded-lg bg-[#1E1F44] px-3 py-1 text-[#8B84FF]">
              <h1 className="text-xs">{filtered.length} Sections</h1>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto border-[#545878]">
            <table className="min-w-full text-left text-sm">
              <thead className="border-t border-b border-[#545878] bg-[#1C2035]">
                <tr className="gs-secondary-text text-xs tracking-wider uppercase">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Grade level</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Class Adviser</th>
                  <th className="px-4 py-3">Students</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#2E3350]">
                {filtered.map((sectionItem: any, index: number) => (
                  <tr
                    key={sectionItem.id}
                    className="transition hover:bg-[#22273D]"
                  >
                    <td className="gs-secondary-text px-4 py-3">
                      {index + 1}
                    </td>

                    <td className="gs-secondary-text px-4 py-3">
                      Grade {sectionItem.year_level}
                    </td>

                    <td className="px-4 py-3">
                      <span className="w-fit rounded-lg border-[0.5px] border-[#31326E] bg-[#23264A] px-2 py-1 text-[#8B84FF]">
                        Section {sectionItem.section}
                      </span>
                    </td>

                    <td className="gs-secondary-text px-4 py-3">
                      {sectionItem.class_adviser}
                    </td>

                    <td className="gs-secondary-text px-4 py-3">
                      {sectionItem.students_count}
                    </td>

                    <td className="space-x-2 px-4 py-3 text-center">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(sectionItem)}
                          className="gs-primary-border-color gs-secondary-text flex cursor-pointer items-center gap-1 rounded-lg border bg-[#22273D] px-2 py-1 hover:bg-[#2B304A]"
                        >
                          <SquarePen className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            openDeleteModal(sectionItem.id)
                          }
                          className="gs-primary-border-color gs-secondary-text flex h-full cursor-pointer items-center gap-1 rounded-lg border bg-[#22273D] px-2 py-1 hover:bg-[#2B304A]"
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
                  {form === "add" ? "Add section" : "Edit section"}
                </h2>

                <p className="gs-secondary-text mt-1 text-xs">
                  {form === "add"
                    ? "Fill in the details to add a new section."
                    : "Update section details."}
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
                  Grade level
                </label>

                <input
                  type="text"
                  placeholder="e.g. 7"
                  className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white placeholder-[#545878] outline-none"
                  value={year_level}
                  onChange={(e) => setYearLevel(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Section name
                </label>

                <input
                  type="text"
                  placeholder="e.g. A"
                  className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white placeholder-[#545878] outline-none"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Class Adviser
                </label>

                <input
                  type="text"
                  placeholder="e.g. Mr. Erico Casil"
                  className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white placeholder-[#545878] outline-none"
                  value={class_adviser}
                  onChange={(e) => setClassAdviser(e.target.value)}
                />
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
                  {form === "add"
                    ? "Create section"
                    : "Update section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#545878] bg-[#13162A] p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-white">
              Delete Section
            </h2>

            <p className="gs-secondary-text mt-2 text-sm">
              Are you sure you want to delete this section? This action cannot
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