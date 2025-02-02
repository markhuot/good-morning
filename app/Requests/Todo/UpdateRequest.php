<?php

namespace App\Requests\Todo;

use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class UpdateRequest extends Data
{
    public ?string $title;
    public ?bool $completed;

    #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d')]
    public ?CarbonImmutable $day;
}
