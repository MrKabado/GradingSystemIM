<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AppliesSectionFilters;
use App\Models\Student;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Grade;
use App\Models\GradeReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GradeReportController extends Controller
{
    use AppliesSectionFilters;

    public function index(Request $request): JsonResponse
    {
        $filters = $this->sectionFilterParams($request);

        $yearLevels = $filters['yearLevels'];
        $sectionNames = $filters['sectionNames'];
        $selectedYearLevel = $filters['selectedYearLevel'];
        $selectedSection = $filters['selectedSection'];
        $search = $filters['search'];

        // Students query
        $studentsQuery = Student::with(['section', 'grades']);

        if ($selectedYearLevel) {
            $studentsQuery->whereHas('section', function ($q) use ($selectedYearLevel) {
                $q->where('year_level', $selectedYearLevel);
            });
        }

        if ($selectedSection) {
            $studentsQuery->whereHas('section', function ($q) use ($selectedSection) {
                $q->where('section', $selectedSection);
            });
        }

        if ($search) {
            $studentsQuery->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        $students = $studentsQuery
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        // Reports
        $reports = GradeReport::whereIn('student_id', $students->pluck('id'))
            ->get()
            ->keyBy('student_id');

        $items = [];
        $availableCount = 0;

        foreach ($students as $student) {

            $gpa = $this->computeGpa($student);

            $report = $reports->get($student->id);
            $isAvailable = $report !== null;

            if ($isAvailable) $availableCount++;

            $items[] = [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'name' => $student->full_name,
                'section' => $student->section?->display_name ?? '—',
                'average' => $gpa !== null ? $gpa . '%' : '—',
                'status' => $isAvailable ? 'Available' : 'Pending',
                'date_generated' => $isAvailable
                    ? $report->created_at->format('M d, Y')
                    : '—',
            ];
        }

        $totalReports = count($items);
        $pendingCount = $totalReports - $availableCount;

        $cards = [
            ['name' => 'Total Reports', 'value' => $totalReports],
            ['name' => 'Available', 'value' => $availableCount],
            ['name' => 'Pending', 'value' => $pendingCount],
        ];

        // Optional modal/view student report
        $viewStudentReport = null;

        $viewStudentId = $request->input('view_student');

        if ($viewStudentId) {
            $viewStudentReport = $this->buildStudentReport($viewStudentId);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'filters' => [
                    'yearLevels' => $yearLevels,
                    'sectionNames' => $sectionNames,
                    'selectedYearLevel' => $selectedYearLevel,
                    'selectedSection' => $selectedSection,
                    'search' => $search,
                ],
                'items' => $items,
                'cards' => $cards,
                'viewStudentReport' => $viewStudentReport,
            ],
        ]);
    }

    private function computeGpa(Student $student): ?float
    {
        if (!$student->section_id) return null;

        $subjects = Subject::where('section_id', $student->section_id)->get();
        $grades = $student->grades;

        $subjectAverages = [];

        foreach ($subjects as $subject) {
            $subGrades = $grades->where('subject_id', $subject->id);

            $scores = [];

            foreach (['Q1', 'Q2', 'Q3', 'Q4'] as $q) {
                $rec = $subGrades->firstWhere('quarter', $q);
                if ($rec?->grade !== null) {
                    $scores[] = (float) $rec->grade;
                }
            }

            if ($scores) {
                $subjectAverages[] = array_sum($scores) / count($scores);
            }
        }

        return $subjectAverages
            ? round(array_sum($subjectAverages) / count($subjectAverages), 1)
            : null;
    }

    private function buildStudentReport(int $studentId): array
    {
        $student = Student::with('section')->find($studentId);

        if (!$student) {
            return ['error' => 'Student not found'];
        }

        $subjects = Subject::where('section_id', $student->section_id)
            ->with('teacher')
            ->orderBy('name')
            ->get();

        $grades = Grade::where('student_id', $student->id)
            ->get()
            ->groupBy('subject_id');

        $reportCardRows = [];
        $totalFinal = [];

        foreach ($subjects as $subject) {
            $subGrades = $grades->get($subject->id, collect());

            $qGrades = [];

            foreach (['Q1','Q2','Q3','Q4'] as $q) {
                $rec = $subGrades->firstWhere('quarter', $q);
                $qGrades[$q] = $rec?->grade !== null ? (float)$rec->grade : null;
            }

            $filled = array_filter($qGrades, fn($v) => $v !== null);

            $avg = $filled ? round(array_sum($filled) / count($filled), 1) : null;

            if ($avg !== null) {
                $totalFinal[] = $avg;
            }

            $reportCardRows[] = [
                'subject' => $subject->name,
                'teacher' => $subject->teacher?->name ?? '—',
                'grades' => $qGrades,
                'average' => $avg,
                'remarks' => $avg === null
                    ? '—'
                    : ($avg >= Grade::PASSING_SCORE ? 'Passed' : 'Failed'),
            ];
        }

        $gpa = $totalFinal
            ? round(array_sum($totalFinal) / count($totalFinal), 1)
            : null;

        return [
            'student' => $student,
            'reportCardRows' => $reportCardRows,
            'gpa' => $gpa,
            'remarks' => $gpa === null
                ? null
                : ($gpa >= Grade::PASSING_SCORE ? 'Passed' : 'Failed'),
        ];
    }
}