"use client"

import { useEffect, useState } from "react"
import { Eye, SquarePen, X } from "lucide-react"
import GradeLevelDropdown from "@/components/common/GradeLevelDropdown"
import SectionDropdown from "@/components/common/SectionDropdown"
import { useData, type Section, type GradeRows } from "@/context/DataContext"
import api from "@/lib/api"
import { toast } from "sonner"

type GradeDetail = {
  subject_id: number
  subject_name: string
  teacher: string | null
  quarters: {
    Q1: number | null
    Q2: number | null
    Q3: number | null
    Q4: number | null
  }
  average: number | null
}

type GradeDetailResponse = {
  status: string
  data: {
    student: {
      id: number
      student_id: string
      full_name: string
      section_id: number | null
      section?: Section | null
    }
    grades: GradeDetail[]
  }
}

export default function GradesPage() {
  const {
    sections,
    gradeRows,
    gradeQuarters,
    gradeActiveSection,
    fetchGrades,
    loading,
  } = useData()

  const [selectedGradeLevel, setSelectedGradeLevel] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [searchStudent, setSearchStudent] = useState("")
  const [modalMode, setModalMode] = useState<"view" | "edit" | null>(null)
  const [selectedRow, setSelectedRow] = useState<GradeRows | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [gradeDetail, setGradeDetail] = useState<GradeDetail[] | null>(null)
  const [gradeEditValues, setGradeEditValues] = useState<
    Record<number, Record<string, number | null>>
  >({})
  const [saving, setSaving] = useState(false)

  const selectedSectionName = selectedSection
    ? sections.find((section) => section.id.toString() === selectedSection)
        ?.section || ""
    : ""

  useEffect(() => {
    fetchGrades({
      year_level: selectedGradeLevel || undefined,
      section: selectedSectionName || undefined,
      search: searchStudent || undefined,
    })
  }, [selectedGradeLevel, selectedSectionName, searchStudent, fetchGrades])

  const openGradeModal = async (
    mode: "view" | "edit",
    student: GradeRows
  ) => {
    setModalMode(mode)
    setSelectedRow(student)
    setGradeDetail(null)
    setDetailLoading(true)

    try {
      const response = await api.get<GradeDetailResponse>(
        `/api/grades/${student.student_id}`
      )

      setGradeDetail(response.data.data.grades)

      if (mode === "edit") {
        setGradeEditValues(
          response.data.data.grades.reduce(
            (acc, grade) => {
              acc[grade.subject_id] = { ...grade.quarters }
              return acc
            },
            {} as Record<number, Record<string, number | null>>
          )
        )
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to load grade details.")
      setModalMode(null)
      setSelectedRow(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const closeModal = () => {
    setModalMode(null)
    setSelectedRow(null)
    setGradeDetail(null)
    setGradeEditValues({})
  }

  const handleGradeValueChange = (
    subjectId: number,
    quarter: string,
    value: string
  ) => {
    const numericValue = value === "" ? null : Number(value)
    setGradeEditValues((prev) => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [quarter]:
          numericValue === null || Number.isNaN(numericValue)
            ? null
            : numericValue,
      },
    }))
  }

  const handleSaveGrades = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!selectedRow) return

    setSaving(true)

    try {
      await api.put(`/api/grades/${selectedRow.student_id}`, {
        grades: gradeEditValues,
      })

      toast.success("Grades updated successfully.")
      closeModal()
      fetchGrades({
        year_level: selectedGradeLevel || undefined,
        section: selectedSectionName || undefined,
        search: searchStudent || undefined,
      })
    } catch (error) {
      console.error(error)
      toast.error("Unable to save grades.")
    } finally {
      setSaving(false)
    }
  }

  const totalStudents = gradeRows.length
  const passedStudents = gradeRows.filter(
    (row) => row.remarks === "Passed"
  ).length
  const failedStudents = gradeRows.filter(
    (row) => row.remarks === "Failed"
  ).length
  const classAverage = gradeRows
    .filter((row) => row.average !== null)
    .reduce((sum, row) => sum + (row.average ?? 0), 0)
  const gradeCount = gradeRows.filter((row) => row.average !== null).length
  const averageDisplay = gradeCount
    ? `${(classAverage / gradeCount).toFixed(1)}%`
    : "—"

  const displayQuarters = gradeQuarters.length
    ? gradeQuarters
    : ["Q1", "Q2", "Q3", "Q4"]

  const tableColSpan = displayQuarters.length + 5

  return (
    <div className="gs-main-page">
      {/* HEADER */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Grades</h1>

          <p className="gs-secondary-text text-sm">
            Manage and monitor all students grades
          </p>

          {gradeActiveSection && (
            <p className="gs-secondary-text text-xs mt-1">
              {gradeActiveSection.year_level} • Section {gradeActiveSection.section}
            </p>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center">
        <GradeLevelDropdown
          selectedGradeLevel={selectedGradeLevel}
          onChangeGradeLevel={setSelectedGradeLevel}
        />

        <SectionDropdown
          selectedSection={selectedSection}
          onChangeSection={setSelectedSection}
        />

        <input
          type="text"
          placeholder="Search student..."
          className="w-full rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 text-white outline-none"
          value={searchStudent}
          onChange={(e) => setSearchStudent(e.target.value)}
        />
      </div>

      {/* CARDS */}
      <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="gs-card rounded-lg px-4 py-4">
          <h1 className="gs-secondary-text text-md">Total Students</h1>
          <p className="gs-primary-text text-2xl font-semibold">{totalStudents}</p>
        </div>

        <div className="gs-card rounded-lg px-4 py-4">
          <h1 className="gs-secondary-text text-md">Passed</h1>
          <p className="gs-primary-text text-2xl font-semibold">{passedStudents}</p>
        </div>

        <div className="gs-card rounded-lg px-4 py-4">
          <h1 className="gs-secondary-text text-md">Failed</h1>
          <p className="gs-primary-text text-2xl font-semibold">{failedStudents}</p>
        </div>

        <div className="gs-card rounded-lg px-4 py-4">
          <h1 className="gs-secondary-text text-md">Class Average</h1>
          <p className="gs-primary-text text-2xl font-semibold">
            {averageDisplay}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="gs-card mt-6 overflow-x-auto rounded-lg border-[#545878]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-t border-b border-[#545878] bg-[#1C2035]">
            <tr className="gs-secondary-text text-xs tracking-wider uppercase">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Student Name</th>

              {displayQuarters.map((quarter) => (
                <th key={quarter} className="px-4 py-3">
                  {quarter}
                </th>
              ))}

              <th className="px-4 py-3">Average</th>
              <th className="px-4 py-3">Remarks</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#2E3350]">
            {gradeRows.length > 0 ? (
              gradeRows.map((student, index) => (
                <tr
                  key={student.student_id}
                  className="transition hover:bg-[#22273D]"
                >
                  <td className="gs-secondary-text px-4 py-3">{index + 1}</td>

                  <td className="gs-primary-text px-4 py-3 font-medium">
                    {student.name}
                  </td>

                  {displayQuarters.map((quarter) => (
                    <td
                      key={quarter}
                      className="gs-secondary-text px-4 py-3"
                    >
                      {student.grades[quarter as keyof typeof student.grades] ?? "—"}
                    </td>
                  ))}

                  <td className="gs-secondary-text px-4 py-3">
                    {student.average ?? "—"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-lg border px-2 py-1 text-xs ${
                        student.remarks === "Passed"
                          ? "gs-success-bg gs-success-text"
                          : "bg-[#3B2437] text-red-400"
                      }`}
                    >
                      {student.remarks || "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openGradeModal("view", student)}
                        className="gs-secondary-text flex items-center gap-1 rounded-lg border bg-[#22273D] px-2 py-1 hover:bg-[#2B304A]"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>

                      <button
                        onClick={() => openGradeModal("edit", student)}
                        className="gs-secondary-text flex items-center gap-1 rounded-lg border bg-[#22273D] px-2 py-1 hover:bg-[#2B304A]"
                      >
                        <SquarePen className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-8 text-center text-sm text-[#9BA3C3]"
                  colSpan={tableColSpan}
                >
                  {loading ? "Loading grades..." : "No grade records available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalMode && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="grade-modal-title"
        >
          <div className="gs-card w-full max-w-3xl overflow-hidden rounded-xl border border-[#545878] bg-[#13162A] shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#545878] px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white" id="grade-modal-title">
                  {modalMode === "view" ? "View Grades" : "Edit Grades"}
                </h2>

                <p className="gs-secondary-text mt-1 text-xs">
                  {selectedRow?.name}
                  {gradeActiveSection ? ` • ${gradeActiveSection.year_level} - Section ${gradeActiveSection.section}` : ""}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-[#545878] transition hover:bg-[#22273D] hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              {detailLoading ? (
                <div className="text-center text-sm text-[#9BA3C3]">Loading grade details...</div>
              ) : gradeDetail ? (
                modalMode === "view" ? (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-lg border border-[#545878] bg-[#0F1222]">
                      <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-[#545878] bg-[#1C2035]">
                          <tr className="gs-secondary-text text-xs uppercase tracking-wider">
                            <th className="px-4 py-3">Subject</th>
                            <th className="px-4 py-3">Teacher</th>
                            {displayQuarters.map((quarter) => (
                              <th key={quarter} className="px-4 py-3">
                                {quarter}
                              </th>
                            ))}
                            <th className="px-4 py-3">Average</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2E3350]">
                          {gradeDetail.map((subject) => (
                            <tr key={subject.subject_id} className="hover:bg-[#171A2F]">
                              <td className="px-4 py-3 font-medium text-white">
                                {subject.subject_name}
                              </td>
                              <td className="gs-secondary-text px-4 py-3">
                                {subject.teacher || "—"}
                              </td>
                              {displayQuarters.map((quarter) => (
                                <td key={quarter} className="gs-secondary-text px-4 py-3">
                                  {subject.quarters[quarter as keyof typeof subject.quarters] ?? "—"}
                                </td>
                              ))}
                              <td className="gs-secondary-text px-4 py-3">
                                {subject.average ?? "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveGrades} className="space-y-4">
                    <div className="overflow-x-auto rounded-lg border border-[#545878] bg-[#0F1222]">
                      <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-[#545878] bg-[#1C2035]">
                          <tr className="gs-secondary-text text-xs uppercase tracking-wider">
                            <th className="px-4 py-3">Subject</th>
                            <th className="px-4 py-3">Teacher</th>
                            {displayQuarters.map((quarter) => (
                              <th key={quarter} className="px-4 py-3">
                                {quarter}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2E3350]">
                          {gradeDetail.map((subject) => (
                            <tr key={subject.subject_id} className="hover:bg-[#171A2F]">
                              <td className="px-4 py-3 font-medium text-white">
                                {subject.subject_name}
                              </td>
                              <td className="gs-secondary-text px-4 py-3">
                                {subject.teacher || "—"}
                              </td>
                              {displayQuarters.map((quarter) => (
                                <td key={quarter} className="px-4 py-3">
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={
                                      gradeEditValues[subject.subject_id]?.[quarter] ?? ""
                                    }
                                    onChange={(e) =>
                                      handleGradeValueChange(
                                        subject.subject_id,
                                        quarter,
                                        e.target.value
                                      )
                                    }
                                    className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-2 py-1 text-sm text-white outline-none"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2 border-t border-[#545878] pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="bg-[#22273D] hover:bg-[#2B304A] text-gray-300 text-sm py-2 px-4 rounded-lg"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#6366F1] hover:bg-[#5558e8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 px-4 rounded-lg"
                      >
                        {saving ? "Saving..." : "Save Grades"}
                      </button>
                    </div>
                  </form>
                )
              ) : (
                <div className="text-center text-sm text-[#9BA3C3]">
                  No grade details available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
