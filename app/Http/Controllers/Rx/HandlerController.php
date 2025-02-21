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
        $hash = $request->string('_hash');
        $params = $request->get('_params') ?: [];

        foreach ($params as $key => $value) {
            ${"variable".$key} = $value;
        }
        unset($params);
        require(app_path('/Handlers/Handle_' . $hash.'.php'));
    }
}
