<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DriverMetricsController extends Controller
{
    public function weeklySummary()
    {
        $data = Cache::remember(
            'weekly_summary',
            now()->addMinutes(5),
            function () {
                return DB::table('driver_profiles')
                    ->select(
                        DB::raw("DATE_TRUNC('week', date) AS week"),
                        DB::raw('SUM(delays_minutes) AS total_delays'),
                        DB::raw('SUM(accidents_count) AS total_accidents'),
                        DB::raw('AVG(rating) AS avg_rating')
                    )
                    ->groupByRaw("DATE_TRUNC('week', date)")
                    ->orderBy('week')
                    ->get();
            }
        );

        return response()->json($data);
    }
}