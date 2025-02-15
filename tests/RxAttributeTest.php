
<?php

use App\Models\Todo;
use App\Models\User;

test('todos have _rx attributes', function () {
    $user = User::factory()->create();
    $todo = Todo::factory()->create([
        'user_id' => $user->id,
    ]);

    expect($todo->toArray())->rx
        ->toHaveKey('table')
        ->toHaveKey('key_name')
        ->toHaveKey('key_value');
});
