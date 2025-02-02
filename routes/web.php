<?php

use App\Http\Controllers\Note\StoreController as StoreNote;
use App\Http\Controllers\Session\StoreController as StoreSession;
use App\Http\Controllers\Timer\StartController as StartTimer;
use App\Http\Controllers\Timer\StopController as StopTimer;
use App\Http\Controllers\Todo\DeleteController as DeleteTodo;
use App\Http\Controllers\Todo\IndexController as TodoIndex;
use App\Http\Controllers\Todo\ReorderController as ReorderTodos;
use App\Http\Controllers\Todo\StoreController as StoreTodo;
use App\Http\Controllers\Todo\UpdateController as UpdateTodo;
use App\Http\Controllers\User\StoreController as StoreUser;
use Illuminate\Support\Facades\Route;

Route::view('login', 'session.create')->name('login');
Route::post('login', StoreSession::class)->name('session.store');
Route::view('register','user.create')->name('register');
Route::post('register', StoreUser::class)->name('user.store');

Route::middleware('auth')->group(function () {
    Route::get('/', TodoIndex::class)->name('dashboard');
    Route::post('todos', StoreTodo::class)->name('todo.store');
    Route::post('todos/reorder', ReorderTodos::class)->name('todo.reorder');
    Route::put('todo/{todo}', UpdateTodo::class)->name('todo.update');
    Route::delete('todos/{todo}', DeleteTodo::class)->name('todo.delete');
    Route::post('todo/{todo}/timers/start', StartTimer::class)->name('timer.start');
    Route::post('todo/{todo}/timers/stop', StopTimer::class)->name('timer.stop');

    Route::post('notes', StoreNote::class)->name('note.store');

});
