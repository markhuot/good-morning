<?php

namespace App\Http\Controllers\Rx;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HandlerController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $hash = $request->string('hash');
        $params = $request->get('params') ?: [];

        app('App\Handlers\\Handle_' . $hash)(...$params);
    }
}
