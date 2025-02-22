<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Todo;

class TodoPolicy
{
    public function view(User $user, Todo $todo)
    {
        return $user->id === $todo->user_id;
    }

    public function create(User $user)
    {
        return true;
    }

    public function update(User $user, Todo $todo)
    {
        return $user->id === $todo->user_id;
    }

    public function delete(User $user, Todo $todo)
    {
        return $user->id === $todo->user_id;
    }
}
