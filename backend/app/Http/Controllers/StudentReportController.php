<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\GradeReport;
use App\Models\ActivityLog;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;

class StudentReportController extends Controller
{
    public function pdfDownload($id): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $student = Student::with(['grades', 'section'])
            ->findOrFail($id);

        $pdf = Pdf::loadView('pdf.report-card', compact('student'))
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
}