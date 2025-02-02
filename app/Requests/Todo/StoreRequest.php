<?php

namespace App\Requests\Todo;

use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class StoreRequest extends Data
{
    #[Required]
    public string $title;

    #[Required, DateFormat('Y-m-d'), WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d')]
    public CarbonImmutable $date;
}
