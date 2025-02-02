<?php

namespace App\Models;

use App\Casts\Day;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterval;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property CarbonImmutable $day
 */
class Todo extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'day',
        'completed',
        'sort_order',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'day' => Day::class,
        'timer_started_at' => 'datetime',
    ];

    public function getTotalTime(): ?CarbonInterval
    {
        $totalTime = $this->timer_elapsed + ($this->timer_started_at?->diffInSeconds(now()) ?? 0);

        if ($totalTime === 0) {
            return null;
        }

        return CarbonImmutable::now()->subSeconds($totalTime)->diff(now());
    }

    public function startTimer()
    {
        $this->timer_started_at = now();
    }

    public function stopTimer()
    {
        $this->timer_elapsed = $this->timer_elapsed + ($this->timer_started_at?->diffInSeconds(now()) ?? 0);
        $this->timer_started_at = null;
    }
}
