<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class DriverProfileSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/driver_profiles.csv');

        if (! File::exists($path)) {
            throw new \RuntimeException("CSV file not found: {$path}");
        }

        if (DB::table('driver_profiles')->exists()) {
            $this->command->warn(
                'driver_profiles already contains data. Seeder skipped.'
            );

            return;
        }

        $handle = fopen($path, 'r');

        $headers = fgetcsv($handle);
        $rows = [];

        while (($data = fgetcsv($handle)) !== false) {
            $row = array_combine($headers, $data);

            $rows[] = [
                'driver_id' => $row['driver_id'],
                'date' => $row['date'],
                'delays_minutes' => (int) $row['delays_minutes'],
                'behavioral_problems' => (int) $row['behavioral_problems'],
                'violations_count' => (int) $row['violations_count'],
                'accidents_count' => (int) $row['accidents_count'],
                'rating' => (float) $row['rating'],
                'route_id' => $row['route_id'],
                'vehicle_id' => $row['vehicle_id'],
                'shift' => $row['shift'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        fclose($handle);

        foreach (array_chunk($rows, 500) as $chunk) {
            DB::table('driver_profiles')->insert($chunk);
        }

        $this->command->info(count($rows) . ' driver profiles imported.');
    }
}