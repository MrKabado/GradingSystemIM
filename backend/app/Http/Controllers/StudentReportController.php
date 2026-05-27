<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\GradeReport;
use App\Models\ActivityLog;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class StudentReportController extends Controller
{
    public function pdfDownload($id): Response
    {
        $student = Student::with(['grades.subject', 'section'])
            ->findOrFail($id);

        $subjectGrades = $student->grades
            ->filter(fn ($grade) => $grade->subject !== null)
            ->groupBy(fn ($grade) => $grade->subject->id);

        $reportRows = [];
        $gpaScores = [];

        foreach ($subjectGrades as $grades) {
            $subject = $grades->first()->subject;
            $quarterGrades = [
                'Q1' => null,
                'Q2' => null,
                'Q3' => null,
                'Q4' => null,
            ];

            foreach ($grades as $grade) {
                if (array_key_exists($grade->quarter, $quarterGrades)) {
                    $quarterGrades[$grade->quarter] = $grade->grade;
                }
            }

            $filledGrades = array_filter($quarterGrades, fn ($value) => $value !== null);
            $average = $filledGrades ? round(array_sum($filledGrades) / count($filledGrades), 1) : null;

            if ($average !== null) {
                $gpaScores[] = $average;
            }

            $reportRows[] = [
                'subject' => $subject->name,
                'grades' => $quarterGrades,
                'average' => $average,
            ];
        }

        $gpa = $gpaScores ? round(array_sum($gpaScores) / count($gpaScores), 1) : null;

        $pdf = Pdf::loadView('pdf.report-card', compact('student', 'reportRows', 'gpa'))
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'defaultFont' => 'sans-serif',
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
            ]);

        return $pdf->download($student->student_id . '-report-card.pdf');
    }

    public function approve($id): JsonResponse
    {
        $student = Student::findOrFail($id);

        $report = GradeReport::updateOrCreate(
            [
                'student_id' => $student->id,
            ],
            [
                'approved_at' => now(),
            ]
        );

        ActivityLog::record(
            'approved',
            'grade_reports',
            $student->id,
            'Approved grade report card for ' . $student->full_name
        );

        return response()->json([
            'status' => 'success',
            'message' => "Report card for {$student->full_name} approved successfully.",
            'data' => [
                'report' => $report,
            ]
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $student = Student::findOrFail($id);

        $deleted = GradeReport::where('student_id', $student->id)->delete();

        ActivityLog::record(
            'deleted',
            'grade_reports',
            $student->id,
            'Deleted grade report card for ' . $student->full_name
        );

        return response()->json([
            'status' => 'success',
            'message' => $deleted
                ? "Report card for {$student->full_name} deleted successfully."
                : "No report card existed for {$student->full_name}.",
        ]);
    }
}