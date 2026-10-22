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

Route::get('/metrics/driver/{driverId}', [
    DriverMetricsController::class,
    'driverDetails',
]);

Route::get('/metrics/interventions', [
    DriverMetricsController::class,
    'interventions',
]);

Route::get('/metrics/rating-trends', [
    DriverMetricsController::class,
    'ratingTrends',
]);