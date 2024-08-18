<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::get('/export-users', [UserController::class, 'export']);
    Route::post('/import-users', [UserController::class, 'import']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
