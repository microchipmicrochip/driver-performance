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

export default function DriverIncidentsChart({
    driverId,
    startDate,
    endDate,
}) {
    const params = new URLSearchParams();

    if (startDate) params.append("start", startDate);
    if (endDate) params.append("end", endDate);

    const query = params.toString();
    const url = driverId
        ? `/api/proxy/metrics/driver/${driverId}${query ? `?${query}` : ""}`
        : null;

    const { data, error, isLoading } = useSWR(url, fetcher);

    if (!driverId) {
        return <p>Select a driver to view incidents.</p>;
    }

    if (isLoading) return <p>Loading incidents...</p>;
    if (error) return <p>Failed to load incidents.</p>;
    if (!data || data.length === 0) {
        return <p>No incident records found.</p>;
    }

    const chartData = {
        labels: data.map((row) =>
            new Date(row.date).toLocaleDateString()
        ),

        datasets: [
            {
                label: "Violations",
                data: data.map((row) => Number(row.violations_count)),
                backgroundColor: "orange",
            },
            {
                label: "Accidents",
                data: data.map((row) => Number(row.accidents_count)),
                backgroundColor: "red",
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                beginAtZero: true,
            },
        },
    };

    return <Bar data={chartData} options={options} />;
}