<?php

namespace App\Http\Controllers\Session;

use App\Http\Controllers\Controller;
use App\Requests\Session\StoreRequest;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function __invoke(StoreRequest $request)
    {
        $credentials = $request->only('email', 'password')->toArray();

        if (auth()->attempt($credentials)) {
            request()->session()->regenerate();

            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }
}
