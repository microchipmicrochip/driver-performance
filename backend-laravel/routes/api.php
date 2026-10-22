<?php

use App\Http\Controllers\DriverMetricsController;
use Illuminate\Support\Facades\Route;

Route::get('/metrics/weekly', [
    DriverMetricsController::class,
    'weeklySummary',
]);

Route::get('/metrics/top-drivers', [
    DriverMetricsController::class,
    'topDrivers',
]);