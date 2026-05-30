"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";


import api from "@/lib/api";

/* =========================
   COMMON TYPES
========================= */

export interface Filters {
  yearLevels: string[];
  sectionNames: string[];

  selectedYearLevel: string | null;
  selectedSection: string | null;

  search: string | null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];

  first_page_url: string;

  from: number;

  last_page: number;
  last_page_url: string;

  links: PaginationLink[];

  next_page_url: string | null;

  path: string;

  per_page: number;

  prev_page_url: string | null;

  to: number;
  total: number;
}

/* =========================
   MODELS
========================= */

export interface Section {
  id: number;

  year_level: string;
  section: string;

  class_adviser: string;

  created_at: string;
  updated_at: string;

  deleted_at: string | null;

  students_count?: number;
}

export interface Student {
  id: number;

  student_id: string;

  first_name: string;
  middle_name: string;
  last_name: string;

  section_id: number | null;

  created_at: string;
  updated_at: string;

  deleted_at: string | null;

  section?: Section | null;
}

export interface Teacher {
  id: number;

  name: string;

  created_at: string;
  updated_at: string;

  deleted_at: string | null;
}

export interface Subject {
  id: number;

  name: string;

  section_id: number | null;
  teacher_id: number | null;

  created_at: string;
  updated_at: string;

  deleted_at: string | null;

  section?: Section | null;
  teacher?: Teacher | null;
}

export interface GradeRows {
  student_id: number;

  student_no: string;

  name: string;

  grades: {
    Q1: number | null;
    Q2: number | null;
    Q3: number | null;
    Q4: number | null;
  };

  average: number | null;

  remarks: string | null;
}

export interface StudentReportItem {
  id: number;

  student_id: string;

  name: string;

  section: string;

  average: string;

  status: string;

  date_generated: string;
}

export interface CardItem {
  name: string;
  value: number;
}

export interface ActivityLog {
  id: number;

  user_id: number;

  event: string;
  module: string;

  record_id: number;

  description: string;

  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  totalStudents: number;

  newStudentsThisMonth: number;

  totalGradeLevels: number;
  gradeLevelsRange: string;

  totalSections: number;
  sectionNamesList: string;

  recentActivities: ActivityLog[];
}

/* =========================
   API RESPONSES
========================= */

export interface StudentsResponse {
  filters: Filters;

  students: PaginatedResponse<Student>;

  sections: Section[];
}

export interface SectionsResponse {
  filters: Filters;

  sections: PaginatedResponse<Section>;
}

export interface SubjectsResponse {
  status: string;

  data: {
    yearLevels: string[];

    sectionNames: string[];

    selectedYearLevel: string | null;
    selectedSection: string | null;

    search: string | null;

    subjects: PaginatedResponse<Subject>;

    sections: Section[];
  };
}

export interface GradesResponse {
  status: string;

  data: {
    sections: Section[];

    yearLevels: string[];

    sectionNames: string[];

    selectedYearLevel: string | null;
    selectedSection: string | null;

    activeSection: Section | null;

    subjects: Subject[];

    students: Student[];

    gradeRows: GradeRows[];

    quarters: string[];
  };
}

type GradeFetchParams = {
  year_level?: string;
  section?: string;
  search?: string;
};

export interface StudentReportsResponse {
  status: string;

  data: {
    filters: Filters;

    items: StudentReportItem[];

    cards: CardItem[];

    viewStudentReport: any;
  };
}

export interface DashboardResponse {
  status: string;

  data: DashboardData;
}

/* =========================
   CONTEXT TYPE
========================= */

interface DataContextType {
  students: Student[];

  sections: Section[];

  subjects: Subject[];

  gradeSubjects: Subject[];

  gradeRows: GradeRows[];

  gradeQuarters: string[];

  gradeActiveSection: Section | null;

  studentReports: StudentReportItem[];

  dashboard: DashboardData | null;

  loading: boolean;

  fetchStudents: () => Promise<void>;

  fetchSections: () => Promise<void>;

  fetchSubjects: () => Promise<void>;

  fetchGrades: (params?: GradeFetchParams) => Promise<void>;

  fetchStudentReports: () => Promise<void>;

  fetchDashboard: () => Promise<void>;
}

/* =========================
   CONTEXT
========================= */

export const DataContext = createContext<
  DataContextType | undefined
>(undefined);

/* =========================
   PROVIDER
========================= */

interface Props {
  children: ReactNode;
}

export const DataProvider = ({
  children,
}: Props) => {
  const [students, setStudents] =
    useState<Student[]>([]);

  const [sections, setSections] =
    useState<Section[]>([]);

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [gradeSubjects, setGradeSubjects] =
    useState<Subject[]>([]);

  const [gradeRows, setGradeRows] =
    useState<GradeRows[]>([]);

  const [gradeQuarters, setGradeQuarters] =
    useState<string[]>([]);

  const [gradeActiveSection, setGradeActiveSection] =
    useState<Section | null>(null);

  const [studentReports, setStudentReports] =
    useState<StudentReportItem[]>([]);

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(false);

  // Merge incoming sections with existing ones, preserving `students_count`
  // and avoiding duplicate section entries.
  const mergeSections = useCallback(
    (prev: Section[], incoming: Section[]): Section[] => {
      const prevCounts = new Map<number, number | undefined>(
        prev.map((s) => [s.id, s.students_count])
      );

      const merged = new Map<number, Section>();

      incoming.forEach((s) => {
        const students_count =
          s.students_count ?? prevCounts.get(s.id) ?? undefined;

        merged.set(s.id, {
          ...s,
          students_count,
        });
      });

      return Array.from(merged.values());
    },
    []
  );
  /* =========================
     FETCH STUDENTS
  ========================= */

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get<StudentsResponse>(
        "/api/students"
      );

      setStudents(response.data.students.data);
      setSections((prev) => mergeSections(prev, response.data.sections));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [mergeSections]);

  /* =========================
     FETCH SECTIONS
  ========================= */

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get<SectionsResponse>(
        "/api/sections"
      );

      setSections((prev) =>
        mergeSections(prev, response.data.sections.data)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [mergeSections]);

  /* =========================
     FETCH SUBJECTS
  ========================= */

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get<SubjectsResponse>(
        "/api/subjects"
      );

      setSubjects(response.data.data.subjects.data);
      setSections((prev) =>
        mergeSections(prev, response.data.data.sections)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [mergeSections]);

  /* =========================
     FETCH GRADES
  ========================= */

  const fetchGrades = useCallback(
    async (params: GradeFetchParams = {}) => {
      try {
        setLoading(true);

        const response = await api.get<GradesResponse>(
          "/api/grades",
          {
            params,
          }
        );

        setSections((prev) =>
          mergeSections(prev, response.data.data.sections)
        );

        setGradeSubjects(response.data.data.subjects);
        setGradeQuarters(response.data.data.quarters);
        setGradeActiveSection(response.data.data.activeSection);
        setGradeRows(response.data.data.gradeRows);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [mergeSections]
  );

  /* =========================
     FETCH STUDENT REPORTS
  ========================= */

  const fetchStudentReports = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get<StudentReportsResponse>(
        "/api/student-reports"
      );

      setStudentReports(response.data.data.items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     FETCH DASHBOARD
  ========================= */

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get<DashboardResponse>(
        "/api/dashboard"
      );

      setDashboard(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchStudents();
    fetchSections();
    fetchSubjects();
  }, []);

  const contextValue = useMemo(
    () => ({
      students,
      sections,
      subjects,
      gradeSubjects,
      gradeRows,
      gradeQuarters,
      gradeActiveSection,
      studentReports,
      dashboard,
      loading,
      fetchStudents,
      fetchSections,
      fetchSubjects,
      fetchGrades,
      fetchStudentReports,
      fetchDashboard,
    }),
    [
      students,
      sections,
      subjects,
      gradeSubjects,
      gradeRows,
      gradeQuarters,
      gradeActiveSection,
      studentReports,
      dashboard,
      loading,
      fetchStudents,
      fetchSections,
      fetchSubjects,
      fetchGrades,
      fetchStudentReports,
      fetchDashboard,
    ]
  );

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useData = () => {
  const context =
    useContext(DataContext);

  if (!context) {
    throw new Error(
      "useData must be used inside DataProvider"
    );
  }

  return context;
};