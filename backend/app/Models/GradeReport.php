<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeReport extends Model
{
    protected $fillable = [
        'student_id',
        'approved_at',
    ];
}
