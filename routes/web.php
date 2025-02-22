<?php

use App\Http\Controllers\Session\StoreController as StoreSession;
use App\Http\Controllers\User\StoreController as StoreUser;
use App\Http\Controllers\Todo\IndexController as TodoIndex;
use Illuminate\Support\Facades\Route;

Route::view('login', 'session.create')->name('login');
Route::post('login', StoreSession::class)->name('session.store');
Route::view('register','user.create')->name('register');
Route::post('register', StoreUser::class)->name('user.store');

Route::middleware('auth')->group(function () {
    Route::get('/', TodoIndex::class)->name('dashboard');
});
