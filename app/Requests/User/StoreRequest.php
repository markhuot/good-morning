<?php

namespace App\Requests\User;

use Spatie\LaravelData\Attributes\Validation\Confirmed;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class StoreRequest extends Data
{
    public function __construct(
        #[Required, Min(3)]
        public string $name,

        #[Required, Email, Rule('unique:users,email')]
        public string $email,

        #[Required, Min(5), Confirmed]
        public string $password,

        #[Required]
        public string $password_confirmation,
    ) {}
}