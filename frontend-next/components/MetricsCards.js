"use client";

import useSWR from "swr";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function MetricsCards() {
    const { data, error, isLoading } = useSWR(
        "/api/proxy/metrics/weekly",
        fetcher
    );

    if (isLoading) return <p>Loading metrics...</p>;
    if (error) return <p>Failed to load metrics.</p>;
    if (!data) return null;

    const totalDelays = data.reduce(
        (total, row) => total + Number(row.total_delays),
        0
    );

    const totalAccidents = data.reduce(
        (total, row) => total + Number(row.total_accidents),
        0
    );

    const averageRating =
        data.reduce((total, row) => total + Number(row.avg_rating), 0) /
        data.length;

    return (
        <section style={{ display: "flex", gap: "16px", margin: "24px 0" }}>
            <div>
                <h3>Total Delays</h3>
                <p>{totalDelays}</p>
            </div>

            <div>
                <h3>Total Accidents</h3>
                <p>{totalAccidents}</p>
            </div>

            <div>
                <h3>Average Rating</h3>
                <p>{averageRating.toFixed(2)}</p>
            </div>
        </section>
    );
}