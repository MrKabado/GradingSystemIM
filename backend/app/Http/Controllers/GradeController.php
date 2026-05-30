<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Grade;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Section;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $this->indexPayload($request),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'grades' => ['required', 'array'],
            'grades.*' => ['array'],
            'grades.*.Q1' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'grades.*.Q2' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'grades.*.Q3' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'grades.*.Q4' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $studentId = $validated['student_id'];
        $gradesData = $validated['grades'];

        foreach ($gradesData as $subjectId => $quarters) {
            foreach (Grade::QUARTERS as $quarter) {
                $score = $quarters[$quarter] ?? null;
                $score = ($score === null || $score === '') ? null : (float) $score;

                if ($score !== null) {
                    Grade::updateOrCreate(
                        [
                            'student_id' => $studentId,
                            'subject_id' => $subjectId,
                            'quarter' => $quarter,
                        ],
                        [
                            'grade' => $score,
                            'is_final' => false,
                        ]
                    );
                } else {
                    Grade::where('student_id', $studentId)
                        ->where('subject_id', $subjectId)
                        ->where('quarter', $quarter)
                        ->delete();
                }
            }
        }

        $student = Student::find($studentId);

        ActivityLog::record(
            'created',
            'grades',
            $student->id,
            'Recorded grades for ' . $student->full_name
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Grades saved successfully.',
            'data' => $this->getStudentSummary($student),
        ], 201);
    }

    public function show(Student $student): JsonResponse
    {
        $student->load('section');
    
        if (!$student->section_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Student has no section assigned.',
                'data' => [
                    'student' => $student,
                    'grades' => []
                ]
            ], 400);
        }
    
        $subjects = Subject::where('section_id', $student->section_id)
            ->with('teacher')
            ->orderBy('name')
            ->get();
    
        $grades = Grade::where('student_id', $student->id)
            ->get()
            ->groupBy('subject_id');
    
        $formattedGrades = [];
    
        foreach ($subjects as $subject) {
            $subjectGrades = $grades->get($subject->id, collect());
    
            $quarters = [];
    
            foreach (Grade::QUARTERS as $quarter) {
                $record = $subjectGrades->firstWhere('quarter', $quarter);
                $quarters[$quarter] = $record ? (float) $record->grade : null;
            }
    
            $values = array_filter($quarters);
    
            $average = count($values)
                ? round(array_sum($values) / count($values), 2)
                : null;
    
            $formattedGrades[] = [
                'subject_id' => $subject->id,
                'subject_name' => $subject->name,
                'teacher' => $subject->teacher?->name,
                'quarters' => $quarters,
                'average' => $average,
            ];
        }
    
        return response()->json([
            'status' => 'success',
            'data' => [
                'student' => $student,
                'grades' => $formattedGrades,
            ]
        ]);
    }

    public function update(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'grades' => ['required', 'array'],
            'grades.*' => ['array'],
            'grades.*.Q1' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'grades.*.Q2' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'grades.*.Q3' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'grades.*.Q4' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        foreach ($validated['grades'] as $subjectId => $quarters) {
            foreach (Grade::QUARTERS as $quarter) {
                $score = $quarters[$quarter] ?? null;
                $score = ($score === null || $score === '') ? null : (float) $score;

                if ($score !== null) {
                    Grade::updateOrCreate(
                        [
                            'student_id' => $student->id,
                            'subject_id' => $subjectId,
                            'quarter' => $quarter,
                        ],
                        [
                            'grade' => $score,
                            'is_final' => false,
                        ]
                    );
                } else {
                    Grade::where('student_id', $student->id)
                        ->where('subject_id', $subjectId)
                        ->where('quarter', $quarter)
                        ->delete();
                }
            }
        }

        ActivityLog::record(
            'updated',
            'grades',
            $student->id,
            'Updated grades for ' . $student->full_name
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Grades updated successfully.',
            'data' => $this->getStudentSummary($student),
        ]);
    }

    public function destroy(Student $student): JsonResponse
    {
        $subjects = Subject::where('section_id', $student->section_id)->pluck('id');

        Grade::where('student_id', $student->id)
            ->whereIn('subject_id', $subjects)
            ->delete();

        ActivityLog::record(
            'deleted',
            'grades',
            $student->id,
            'Deleted grades for ' . $student->full_name
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Grades deleted successfully.',
        ]);
    }

    private function indexPayload(Request $request): array
    {
        $sections = Section::orderBy('year_level')
            ->orderBy('section')
            ->get();

        $yearLevels = $sections->pluck('year_level')->unique()->values();
        $sectionNames = $sections->pluck('section')->unique()->values();

        $selectedYearLevel = $request->input('year_level');
        $selectedSectionName = $request->input('section');
        $search = $request->input('search');

        $activeSection = null;
        $studentsQuery = Student::query();
        $subjectsQuery = Subject::query();

        if ($selectedYearLevel) {
            $sectionIds = Section::where('year_level', $selectedYearLevel)->pluck('id');
            $studentsQuery->whereIn('section_id', $sectionIds);
            $subjectsQuery->whereIn('section_id', $sectionIds);
        }

        if ($selectedSectionName) {
            $activeSectionQuery = Section::where('section', $selectedSectionName);
            if ($selectedYearLevel) {
                $activeSectionQuery->where('year_level', $selectedYearLevel);
            }

            $activeSection = $activeSectionQuery->first();
            if ($activeSection) {
                $studentsQuery->where('section_id', $activeSection->id);
                $subjectsQuery->where('section_id', $activeSection->id);
            } else {
                return [
                    'sections' => $sections,
                    'yearLevels' => $yearLevels,
                    'sectionNames' => $sectionNames,
                    'selectedYearLevel' => $selectedYearLevel,
                    'selectedSection' => $selectedSectionName,
                    'students' => [],
                    'subjects' => [],
                    'gradeRows' => [],
                    'stats' => [
                        'total' => 0,
                        'passed' => 0,
                        'failed' => 0,
                        'average' => null,
                    ],
                ];
            }
        }

        if ($search) {
            $studentsQuery->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        $students = $studentsQuery->orderBy('last_name')->get();

        $subjects = $subjectsQuery->with('teacher')
            ->orderBy('name')
            ->get();

        if ($search) {
            $studentsQuery->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        $students = $studentsQuery->orderBy('last_name')->get();

        $grades = Grade::whereIn('student_id', $students->pluck('id'))
            ->whereIn('subject_id', $subjects->pluck('id'))
            ->get()
            ->groupBy('student_id');

        $gradeRows = [];

        foreach ($students as $student) {
            $studentGrades = $grades->get($student->id, collect());

            $quarterScores = ['Q1' => [], 'Q2' => [], 'Q3' => [], 'Q4' => []];
            $subjectAverages = [];

            foreach ($subjects as $subject) {
                $subGrades = $studentGrades->where('subject_id', $subject->id);

                $values = [];

                foreach (Grade::QUARTERS as $q) {
                    $record = $subGrades->firstWhere('quarter', $q);
                    if ($record?->grade !== null) {
                        $quarterScores[$q][] = (float) $record->grade;
                        $values[] = (float) $record->grade;
                    }
                }

                if ($values) {
                    $subjectAverages[] = array_sum($values) / count($values);
                }
            }

            $qAverages = [];
            foreach (Grade::QUARTERS as $q) {
                $scores = $quarterScores[$q];
                $qAverages[$q] = $scores ? round(array_sum($scores) / count($scores), 0) : null;
            }

            $gpa = $subjectAverages ? round(array_sum($subjectAverages) / count($subjectAverages), 0) : null;

            $gradeRows[] = [
                'student_id' => $student->id,
                'student_no' => $student->student_id,
                'name' => $student->full_name,
                'grades' => $qAverages,
                'average' => $gpa,
                'remarks' => $gpa === null ? null : ($gpa >= Grade::PASSING_SCORE ? 'Passed' : 'Failed'),
            ];
        }

        return [
            'sections' => $sections,
            'yearLevels' => $yearLevels,
            'sectionNames' => $sectionNames,
            'selectedYearLevel' => $selectedYearLevel,
            'selectedSection' => $selectedSectionName,
            'activeSection' => $activeSection,
            'subjects' => $subjects,
            'students' => $students,
            'gradeRows' => $gradeRows,
            'quarters' => Grade::QUARTERS,
        ];
    }

    private function getStudentSummary(Student $student): array
    {
        return [
            'student' => $student->load('section'),
            'grades' => Grade::where('student_id', $student->id)->get(),
        ];
    }
}