<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\GradeReportController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentReportController;
use App\Http\Controllers\SubjectController;

Route::prefix('auth')->group(function () {

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });
}); 


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('students', StudentController::class);

    Route::apiResource('sections', SectionController::class)
        ->except(['show']);

    Route::apiResource('subjects', SubjectController::class)
        ->except(['show']);
    Route::apiResource('grades', GradeController::class)
        ->parameters([
            'grades' => 'student',
        ]);

    Route::get('/grade-reports', [GradeReportController::class, 'index']);

    Route::get('/grade-reports/{student}/pdf', [StudentReportController::class, 'pdfDownload']);

    Route::post('/grade-reports/{student}/approve', [StudentReportController::class, 'approve']);
});