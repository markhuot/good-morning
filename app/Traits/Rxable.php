<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Casts\Attribute;

trait Rxable
{
    protected function initializeRxable()
    {
        $this->appends[] = 'rx';
    }

    protected function rx(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => [
                'table' => $this->getTable(),
                'key_name' => $this->getKeyName(),
                'key_value' => $this->getKey(),
            ],
        );
    }
}
