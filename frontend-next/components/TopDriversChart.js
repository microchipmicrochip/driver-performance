"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import useSWR from "swr";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function TopDriversChart() {
    const { data, error, isLoading } = useSWR(
        "/api/proxy/metrics/top-drivers?limit=10",
        fetcher
    );

    if (isLoading) return <p>Loading top drivers...</p>;
    if (error) return <p>Failed to load top drivers.</p>;
    if (!data) return null;

    const chartData = {
        labels: data.map((driver) => driver.driver_id),
        datasets: [
            {
                label: "Total Violations",
                data: data.map((driver) => Number(driver.total_violations)),
                backgroundColor: "orange",
            },
        ],
    };

    return <Bar data={chartData} />;
}