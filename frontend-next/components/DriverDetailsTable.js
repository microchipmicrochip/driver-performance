"use client";

import useSWR from "swr";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function DriverDetailsTable({
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
        return <p>Select a driver to view records.</p>;
    }

    if (isLoading) return <p>Loading records...</p>;
    if (error) return <p>Failed to load records.</p>;
    if (!data || data.length === 0) {
        return <p>No records found.</p>;
    }

    return (
        <table border="1" cellPadding="8">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Delays</th>
                    <th>Accidents</th>
                    <th>Violations</th>
                    <th>Behavioral Problems</th>
                    <th>Rating</th>
                    <th>Route</th>
                    <th>Shift</th>
                </tr>
            </thead>

            <tbody>
                {data.map((row) => (
                    <tr key={row.id}>
                        <td>{row.date}</td>
                        <td>{row.delays_minutes}</td>
                        <td>{row.accidents_count}</td>
                        <td>{row.violations_count}</td>
                        <td>{row.behavioral_problems}</td>
                        <td>{row.rating}</td>
                        <td>{row.route_id}</td>
                        <td>{row.shift}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}