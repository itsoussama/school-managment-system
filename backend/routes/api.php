<?php

use App\Enums\TokenAbility;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\MaintenanceRequestController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'ability:' . TokenAbility::ISSUE_ACCESS_TOKEN->value])->group(function () {
    Route::post('/auth/refresh-token', [AuthController::class, 'refreshToken']);;
});

Route::middleware(['auth:sanctum', 'ability:' . TokenAbility::ACCESS_API->value])->group(function () {

    // Users
    Route::apiResource('users', UserController::class);
    Route::apiResource('events', EventController::class)->middleware('role:' . config('roles.admin') . ',' . config('roles.admin_staff') . ',' . config('roles.teacher'))->except(['show', 'index']);

    Route::middleware('role:' . config('roles.admin') . ',' . config('roles.admin_staff'))->group(function () {
        Route::apiResource('schools', SchoolController::class);
        Route::post('/add-parent', [UserController::class, 'addParent']);
        Route::post('/add-adminStaff', [UserController::class, 'addAdmin']);
        Route::post('/assign-childs', [UserController::class, 'assignChilds']);
        Route::post('/assign-parent', [UserController::class, 'assignParent']);
        Route::post('/block', [UserController::class, 'blockUser']);
        Route::post('/unblock', [UserController::class, 'unblockUser']);
    });

    // Roles
    Route::middleware('role:' . config('roles.admin') . ',' . config('roles.admin_staff') . ',' . config('roles.teacher'))->group(function () {
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('resources', ResourceController::class);
        Route::apiResource('roles', RoleController::class);
        Route::apiResource('maintenance', MaintenanceRequestController::class);
        Route::patch('maintenance/status/{id}', [MaintenanceRequestController::class, 'changeStatus']);
    });

    Route::apiResource('grades', GradeController::class);
    Route::apiResource('subjects', SubjectController::class);

    Route::get('/administrator', [UserController::class, 'admins']);
    Route::get('/teacher', [UserController::class, 'teachers']);
    Route::get('/student', [UserController::class, 'students']);
    Route::get('/parent', [UserController::class, 'parents']);
    Route::get('/export-users', [UserController::class, 'export']);
    Route::post('/import-users', [UserController::class, 'import']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
