<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    use \App\Http\Controllers\Concerns\AppliesSectionFilters;

    public function index(Request $request)
    {
        $filters = $this->sectionFilterParams($request);

        $studentsQuery = Student::with('section')
            ->orderBy('last_name')
            ->orderBy('first_name');

        if ($filters['selectedYearLevel']) {
            $studentsQuery->whereHas('section', function ($q) use ($filters) {
                $q->where('year_level', $filters['selectedYearLevel']);
            });
        }

        if ($filters['selectedSection']) {
            $studentsQuery->whereHas('section', function ($q) use ($filters) {
                $q->where('section', $filters['selectedSection']);
            });
        }

        if ($filters['search']) {
            $search = $filters['search'];

            $studentsQuery->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'filters' => $filters,
            'students' => $studentsQuery->paginate(15)->withQueryString(),
            'sections' => Section::orderBy('year_level')
                ->orderBy('section')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatedStudentData($request);

        $student = Student::create($validated);

        ActivityLog::record(
            'created',
            'students', 
            $student->id,
            'Created student: ' . $student->full_name
        );

        return response()->json([
            'message' => 'Student created successfully',
            'data' => $student
        ], 201);
    }

    public function show(Student $student)
    {
        $student->load('section');

        return response()->json([
            'data' => $student
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $this->validatedStudentData($request, $student);

        $student->update($validated);

        ActivityLog::record(
            'updated',
            'students',
            $student->id,
            'Updated student: ' . $student->full_name
        );

        return response()->json([
            'message' => 'Student updated successfully',
            'data' => $student
        ]);
    }

    public function destroy(Student $student)
    {
        $name = $student->full_name;
        $id = $student->id;

        $student->delete();

        ActivityLog::record(
            'deleted',
            'students',
            $id,
            'Deleted student: ' . $name
        );

        return response()->json([
            'message' => 'Student deleted successfully'
        ]);
    }

    private function validatedStudentData(Request $request, ?Student $student = null): array
    {
        $studentIdRule = Rule::unique('students', 'student_id');

        if ($student) {
            $studentIdRule = $studentIdRule->ignore($student->id);
        }

        return $request->validate([
            'student_id' => ['required', 'string', 'max:255', $studentIdRule],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'section_id' => ['nullable', 'exists:sections,id'],
        ]);
    }
}