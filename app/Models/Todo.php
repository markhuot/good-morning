<?php

namespace App\Models;

use App\Casts\Day;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterval;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Rxable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class Todo extends Model
{
    use HasFactory;
    use Rxable;

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

    static function booting()
    {
        static::saving(function ($model) {
            if ($model->isDirty('completed') && $model->completed) {
                $model->stopTimer();
            }
        });
    }

    public function getTotalTime(): ?CarbonInterval
    {
        $totalTime = $this->timer_elapsed + ($this->timer_started_at?->diffInSeconds(now()) ?? 0);

        if ($totalTime === 0) {
            return null;
        }

        return CarbonImmutable::now()->subSeconds($totalTime)->diff(now());
    }

    public function toggleTimer()
    {
        $this->timer_started_at === null
            ? $this->startTimer()
            : $this->stopTimer();
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

    public function scopeForDay(Builder $builder, string|Carbon $day)
    {
        if ($day instanceof Carbon) {
            $day = $day->format('Y-m-d');
        }

        return $builder->where('day', $day);
    }
}
