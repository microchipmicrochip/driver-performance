<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DriverMetricsController extends Controller
{
        public function weeklySummary(Request $request)
    {
        $request->validate([
            'start' => 'nullable|date',
            'end' => 'nullable|date|after_or_equal:start',
        ]);

        $start = $request->query('start');
        $end = $request->query('end');

        $cacheKey = 'weekly_summary:'
            . ($start ?? 'all')
            . ':'
            . ($end ?? 'all');

        $data = Cache::remember(
            $cacheKey,
            now()->addMinutes(5),
            function () use ($start, $end) {
                $query = DB::table('driver_profiles');

                if ($start) {
                    $query->whereDate('date', '>=', $start);
                }

                if ($end) {
                    $query->whereDate('date', '<=', $end);
                }

                return $query
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

        public function driverDetails(Request $request, string $driverId)
    {
        $request->validate([
            'start' => 'nullable|date',
            'end' => 'nullable|date|after_or_equal:start',
        ]);

        $start = $request->query('start');
        $end = $request->query('end');

        $cacheKey = 'driver_details:'
            . $driverId . ':'
            . ($start ?? 'all') . ':'
            . ($end ?? 'all');

        $data = Cache::remember(
            $cacheKey,
            now()->addMinutes(5),
            function () use ($driverId, $start, $end) {
                $query = DB::table('driver_profiles')
                    ->where('driver_id', $driverId);

                if ($start) {
                    $query->whereDate('date', '>=', $start);
                }

                if ($end) {
                    $query->whereDate('date', '<=', $end);
                }

                return $query
                    ->orderBy('date')
                    ->get();
            }
        );

        if ($data->isEmpty()) {
            return response()->json([
                'message' => 'Driver not found.',
            ], 404);
        }

        return response()->json($data);
    }

        public function interventions(Request $request)
    {
        $threshold = max(
            (int) $request->query('threshold', 100),
            0
        );

        $cacheKey = "interventions:{$threshold}";

        $data = Cache::remember(
            $cacheKey,
            now()->addMinutes(5),
            function () use ($threshold) {
                return DB::table('driver_profiles')
                    ->select(
                        'driver_id',
                        DB::raw('SUM(accidents_count) AS total_accidents'),
                        DB::raw('SUM(violations_count) AS total_violations'),
                        DB::raw('AVG(rating) AS avg_rating')
                    )
                    ->groupBy('driver_id')
                    ->havingRaw(
                        'SUM(accidents_count) >= ?',
                        [$threshold]
                    )
                    ->orderByDesc('total_accidents')
                    ->get();
            }
        );

        return response()->json($data);
    }



        public function ratingTrends(Request $request)
    {
        $request->validate([
            'start' => 'nullable|date',
            'end' => 'nullable|date|after_or_equal:start',
        ]);

        $start = $request->query('start');
        $end = $request->query('end');

        $cacheKey = 'rating_trends:'
            . ($start ?? 'all') . ':'
            . ($end ?? 'all');

        $data = Cache::remember(
            $cacheKey,
            now()->addMinutes(5),
            function () use ($start, $end) {
                $query = DB::table('driver_profiles');

                if ($start) {
                    $query->whereDate('date', '>=', $start);
                }

                if ($end) {
                    $query->whereDate('date', '<=', $end);
                }

                return $query
                    ->select(
                        DB::raw("DATE_TRUNC('week', date) AS week"),
                        DB::raw('AVG(rating) AS avg_rating')
                    )
                    ->groupByRaw("DATE_TRUNC('week', date)")
                    ->orderBy('week')
                    ->get();
            }
        );

        return response()->json($data);
    }


        public function drivers()
    {
        $data = Cache::remember(
            'drivers_list',
            now()->addMinutes(5),
            function () {
                return DB::table('driver_profiles')
                    ->select('driver_id')
                    ->distinct()
                    ->orderBy('driver_id')
                    ->get();
            }
        );

        return response()->json($data);
    }
}