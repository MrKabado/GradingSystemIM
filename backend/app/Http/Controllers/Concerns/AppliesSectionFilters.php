<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

trait AppliesSectionFilters
{
    /**
     * @return array{yearLevels: Collection, sectionNames: Collection, selectedYearLevel: ?string, selectedSection: ?string, search: ?string}
     */
    protected function sectionFilterParams(Request $request): array
    {
        $sections = Section::orderBy('year_level')->orderBy('section')->get();

        return [
            'yearLevels' => $sections->pluck('year_level')->unique()->sort()->values(),
            'sectionNames' => $sections->pluck('section')->unique()->sort()->values(),
            'selectedYearLevel' => $request->input('year_level'),
            'selectedSection' => $request->input('section'),
            'search' => $request->input('search'),
        ];
    }
}
