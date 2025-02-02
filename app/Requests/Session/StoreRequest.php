<?php

namespace App\Requests\Session;

use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

class StoreRequest extends Data
{
    #[Required, Email, Max(255)]
    public string $email;

    #[Required, Min(5)]
    public string $password;
}