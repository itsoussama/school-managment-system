<?php

use App\Enums\TokenAbility;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\SubjectController;
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
    Route::middleware('role:' . config('roles.admin'))->group(function () {
        Route::apiResource('schools', SchoolController::class);
    });
    Route::middleware('role:' . config('roles.admin') . ',' . config('roles.teacher'))->group(function () {
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('resources', ResourceController::class);
        Route::apiResource('roles', RoleController::class);
    });
    Route::apiResource('grades', GradeController::class);
    Route::apiResource('subjects', SubjectController::class);

    Route::get('/teacher', [UserController::class, 'teachers']);
    Route::get('/student', [UserController::class, 'students']);
    Route::get('/export-users', [UserController::class, 'export']);
    Route::post('/import-users', [UserController::class, 'import']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
