"use client";

import useSWR from "swr";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function DriverSelect({ selectedDriver, onSelect }) {
    const { data, error, isLoading } = useSWR(
        "/api/proxy/drivers",
        fetcher
    );

    if (isLoading) return <p>Loading drivers...</p>;
    if (error) return <p>Failed to load drivers.</p>;

    return (
        <label>
            Driver:{" "}
            <select
                value={selectedDriver}
                onChange={(event) => onSelect(event.target.value)}
            >
                <option value="">Select a driver</option>

                {data.map((driver) => (
                    <option key={driver.driver_id} value={driver.driver_id}>
                        {driver.driver_id}
                    </option>
                ))}
            </select>
        </label>
    );
}