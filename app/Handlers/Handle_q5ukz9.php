<?php

namespace App\Handlers;

class Handle_q5ukz9
{
    public function __invoke(...$params)
    {
        
        \App\Models\Todo::where('id', '=', $params[0])->firstOrFail()->delete();
    
    }
}
