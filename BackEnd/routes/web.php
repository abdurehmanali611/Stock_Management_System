<?php

use App\Http\Controllers\BusinessMenController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::middleware(["auth", "prevent-back"])->group(function(){
    Route::get("/home",[BusinessMenController::class, "index"])->name("home");
});

Route::middleware(['auth'])->get('/api/user-status', function () {
    // If we reach this point, the user is authenticated.
    return response()->json(['status' => 'success'], 200);
});
