<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AppliesSectionFilters;
use App\Models\ActivityLog;
use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    use AppliesSectionFilters;

    public function index(Request $request)
    {
        $filters = $this->sectionFilterParams($request);

        $sectionsQuery = Section::withCount('students')
            ->orderBy('year_level')
            ->orderBy('section');

        if ($filters['selectedYearLevel']) {
            $sectionsQuery->where('year_level', $filters['selectedYearLevel']);
        }

        if ($filters['selectedSection']) {
            $sectionsQuery->where('section', $filters['selectedSection']);
        }

        if ($filters['search']) {
            $search = $filters['search'];

            $sectionsQuery->where(function ($q) use ($search) {
                $q->where('year_level', 'like', "%{$search}%")
                    ->orWhere('section', 'like', "%{$search}%")
                    ->orWhere('class_adviser', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'filters' => $filters,
            'sections' => $sectionsQuery->paginate(15)->withQueryString(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatedSectionData($request);

        $section = Section::create($validated);

        ActivityLog::record(
            'created',
            'sections',
            $section->id,
            'Created section: ' . $section->display_name
        );

        return response()->json([
            'message' => 'Section created successfully',
            'data' => $section
        ], 201);
    }

    public function edit(Section $section)
    {
        return response()->json([
            'data' => $section
        ]);
    }

    public function update(Request $request, Section $section)
    {
        $validated = $this->validatedSectionData($request);

        $section->update($validated);

        ActivityLog::record(
            'updated',
            'sections',
            $section->id,
            'Updated section: ' . $section->display_name
        );

        return response()->json([
            'message' => 'Section updated successfully',
            'data' => $section
        ]);
    }

    public function destroy(Section $section)
    {
        $label = $section->display_name;
        $id = $section->id;

        $section->delete();

        ActivityLog::record(
            'deleted',
            'sections',
            $id,
            'Deleted section: ' . $label
        );

        return response()->json([
            'message' => 'Section deleted successfully'
        ]);
    }

    private function validatedSectionData(Request $request): array
    {
        return $request->validate([
            'year_level' => ['required', 'string', 'max:255'],
            'section' => ['required', 'string', 'max:255'],
            'class_adviser' => ['required', 'string', 'max:255'],
        ]);
    }
}