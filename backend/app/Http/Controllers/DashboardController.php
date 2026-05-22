<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        // 1. Total Students
        $totalStudents = Student::count();

        // 2. New Students this month
        $newStudentsThisMonth = Student::where('created_at', '>=', now()->startOfMonth())
            ->count();

        // 3. Grade Levels
        $gradeLevels = Section::distinct()
            ->pluck('year_level')
            ->sort()
            ->values();

        $totalGradeLevels = $gradeLevels->count();

        if ($totalGradeLevels > 0) {
            $min = $gradeLevels->first();
            $max = $gradeLevels->last();

            $gradeLevelsRange = ($min === $max)
                ? "Grade $min"
                : "Grades $min - $max";
        } else {
            $gradeLevelsRange = "No Grades";
        }

        // 4. Sections
        $totalSections = Section::count();

        $sectionNamesList = Section::distinct()
            ->pluck('section')
            ->sort()
            ->implode(', ');

        if (!$sectionNamesList) {
            $sectionNamesList = "None";
        }

        // 5. Recent Activities
        $recentActivities = ActivityLog::latest()
            ->take(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'totalStudents' => $totalStudents,
                'newStudentsThisMonth' => $newStudentsThisMonth,
                'totalGradeLevels' => $totalGradeLevels,
                'gradeLevelsRange' => $gradeLevelsRange,
                'totalSections' => $totalSections,
                'sectionNamesList' => $sectionNamesList,
                'recentActivities' => $recentActivities,
            ],
        ]);
    }
}