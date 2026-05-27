<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'event',
        'module',
        'record_id',
        'description',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function record(string $event, string $module, ?int $recordId = null, ?string $description = null): void
    {
        static::query()->create([
            'user_id' => auth()->id(),
            'event' => $event,
            'module' => $module,
            'record_id' => $recordId,
            'description' => $description,
        ]);
    }
}
