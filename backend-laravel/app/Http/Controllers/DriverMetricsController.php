<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

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
    public function topDrivers(Request $request)
    {
        $limit = min(
            max((int) $request->query('limit', 10), 1),
            100
        );

        $cacheKey = "top_drivers:{$limit}";

        $data = Cache::remember(
            $cacheKey,
            now()->addMinutes(5),
            function () use ($limit) {
                return DB::table('driver_profiles')
                    ->select(
                        'driver_id',
                        DB::raw('SUM(violations_count) AS total_violations')
                    )
                    ->groupBy('driver_id')
                    ->orderByDesc('total_violations')
                    ->limit($limit)
                    ->get();
            }
        );

        return response()->json($data);
    }
}