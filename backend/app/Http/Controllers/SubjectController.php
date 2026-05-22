<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AppliesSectionFilters;
use App\Models\ActivityLog;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    use AppliesSectionFilters;

    public function index(Request $request): JsonResponse
    {
        $data = $this->indexPayload($request);

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatedSubjectData($request);

        $subject = Subject::create($validated);

        ActivityLog::record(
            'created',
            'subjects',
            $subject->id,
            'Created subject: ' . $subject->name
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Subject created successfully.',
            'data' => $subject->load(['section', 'teacher']),
        ], 201);
    }

    public function edit(Subject $subject): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $subject->load(['section', 'teacher']),
        ]);
    }

    public function update(Request $request, Subject $subject): JsonResponse
    {
        $validated = $this->validatedSubjectData($request);

        $subject->update($validated);

        ActivityLog::record(
            'updated',
            'subjects',
            $subject->id,
            'Updated subject: ' . $subject->name
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Subject updated successfully.',
            'data' => $subject->load(['section', 'teacher']),
        ]);
    }

    public function destroy(Subject $subject): JsonResponse
    {
        $id = $subject->id;
        $name = $subject->name;

        $subject->delete();

        ActivityLog::record(
            'deleted',
            'subjects',
            $id,
            'Deleted subject: ' . $name
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Subject deleted successfully.',
        ]);
    }

    private function indexPayload(Request $request): array
    {
        $filters = $this->sectionFilterParams($request);

        $subjectsQuery = Subject::with(['section', 'teacher'])
            ->orderBy('name');

        if ($filters['selectedYearLevel']) {
            $subjectsQuery->whereHas('section', function ($q) use ($filters) {
                $q->where('year_level', $filters['selectedYearLevel']);
            });
        }

        if ($filters['selectedSection']) {
            $subjectsQuery->whereHas('section', function ($q) use ($filters) {
                $q->where('section', $filters['selectedSection']);
            });
        }

        if ($filters['search']) {
            $search = $filters['search'];

            $subjectsQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('teacher', function ($t) use ($search) {
                      $t->where('name', 'like', "%{$search}%");
                  });
            });
        }

        return array_merge($filters, [
            'subjects' => $subjectsQuery
                ->paginate(15)
                ->withQueryString(),

            'sections' => Section::orderBy('year_level')
                ->orderBy('section')
                ->get(),
        ]);
    }

    private function validatedSubjectData(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'section_id' => ['nullable', 'exists:sections,id'],
            'teacher' => ['nullable', 'string', 'max:255'],
        ]);

        $teacherName = trim($validated['teacher'] ?? '');
        unset($validated['teacher']);

        $validated['teacher_id'] = $teacherName === ''
            ? null
            : Teacher::firstOrCreate(['name' => $teacherName])->id;

        return $validated;
    }
}