<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BusinessMenController;
use App\Http\Controllers\BusinessController;

Route::post('register', [BusinessMenController::class, 'register']);
Route::post('login', [BusinessMenController::class,'login']);
Route::middleware('auth:sanctum')->group(function() {
    Route::post('addBusiness', [BusinessController::class,'store']);
});
Route::middleware('auth:sanctum')->post('logout', [BusinessMenController::class, 'logout']);
