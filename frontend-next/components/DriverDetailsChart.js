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

export default function DriverDetailsChart({
    driverId,
    startDate,
    endDate,
}) {
    if (!driverId) {
        return <p>Select a driver to view details.</p>;
    }

    const params = new URLSearchParams();

    if (startDate) params.append("start", startDate);
    if (endDate) params.append("end", endDate);

    const query = params.toString();
    const url = `/api/proxy/metrics/driver/${driverId}${query ? `?${query}` : ""
        }`;

    const { data, error, isLoading } = useSWR(url, fetcher);

    if (isLoading) return <p>Loading driver details...</p>;
    if (error) return <p>Failed to load driver details.</p>;
    if (!data || data.length === 0) {
        return <p>No records found for this driver.</p>;
    }

    const chartData = {
        labels: data.map((row) =>
            new Date(row.date).toLocaleDateString()
        ),

        datasets: [
            {
                label: "Delays in Minutes",
                data: data.map((row) => Number(row.delays_minutes)),
                borderColor: "red",
                backgroundColor: "red",
            },
            {
                label: "Rating",
                data: data.map((row) => Number(row.rating)),
                borderColor: "green",
                backgroundColor: "green",
            },
        ],
    };

    return <Line data={chartData} />;
}