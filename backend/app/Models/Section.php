<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Section extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'year_level',
        'section',
        'class_adviser',
    ];

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class);
    }

    public function getDisplayNameAttribute(): string
    {
        return 'Grade '.$this->year_level.' — '.$this->section;
    }
}
