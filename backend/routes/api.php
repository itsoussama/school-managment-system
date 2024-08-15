<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('users', UserController::class);
Route::get('/export-users', [UserController::class, 'export']);
Route::post('/import-users', [UserController::class, 'import']);

//todo: when we create login
// Route::middleware('auth:sanctum')->group(function () {
// });
// Route::apiResource('users', UserController::class)->middleware('auth:sanctum');
