"use client"

import { useEffect, useState } from "react"
import {
  ArrowDownToLine,
  CheckCircle,
  Eye,
  FileText,
  Loader2,
  Trash2,
  X,
} from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

type ReportItem = {
  id: number
  student_id: string
  name: string
  section: string
  average: string | number
  status: string
  date_generated: string
}

type ReportRow = {
  subject: string
  teacher: string
  grades: {
    Q1: number | null
    Q2: number | null
    Q3: number | null
    Q4: number | null
  }
  average: number | null
  remarks: string | null
}

type ReportDetails = {
  student: {
    id: number
    student_id: string
    full_name: string
    section?: { display_name?: string } | string | null
  }
  reportCardRows: ReportRow[]
  gpa: number | null
  remarks: string | null
}

const quarters = ["Q1", "Q2", "Q3", "Q4"]

export default function GradeReportsPage() {
  const [gradeReports, setGradeReports] = useState<ReportItem[]>([])
  const [cards, setCards] = useState<{ name: string; value: number }[]>([])
  const [yearLevels, setYearLevels] = useState<string[]>([])
  const [sectionNames, setSectionNames] = useState<string[]>([])
  const [selectedYearLevel, setSelectedYearLevel] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalReport, setModalReport] = useState<ReportDetails | null>(null)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    fetchGradeReports()
  }, [selectedYearLevel, selectedSection, search])

  const fetchGradeReports = async () => {
    setIsLoading(true)

    try {
      const response = await api.get("/api/grade-reports", {
        params: {
          year_level: selectedYearLevel || undefined,
          section: selectedSection || undefined,
          search: search || undefined,
        },
      })

      const responseData = response.data?.data

      setGradeReports(responseData?.items ?? [])
      setCards(responseData?.cards ?? [])
      setYearLevels(responseData?.filters?.yearLevels ?? [])
      setSectionNames(responseData?.filters?.sectionNames ?? [])
    } catch (error) {
      console.error(error)
      toast.error("Unable to load grade reports.")
    } finally {
      setIsLoading(false)
    }
  }

  const openReportModal = async (studentId: number) => {
    setModalOpen(true)
    setModalLoading(true)
    setModalReport(null)

    try {
      const response = await api.get("/api/grade-reports", {
        params: { view_student: studentId },
      })

      const report = response.data?.data?.viewStudentReport

      if (!report) {
        toast.error("Unable to load report details.")
        setModalOpen(false)
        return
      }

      setModalReport(report)
    } catch (error) {
      console.error(error)
      toast.error("Unable to load report details.")
      setModalOpen(false)
    } finally {
      setModalLoading(false)
    }
  }

  const approveReport = async (studentId: number, studentName: string) => {
    setProcessingId(studentId)

    try {
      await api.post(`/api/grade-reports/${studentId}/approve`)
      toast.success(`Report card for ${studentName} approved.`)
      fetchGradeReports()
    } catch (error) {
      console.error(error)
      toast.error("Unable to approve report card.")
    } finally {
      setProcessingId(null)
    }
  }

  const deleteReport = async (studentId: number, studentName: string) => {
    const confirmed = window.confirm(`Delete report card for ${studentName}?`)

    if (!confirmed) {
      return
    }

    setProcessingId(studentId)

    try {
      await api.delete(`/api/grade-reports/${studentId}`)
      toast.success(`Report card for ${studentName} deleted.`)
      fetchGradeReports()
    } catch (error) {
      console.error(error)
      toast.error("Unable to delete report card.")
    } finally {
      setProcessingId(null)
    }
  }

  const downloadReportPdf = async (
    studentId: number,
    studentCode: string
  ) => {
    setProcessingId(studentId)

    try {
      const response = await api.get(`/api/grade-reports/${studentId}/pdf`, {
        responseType: "blob",
      })

      const blob = new Blob([response.data], {
        type: "application/pdf",
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${studentCode}-report-card.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      toast.error("Unable to download PDF.")
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="gs-main-page space-y-6">
      <div>
        <h1 className="gs-page-title gs-primary-text text-2xl font-bold">
          Grade Reports
        </h1>

        <p className="gs-page-subtitle text-gray-400">
          View, approve, and download student grade reports.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by student name or ID..."
            className="bg-[#0D0F1A] border border-[#545878] rounded-lg px-3 py-2 text-sm text-white w-full md:w-[300px]"
          />

          <select
            value={selectedYearLevel}
            onChange={(event) => setSelectedYearLevel(event.target.value)}
            className="bg-[#0D0F1A] border border-[#545878] rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="">All Year Levels</option>
            {yearLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(event) => setSelectedSection(event.target.value)}
            className="bg-[#0D0F1A] border border-[#545878] rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="">All Sections</option>
            {sectionNames.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-400">
          {isLoading ? "Loading grade reports..." : `${gradeReports.length} students found`}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.length > 0
          ? cards.map((card, index) => (
              <div
                key={index}
                className="gs-card rounded-lg px-4 py-4 flex flex-col justify-between bg-[#151729]"
              >
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                  {card.name}
                </p>
                <p className="text-white text-3xl font-bold mt-2">
                  {card.value}
                </p>
              </div>
            ))
          : [
              { name: "Total Reports", value: 0 },
              { name: "Available", value: 0 },
              { name: "Pending", value: 0 },
            ].map((card, index) => (
              <div
                key={index}
                className="gs-card rounded-lg px-4 py-4 flex flex-col justify-between bg-[#151729]"
              >
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                  {card.name}
                </p>
                <p className="text-white text-3xl font-bold mt-2">
                  {card.value}
                </p>
              </div>
            ))}
      </div>

      <div className="gs-card rounded-lg border border-[#545878] bg-[#151729]">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-sm text-left">
            <thead className="bg-[#1C2035] border-b border-t border-[#545878]">
              <tr className="text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">GPA / Average</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date Generated</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E3350]">
              {gradeReports.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    {isLoading ? "Loading reports..." : "No grade reports found."}
                  </td>
                </tr>
              ) : (
                gradeReports.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#22273D] transition"
                  >
                    <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                    <td className="px-4 py-3 text-white font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {item.section}
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-semibold font-mono">
                      {item.average}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg border text-[10px] tracking-wider ${
                          item.status === "Available"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {item.date_generated}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openReportModal(item.id)}
                          disabled={modalLoading && processingId === item.id}
                          className="flex items-center gap-1 text-gray-300 bg-[#22273D] hover:bg-[#2B304A] px-2 py-1 rounded-lg border border-[#31326E] text-xs"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => downloadReportPdf(item.id, item.student_id)}
                          disabled={processingId === item.id}
                          className="flex items-center gap-1 text-gray-300 bg-[#22273D] hover:bg-[#2B304A] px-2 py-1 rounded-lg border border-[#31326E] text-xs"
                        >
                          {processingId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowDownToLine className="w-4 h-4" />
                          )}
                          PDF
                        </button>

                        {item.status === "Pending" ? (
                          <button
                            type="button"
                            onClick={() => approveReport(item.id, item.name)}
                            disabled={processingId === item.id}
                            className="flex items-center gap-1 text-gray-300 bg-[#22273D] hover:bg-[#2B304A] px-2 py-1 rounded-lg border border-[#31326E] text-xs"
                          >
                            {processingId === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Approve
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => deleteReport(item.id, item.name)}
                            disabled={processingId === item.id}
                            className="flex items-center gap-1 text-gray-300 bg-[#22273D] hover:bg-[#2B304A] px-2 py-1 rounded-lg border border-[#31326E] text-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#13162A] w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl border border-[#545878]/40 max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-[#545878]/30 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#8B84FF]" />
                  Student Grade Report Card
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Academic Year 2025 - 2026
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-[#545878] hover:bg-[#22273D] hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6 flex-1">
              {modalLoading ? (
                <div className="py-12 text-center text-gray-400">
                  Loading report preview...
                </div>
              ) : modalReport ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0D0F1A] p-4 rounded-xl border border-[#545878]/25">
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                        Student Name
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {modalReport.student.full_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                        Grade & Section
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {typeof modalReport.student.section === "string"
                          ? modalReport.student.section
                          : modalReport.student.section?.display_name ?? "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                        Student ID
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {modalReport.student.student_id}
                      </p>
                    </div>
                  </div>

                  <div className="border border-[#545878]/30 rounded-xl overflow-hidden bg-[#0D0F1A] overflow-x-auto">
                    <table className="min-w-[480px] w-full text-xs text-left">
                      <thead className="bg-[#1C2035] border-b border-[#545878]/30">
                        <tr className="text-gray-400 uppercase tracking-wider font-semibold">
                          <th className="px-4 py-3">Subject</th>
                          {quarters.map((q) => (
                            <th
                              key={q}
                              className="px-3 py-3 text-center w-16"
                            >
                              {q}
                            </th>
                          ))}
                          <th className="px-4 py-3 text-center w-20">
                            Final
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2E3350]/40">
                        {modalReport.reportCardRows.map((row, index) => (
                          <tr
                            key={index}
                            className="hover:bg-[#22273D]/30 transition"
                          >
                            <td className="px-4 py-3 text-white font-medium">
                              {row.subject}
                            </td>
                            {quarters.map((q) => (
                              <td
                                key={q}
                                className="px-3 py-3 text-center text-gray-300 font-mono"
                              >
                                {row.grades[q as keyof typeof row.grades] ?? "—"}
                              </td>
                            ))}
                            <td className="px-4 py-3 text-center text-white font-bold font-mono">
                              {row.average ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-[#1E1F44]/40 border border-[#31326E]/60 rounded-xl px-4 sm:px-5 py-4">
                    <div>
                      <h4 className="text-white text-sm font-semibold">
                        General Point Average (GPA)
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Calculated based on subject averages.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[#8B84FF] text-2xl font-semibold font-mono">
                        GPA: {modalReport.gpa ?? "—"}
                      </p>
                      <span className="px-3 py-1 rounded text-xs bg-green-500/15 text-green-400 border border-green-500/20 font-bold font-mono">
                        {modalReport.remarks ?? "Pending"}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-gray-400">
                  No report preview available.
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[#545878]/30 px-4 sm:px-6 py-4 bg-[#0D0F1A]/50">
              <span className="text-xs text-green-400 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Preview generated from student grades
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-[#22273D] hover:bg-[#2B304A] text-gray-300 text-xs py-2 px-5 rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

