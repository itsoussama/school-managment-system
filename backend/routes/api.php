<?php

use App\Enums\TokenAbility;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
// Route::get('/auth/refresh-token', [AuthController::class, 'refreshToken'])->middleware('auth:sanctum', 'ability:' . TokenAbility::ISSUE_ACCESS_TOKEN->value);

Route::middleware(['auth:sanctum', 'ability:' . TokenAbility::ISSUE_ACCESS_TOKEN->value])->group(function () {
    Route::post('/auth/refresh-token', [AuthController::class, 'refreshToken']);;
});

Route::middleware(['auth:sanctum', 'ability:' . TokenAbility::ACCESS_API->value])->group(function () {
    Route::apiResource('users', UserController::class);
    Route::get('/teacher', [UserController::class, 'teachers']);
    Route::get('/student', [UserController::class, 'students']);
    Route::get('/export-users', [UserController::class, 'export']);
    Route::post('/import-users', [UserController::class, 'import']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
