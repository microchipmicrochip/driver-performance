"use client";

import { useState } from "react";
import WeeklyChart from "../../components/WeeklyChart";
import MetricsCards from "../../components/MetricsCards";
import TopDriversChart from "../../components/TopDriversChart";
import DriverSelect from "../../components/DriverSelect";
import DriverDetailsChart from "../../components/DriverDetailsChart";
import DriverDetailsTable from "../../components/DriverDetailsTable";
import DriverIncidentsChart from "../../components/DriverIncidentsChart";

export default function DashboardPage() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedDriver, setSelectedDriver] = useState("");

    return (
        <main style={{ padding: "24px" }}>
            <h1>Driver Performance Dashboard</h1>

            <MetricsCards />

            <h2>Filters</h2>

            <label>
                Start date:{" "}
                <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                />
            </label>

            {" "}

            <label>
                End date:{" "}
                <input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                />
            </label>

            <br />
            <br />
            <br />

            <DriverSelect
                selectedDriver={selectedDriver}
                onSelect={setSelectedDriver}
            />

            <h2>Selected Driver Performance</h2>

            <DriverDetailsChart
                driverId={selectedDriver}
                startDate={startDate}
                endDate={endDate}
            />

            <DriverDetailsTable
                driverId={selectedDriver}
                startDate={startDate}
                endDate={endDate}
            />

            <h2>Selected Driver Incidents</h2>

            <DriverIncidentsChart
                driverId={selectedDriver}
                startDate={startDate}
                endDate={endDate}
            />



            <h2>Weekly Performance</h2>

            <WeeklyChart
                startDate={startDate}
                endDate={endDate}
            />

            <h2>Top Drivers by Violations</h2>
            <TopDriversChart />
        </main>
    );
}