<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Grade extends Model
{
    use SoftDeletes;

    public const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

    public const PASSING_SCORE = 75;

    protected $fillable = [
        'student_id',
        'subject_id',
        'grade',
        'quarter',
        'is_final',
    ];

    protected function casts(): array
    {
        return [
            'grade' => 'decimal:2',
            'is_final' => 'boolean',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
