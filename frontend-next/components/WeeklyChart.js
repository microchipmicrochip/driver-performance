"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useSWR from "swr";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function WeeklyChart() {
    const { data, error, isLoading } = useSWR(
        "/api/proxy/metrics/weekly",
        fetcher
    );

    if (isLoading) return <p>Loading chart...</p>;
    if (error) return <p>Failed to load chart.</p>;
    if (!data) return null;

    const chartData = {
        labels: data.map((row) =>
            new Date(row.week).toLocaleDateString()
        ),

        datasets: [
            {
                label: "Total Delays",
                data: data.map((row) => Number(row.total_delays)),
                borderColor: "blue",
                backgroundColor: "blue",
            },
            {
                label: "Average Rating",
                data: data.map((row) => Number(row.avg_rating)),
                borderColor: "green",
                backgroundColor: "green",
            },
        ],
    };

    return <Line data={chartData} />;
}