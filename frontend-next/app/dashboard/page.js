import WeeklyChart from "../../components/WeeklyChart";
import MetricsCards from "../../components/MetricsCards";
import TopDriversChart from "../../components/TopDriversChart";

export default function DashboardPage() {
    return (
        <main style={{ padding: "24px" }}>
            <h1>Driver Performance Dashboard</h1>

            <MetricsCards />

            <h2>Weekly Performance</h2>
            <WeeklyChart />

            <h2>Top Drivers by Violations</h2>
            <TopDriversChart />
        </main>
    );
}