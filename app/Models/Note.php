<?php

namespace App\Models;

use App\Casts\Day;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = [
        'date',
        'contents',
    ];

    protected $casts = [
        'day' => Day::class,
    ];
}
