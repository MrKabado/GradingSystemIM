"use client"

import { useState, useMemo, useEffect } from "react"
import { SquarePen, X, ChevronDown, Eye, Search } from "lucide-react"

// Types
interface SubjectGrade {
  Q1: number
  Q2: number
  Q3: number
  Q4: number
  Final: number
}

interface Student {
  id: number
  studentId: string
  fullName: string
  gradeLevel: string
  section: string
  adviser: string
  gradesBySubject: Record<string, SubjectGrade>
}

// Initial Mock Data
const initialStudentsData: Student[] = [
  {
    id: 1,
    studentId: "2024-001",
    fullName: "Jerson Jay Cruta Bonghanoy",
    gradeLevel: "Grade 7",
    section: "Section A",
    adviser: "Mr. Erico Casil",
    gradesBySubject: {
      Mathematics: { Q1: 88, Q2: 90, Q3: 85, Q4: 89, Final: 88 },
      English: { Q1: 88, Q2: 90, Q3: 85, Q4: 89, Final: 88 },
      Science: { Q1: 88, Q2: 90, Q3: 85, Q4: 89, Final: 88 },
      MAPEH: { Q1: 88, Q2: 90, Q3: 85, Q4: 89, Final: 88 },
    },
  },
  {
    id: 2,
    studentId: "2024-002",
    fullName: "John Gave Dela Cerna",
    gradeLevel: "Grade 7",
    section: "Section A",
    adviser: "Mr. Erico Casil",
    gradesBySubject: {
      Mathematics: { Q1: 72, Q2: 68, Q3: 70, Q4: 70, Final: 70 },
      English: { Q1: 75, Q2: 74, Q3: 78, Q4: 73, Final: 75 },
      Science: { Q1: 70, Q2: 65, Q3: 68, Q4: 67, Final: 67.5 },
      MAPEH: { Q1: 80, Q2: 82, Q3: 79, Q4: 81, Final: 80.5 },
    },
  },
  {
    id: 3,
    studentId: "2024-003",
    fullName: "Mark Maturan",
    gradeLevel: "Grade 7",
    section: "Section A",
    adviser: "Mr. Erico Casil",
    gradesBySubject: {
      Mathematics: { Q1: 95, Q2: 92, Q3: 96, Q4: 99, Final: 95.5 },
      English: { Q1: 94, Q2: 93, Q3: 95, Q4: 97, Final: 94.8 },
      Science: { Q1: 96, Q2: 95, Q3: 97, Q4: 98, Final: 96.5 },
      MAPEH: { Q1: 92, Q2: 94, Q3: 93, Q4: 95, Final: 93.5 },
    },
  },
  {
    id: 4,
    studentId: "2024-004",
    fullName: "Lebron James",
    gradeLevel: "Grade 8",
    section: "Section B",
    adviser: "Mrs. Maria Santos",
    gradesBySubject: {
      Mathematics: { Q1: 85, Q2: 87, Q3: 88, Q4: 86, Final: 86.5 },
      Science: { Q1: 89, Q2: 90, Q3: 92, Q4: 91, Final: 90.5 },
    },
  },
  {
    id: 5,
    studentId: "2024-005",
    fullName: "Stephen Curry",
    gradeLevel: "Grade 9",
    section: "Section C",
    adviser: "Mr. Jose Reyes",
    gradesBySubject: {
      English: { Q1: 92, Q2: 94, Q3: 95, Q4: 96, Final: 94.3 },
      Filipino: { Q1: 90, Q2: 91, Q3: 89, Q4: 92, Final: 90.5 },
    },
  },
]

export default function SubjectsPage() {
  // Filters State
  const [yearLevel, setYearLevel] = useState("Grade 7")
  const [section, setSection] = useState("Section A")
  const [searchQuery, setSearchQuery] = useState("")

  // Active Subject State
  const [selectedSubject, setSelectedSubject] = useState("Mathematics")

  // Modal States
  const [viewStudentId, setViewStudentId] = useState<number | null>(null)
  const [editStudentId, setEditStudentId] = useState<number | null>(null)

  // Students State
  const [students, setStudents] = useState<Student[]>(initialStudentsData)

  // Dropdown States
  const [yearLevelDropdownOpen, setYearLevelDropdownOpen] = useState(false)
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false)

  // Temporary Edit Grades State
  const [tempGrades, setTempGrades] = useState<Record<string, SubjectGrade>>({})

  // Determine subjects offered in the selected Grade & Section
  const availableSubjects = useMemo(() => {
    if (yearLevel === "Grade 7" && section === "Section A") {
      return [
        { name: "Mathematics", teacher: "Juan Dela Cruz" },
        { name: "English", teacher: "Jose Reyes" },
        { name: "Science", teacher: "Maria Santos" },
        { name: "MAPEH", teacher: "Ana Garcia" },
      ]
    } else if (yearLevel === "Grade 8" && section === "Section B") {
      return [
        { name: "Mathematics", teacher: "Juan Dela Cruz" },
        { name: "Science", teacher: "Maria Santos" },
      ]
    } else if (yearLevel === "Grade 9" && section === "Section C") {
      return [
        { name: "English", teacher: "Jose Reyes" },
        { name: "Filipino", teacher: "Ana Garcia" },
      ]
    } else {
      return [
        { name: "Filipino", teacher: "Ana Garcia" },
        { name: "Science", teacher: "Maria Santos" },
      ]
    }
  }, [yearLevel, section])

  // Automatically reset selected subject if not available in the selected section
  useEffect(() => {
    if (!availableSubjects.some((s) => s.name === selectedSubject)) {
      setSelectedSubject(availableSubjects[0]?.name || "")
    }
  }, [availableSubjects, selectedSubject])

  // Filter students for Year Level and Section
  const currentStudents = useMemo(() => {
    return students.filter(
      (s) => s.gradeLevel === yearLevel && s.section === section
    )
  }, [students, yearLevel, section])

  // Filter students by search query
  const filteredStudents = useMemo(() => {
    return currentStudents.filter(
      (s) =>
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [currentStudents, searchQuery])

  // Calculate top summary cards
  const stats = useMemo(() => {
    const total = currentStudents.length
    if (total === 0) {
      return { total: 0, passed: 0, failed: 0, classAverage: 0 }
    }

    let passedCount = 0
    let failedCount = 0
    let classAverageSum = 0

    currentStudents.forEach((student) => {
      const activeGrade = student.gradesBySubject[selectedSubject]
      const avg = activeGrade
        ? (activeGrade.Q1 + activeGrade.Q2 + activeGrade.Q3 + activeGrade.Q4) / 4
        : 0

      classAverageSum += avg
      if (avg >= 75) {
        passedCount++
      } else {
        failedCount++
      }
    })

    const classAverage = Number((classAverageSum / total).toFixed(1))

    return {
      total,
      passed: passedCount,
      failed: failedCount,
      classAverage,
    }
  }, [currentStudents, selectedSubject])

  // Initialize edit grades when opening Edit Modal
  const openEditModal = (studentId: number) => {
    const student = students.find((s) => s.id === studentId)
    if (student) {
      setTempGrades(JSON.parse(JSON.stringify(student.gradesBySubject)))
      setEditStudentId(studentId)
    }
  }

  // Handle live updates inside Edit Grades inputs
  const handleGradeChange = (
    subj: string,
    quarter: "Q1" | "Q2" | "Q3" | "Q4",
    value: string
  ) => {
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0))
    setTempGrades((prev) => {
      const updatedSubj = { ...prev[subj] }
      updatedSubj[quarter] = numValue
      // Dynamically calculate new final grade for this subject
      updatedSubj.Final = Number(
        (
          (updatedSubj.Q1 + updatedSubj.Q2 + updatedSubj.Q3 + updatedSubj.Q4) /
          4
        ).toFixed(1)
      )
      return {
        ...prev,
        [subj]: updatedSubj,
      }
    })
  }

  // Save the edited grades
  const saveEditedGrades = () => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === editStudentId) {
          return {
            ...student,
            gradesBySubject: tempGrades,
          }
        }
        return student
      })
    )
    setEditStudentId(null)
  }

  // Student being viewed details
  const viewStudent = useMemo(() => {
    return students.find((s) => s.id === viewStudentId)
  }, [students, viewStudentId])

  // Student being edited details
  const editStudent = useMemo(() => {
    return students.find((s) => s.id === editStudentId)
  }, [students, editStudentId])

  // Compute Adviser
  const activeAdviser = useMemo(() => {
    return currentStudents[0]?.adviser || "N/A"
  }, [currentStudents])

  // Compute live calculations for Edit modal bottom section (Averages and GPA)
  const editModalCalculations = useMemo(() => {
    if (!tempGrades) return null
    const subjectsList = Object.keys(tempGrades)
    if (subjectsList.length === 0) return null

    let q1Sum = 0
    let q2Sum = 0
    let q3Sum = 0
    let q4Sum = 0
    let finalSum = 0

    subjectsList.forEach((subj) => {
      const sg = tempGrades[subj]
      q1Sum += sg.Q1
      q2Sum += sg.Q2
      q3Sum += sg.Q3
      q4Sum += sg.Q4
      finalSum += sg.Final
    })

    const count = subjectsList.length
    const q1Avg = Number((q1Sum / count).toFixed(1))
    const q2Avg = Number((q2Sum / count).toFixed(1))
    const q3Avg = Number((q3Sum / count).toFixed(1))
    const q4Avg = Number((q4Sum / count).toFixed(1))
    const gpa = Number((finalSum / count).toFixed(1))

    return {
      q1Avg,
      q2Avg,
      q3Avg,
      q4Avg,
      gpa,
      isPassed: gpa >= 75,
    }
  }, [tempGrades])

  // Compute calculations for View modal
  const viewModalCalculations = useMemo(() => {
    if (!viewStudent) return null
    const subjectsList = Object.keys(viewStudent.gradesBySubject)
    if (subjectsList.length === 0) return null

    let q1Sum = 0
    let q2Sum = 0
    let q3Sum = 0
    let q4Sum = 0
    let finalSum = 0

    subjectsList.forEach((subj) => {
      const sg = viewStudent.gradesBySubject[subj]
      q1Sum += sg.Q1
      q2Sum += sg.Q2
      q3Sum += sg.Q3
      q4Sum += sg.Q4
      finalSum += sg.Final
    })

    const count = subjectsList.length
    const q1Avg = Number((q1Sum / count).toFixed(1))
    const q2Avg = Number((q2Sum / count).toFixed(1))
    const q3Avg = Number((q3Sum / count).toFixed(1))
    const q4Avg = Number((q4Sum / count).toFixed(1))
    const gpa = Number((finalSum / count).toFixed(1))

    return {
      q1Avg,
      q2Avg,
      q3Avg,
      q4Avg,
      gpa,
      isPassed: gpa >= 75,
    }
  }, [viewStudent])

  return (
    <div className="gs-main-page">
      {/* HEADER */}
      <div className="flex flex-col gap-1 border-b border-[#545878] pb-4">
        <h1 className="text-3xl font-semibold text-white tracking-wide">Grades</h1>
        <p className="gs-secondary-text text-sm">
          Manage and monitor all students grades
        </p>
        <span className="text-xs text-[#8B84FF] mt-2 font-medium bg-[#1E1F44] w-fit px-3 py-1 rounded-full border border-[#31326E]">
          S.Y. 2025 - 2026 - 4th Quarter
        </span>
      </div>

      {/* FILTERS PANEL */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Year Level Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setYearLevelDropdownOpen(!yearLevelDropdownOpen)
                setSectionDropdownOpen(false)
              }}
              className="gs-secondary-text flex w-44 items-center justify-between gap-2 rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2.5 outline-none hover:border-[#8B84FF] hover:text-white transition duration-200"
            >
              <span className="text-white font-medium">{yearLevel}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {yearLevelDropdownOpen && (
              <div className="absolute left-0 mt-1.5 z-40 w-44 rounded-lg border border-[#545878] bg-[#13162A] py-1 shadow-xl">
                {["Grade 7", "Grade 8", "Grade 9", "Grade 10"].map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setYearLevel(level)
                      setYearLevelDropdownOpen(false)
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition hover:bg-[#22273D] ${
                      yearLevel === level ? "text-[#8B84FF] font-medium" : "text-gray-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setSectionDropdownOpen(!sectionDropdownOpen)
                setYearLevelDropdownOpen(false)
              }}
              className="gs-secondary-text flex w-44 items-center justify-between gap-2 rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2.5 outline-none hover:border-[#8B84FF] hover:text-white transition duration-200"
            >
              <span className="text-white font-medium">{section}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {sectionDropdownOpen && (
              <div className="absolute left-0 mt-1.5 z-40 w-44 rounded-lg border border-[#545878] bg-[#13162A] py-1 shadow-xl">
                {["Section A", "Section B", "Section C", "Section D"].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setSection(sec)
                      setSectionDropdownOpen(false)
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition hover:bg-[#22273D] ${
                      section === sec ? "text-[#8B84FF] font-medium" : "text-gray-300"
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Student */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#545878] bg-[#13162A] pl-10 pr-4 py-2.5 text-white outline-none focus:border-[#8B84FF] transition"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#545878]" />
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="gs-card rounded-xl p-5 hover:border-[#8B84FF] transition duration-300">
          <h2 className="gs-secondary-text text-sm font-medium">Total Students</h2>
          <p className="text-white text-3xl font-semibold mt-2">
            {stats.total}
          </p>
        </div>
        <div className="gs-card rounded-xl p-5 hover:border-[#8B84FF] transition duration-300">
          <h2 className="gs-secondary-text text-sm font-medium">Passed</h2>
          <p className="text-[#34D399] text-3xl font-semibold mt-2">
            {stats.passed}
          </p>
        </div>
        <div className="gs-card rounded-xl p-5 hover:border-[#8B84FF] transition duration-300">
          <h2 className="gs-secondary-text text-sm font-medium">Failed</h2>
          <p className="text-[#F87171] text-3xl font-semibold mt-2">
            {stats.failed}
          </p>
        </div>
        <div className="gs-card rounded-xl p-5 hover:border-[#8B84FF] transition duration-300">
          <h2 className="gs-secondary-text text-sm font-medium">Class Average</h2>
          <p className="text-[#8B84FF] text-3xl font-semibold mt-2">
            {stats.total > 0 ? `${stats.classAverage} %` : "—"}
          </p>
        </div>
      </div>

      {/* SUBJECT SELECTION TABS */}
      <div className="space-y-2">
        <h3 className="gs-secondary-text text-xs uppercase tracking-wider font-semibold">Active Subject Offered</h3>
        <div className="flex flex-wrap gap-2 border-b border-[#545878]/30 pb-3">
          {availableSubjects.map((sub) => (
            <button
              key={sub.name}
              onClick={() => setSelectedSubject(sub.name)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition duration-200 border ${
                selectedSubject === sub.name
                  ? "bg-[#6366F1] text-white border-[#6366F1] shadow-lg shadow-indigo-500/20"
                  : "bg-[#13162A] text-gray-300 border-[#545878] hover:border-white hover:text-white"
              }`}
            >
              {sub.name}
              <span className="block text-[10px] opacity-75 font-normal">
                Teacher: {sub.teacher}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* STUDENTS TABLE CARD */}
      <div className="gs-card rounded-xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between border-b border-[#545878]/40 bg-[#161930] px-5 py-4">
          <div>
            <h1 className="text-lg font-semibold text-white">Student List ({selectedSubject})</h1>
            <p className="gs-secondary-text mt-0.5 text-xs">
              Showing grades for students in {yearLevel} - {section}
            </p>
          </div>
          <div className="rounded-full bg-[#1E1F44] px-4 py-1 text-xs font-semibold text-[#8B84FF] border border-[#31326E]">
            {filteredStudents.length} Students
          </div>
        </div>

        {/* TABLE CONTENT */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="gs-secondary-text text-xs tracking-wider uppercase bg-[#161930] border-b border-[#545878]/30">
                <th className="px-6 py-4 font-semibold">#</th>
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold text-center">Q1</th>
                <th className="px-6 py-4 font-semibold text-center">Q2</th>
                <th className="px-6 py-4 font-semibold text-center">Q3</th>
                <th className="px-6 py-4 font-semibold text-center">Q4</th>
                <th className="px-6 py-4 font-semibold text-center">Average</th>
                <th className="px-6 py-4 font-semibold text-center">Remarks</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#2E3350]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center gs-secondary-text bg-[#0D0F1A]/20">
                    No students found matching your query.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const activeGrade = student.gradesBySubject[selectedSubject]
                  const q1 = activeGrade?.Q1 ?? 0
                  const q2 = activeGrade?.Q2 ?? 0
                  const q3 = activeGrade?.Q3 ?? 0
                  const q4 = activeGrade?.Q4 ?? 0
                  const avg = activeGrade ? Number(((q1 + q2 + q3 + q4) / 4).toFixed(1)) : 0
                  const isPassed = avg >= 75

                  return (
                    <tr key={student.id} className="transition hover:bg-[#22273D]">
                      <td className="px-6 py-4 gs-secondary-text font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      <td className="px-6 py-4 font-medium text-white">
                        {student.fullName}
                        <span className="block text-[11px] gs-secondary-text font-normal">
                          ID: {student.studentId}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center gs-secondary-text font-mono">
                        {q1}
                      </td>

                      <td className="px-6 py-4 text-center gs-secondary-text font-mono">
                        {q2}
                      </td>

                      <td className="px-6 py-4 text-center gs-secondary-text font-mono">
                        {q3}
                      </td>

                      <td className="px-6 py-4 text-center gs-secondary-text font-mono">
                        {q4}
                      </td>

                      <td className="px-6 py-4 text-center text-white font-semibold font-mono">
                        {avg}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${
                            isPassed
                              ? "bg-[#142B24] border border-[#1E4D3E] text-[#34D399]"
                              : "bg-[#3B2437] border border-[#5E2B3E] text-[#F87171]"
                          }`}
                        >
                          {isPassed ? "Passed" : "Failed"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewStudentId(student.id)}
                            className="gs-secondary-text flex items-center gap-1.5 rounded-lg border border-[#545878] bg-[#22273D] px-3 py-1.5 text-xs font-medium hover:bg-[#2B304A] hover:text-white transition"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>

                          <button
                            onClick={() => openEditModal(student.id)}
                            className="gs-secondary-text flex items-center gap-1.5 rounded-lg border border-[#545878] bg-[#22273D] px-3 py-1.5 text-xs font-medium hover:bg-[#2B304A] hover:text-white transition"
                          >
                            <SquarePen className="h-3.5 w-3.5" />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL - Student Grade Report */}
      {viewStudentId && viewStudent && viewModalCalculations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="relative gs-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#545878] bg-[#13162A] p-6 shadow-2xl">
            {/* Header Details */}
            <div className="flex items-start justify-between border-b border-[#545878]/40 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Student Grade Report</h2>
                <p className="gs-secondary-text text-xs mt-0.5">Academic Year 2025 - 2026</p>
              </div>
              <button
                onClick={() => setViewStudentId(null)}
                className="rounded-lg p-1.5 text-[#545878] hover:bg-[#22273D] hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Student Metadata Card */}
            <div className="grid grid-cols-3 gap-4 py-4 text-sm bg-[#0D0F1A]/40 rounded-lg px-4 my-4 border border-[#545878]/25">
              <div>
                <span className="gs-secondary-text block text-xs">Student Name</span>
                <span className="text-white font-semibold mt-0.5 block">{viewStudent.fullName}</span>
              </div>
              <div>
                <span className="gs-secondary-text block text-xs">Grade & Section</span>
                <span className="text-white font-semibold mt-0.5 block">{viewStudent.gradeLevel} - {viewStudent.section}</span>
              </div>
              <div>
                <span className="gs-secondary-text block text-xs">Adviser</span>
                <span className="text-white font-semibold mt-0.5 block">{activeAdviser}</span>
              </div>
            </div>

            {/* Nested Report Card UI */}
            <div className="gs-card rounded-lg bg-[#0D0F1A]/30 overflow-hidden border border-[#545878]/30">
              <div className="border-b border-[#545878]/30 bg-[#161930] px-4 py-3">
                <h4 className="text-sm font-semibold text-white">Report Card</h4>
                <p className="text-[10px] gs-secondary-text mt-0.5">Quarterly Academic Performance</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="gs-secondary-text bg-[#161930] border-b border-[#545878]/20 uppercase tracking-wider text-[10px]">
                      <th className="px-4 py-2.5 font-semibold">Subject</th>
                      <th className="px-4 py-2.5 font-semibold text-center">Q1</th>
                      <th className="px-4 py-2.5 font-semibold text-center">Q2</th>
                      <th className="px-4 py-2.5 font-semibold text-center">Q3</th>
                      <th className="px-4 py-2.5 font-semibold text-center">Q4</th>
                      <th className="px-4 py-2.5 font-semibold text-center">Final</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2E3350] font-medium text-gray-300">
                    {Object.keys(viewStudent.gradesBySubject).map((subj) => {
                      const gr = viewStudent.gradesBySubject[subj]
                      return (
                        <tr key={subj} className="hover:bg-[#22273D]/30 transition">
                          <td className="px-4 py-3 text-white font-semibold">{subj}</td>
                          <td className="px-4 py-3 text-center font-mono">{gr.Q1}</td>
                          <td className="px-4 py-3 text-center font-mono">{gr.Q2}</td>
                          <td className="px-4 py-3 text-center font-mono">{gr.Q3}</td>
                          <td className="px-4 py-3 text-center font-mono">{gr.Q4}</td>
                          <td className="px-4 py-3 text-center font-mono text-white font-bold">{gr.Final}</td>
                        </tr>
                      )
                    })}
                    {/* Averages Row */}
                    <tr className="bg-[#1C2035]/50 font-bold border-t border-[#545878]/30">
                      <td className="px-4 py-3 text-white">Average</td>
                      <td className="px-4 py-3 text-center font-mono">{viewModalCalculations.q1Avg}</td>
                      <td className="px-4 py-3 text-center font-mono">{viewModalCalculations.q2Avg}</td>
                      <td className="px-4 py-3 text-center font-mono">{viewModalCalculations.q3Avg}</td>
                      <td className="px-4 py-3 text-center font-mono">{viewModalCalculations.q4Avg}</td>
                      <td className="px-4 py-3 text-center font-mono text-[#8B84FF]">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Card Footer Summary */}
              <div className="flex items-center justify-between border-t border-[#545878]/30 bg-[#161930] px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-white text-xs font-semibold">GPA: {viewModalCalculations.gpa}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                      viewModalCalculations.isPassed
                        ? "bg-[#142B24] border-[#1E4D3E] text-[#34D399]"
                        : "bg-[#3B2437] border-[#5E2B3E] text-[#F87171]"
                    }`}
                  >
                    {viewModalCalculations.isPassed ? "Passed" : "Failed"}
                  </span>
                </div>
                <button className="rounded-lg bg-[#6366F1] px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600 shadow-md shadow-indigo-500/10 transition">
                  Approve Report Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL - Interactive Grade Editing */}
      {editStudentId && editStudent && editModalCalculations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="relative gs-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#545878] bg-[#13162A] p-6 shadow-2xl">
            {/* Header Details */}
            <div className="flex items-start justify-between border-b border-[#545878]/40 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Edit Student Grades</h2>
                <p className="gs-secondary-text text-xs mt-0.5">Input grades below to automatically compute final report</p>
              </div>
              <button
                onClick={() => setEditStudentId(null)}
                className="rounded-lg p-1.5 text-[#545878] hover:bg-[#22273D] hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Student Metadata Card */}
            <div className="grid grid-cols-2 gap-4 py-3.5 text-sm bg-[#0D0F1A]/40 rounded-lg px-4 my-4 border border-[#545878]/25">
              <div>
                <span className="gs-secondary-text block text-xs font-semibold">Student Name</span>
                <span className="text-white font-bold mt-0.5 block">{editStudent.fullName}</span>
              </div>
              <div>
                <span className="gs-secondary-text block text-xs font-semibold">Grade & Section</span>
                <span className="text-white font-bold mt-0.5 block">{editStudent.gradeLevel} - {editStudent.section}</span>
              </div>
            </div>

            {/* Editable Grades Card */}
            <div className="gs-card rounded-lg bg-[#0D0F1A]/30 overflow-hidden border border-[#545878]/30">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="gs-secondary-text bg-[#161930] border-b border-[#545878]/20 uppercase tracking-wider text-[10px]">
                      <th className="px-4 py-3 font-semibold">Subject</th>
                      <th className="px-4 py-3 font-semibold text-center w-20">Q1</th>
                      <th className="px-4 py-3 font-semibold text-center w-20">Q2</th>
                      <th className="px-4 py-3 font-semibold text-center w-20">Q3</th>
                      <th className="px-4 py-3 font-semibold text-center w-20">Q4</th>
                      <th className="px-4 py-3 font-semibold text-center w-24">Final</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2E3350] font-medium text-gray-300">
                    {Object.keys(tempGrades).map((subj) => {
                      const gr = tempGrades[subj]
                      return (
                        <tr key={subj} className="hover:bg-[#22273D]/30 transition">
                          <td className="px-4 py-2.5 text-white font-semibold">{subj}</td>
                          <td className="px-4 py-2.5 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={gr.Q1 || ""}
                              onChange={(e) => handleGradeChange(subj, "Q1", e.target.value)}
                              className="w-16 rounded border border-[#545878]/60 bg-[#0D0F1A] px-2 py-1 text-center font-mono text-white outline-none focus:border-[#8B84FF] transition"
                            />
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={gr.Q2 || ""}
                              onChange={(e) => handleGradeChange(subj, "Q2", e.target.value)}
                              className="w-16 rounded border border-[#545878]/60 bg-[#0D0F1A] px-2 py-1 text-center font-mono text-white outline-none focus:border-[#8B84FF] transition"
                            />
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={gr.Q3 || ""}
                              onChange={(e) => handleGradeChange(subj, "Q3", e.target.value)}
                              className="w-16 rounded border border-[#545878]/60 bg-[#0D0F1A] px-2 py-1 text-center font-mono text-white outline-none focus:border-[#8B84FF] transition"
                            />
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={gr.Q4 || ""}
                              onChange={(e) => handleGradeChange(subj, "Q4", e.target.value)}
                              className="w-16 rounded border border-[#545878]/60 bg-[#0D0F1A] px-2 py-1 text-center font-mono text-white outline-none focus:border-[#8B84FF] transition"
                            />
                          </td>
                          <td className="px-4 py-2.5 text-center font-mono text-white font-bold text-sm">
                            {gr.Final}
                          </td>
                        </tr>
                      )
                    })}
                    {/* Averages Row */}
                    <tr className="bg-[#1C2035]/50 font-bold border-t border-[#545878]/30">
                      <td className="px-4 py-3 text-white">Average</td>
                      <td className="px-4 py-3 text-center font-mono">{editModalCalculations.q1Avg}</td>
                      <td className="px-4 py-3 text-center font-mono">{editModalCalculations.q2Avg}</td>
                      <td className="px-4 py-3 text-center font-mono">{editModalCalculations.q3Avg}</td>
                      <td className="px-4 py-3 text-center font-mono">{editModalCalculations.q4Avg}</td>
                      <td className="px-4 py-3 text-center font-mono text-[#8B84FF]">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom calculations & save/cancel actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-[#545878]/30 bg-[#161930] px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-white text-xs font-semibold">GPA: {editModalCalculations.gpa}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                      editModalCalculations.isPassed
                        ? "bg-[#142B24] border-[#1E4D3E] text-[#34D399]"
                        : "bg-[#3B2437] border-[#5E2B3E] text-[#F87171]"
                    }`}
                  >
                    {editModalCalculations.isPassed ? "Passed" : "Failed"}
                  </span>
                </div>
                <div className="flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditStudentId(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#545878] bg-[#22273D] text-white hover:bg-[#2B304A] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEditedGrades}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6366F1] text-white hover:bg-indigo-600 shadow-md shadow-indigo-500/10 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
