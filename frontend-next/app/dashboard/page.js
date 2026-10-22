import WeeklyChart from "../../components/WeeklyChart";
import MetricsCards from "../../components/MetricsCards";

export default function DashboardPage() {
    return (
        <main style={{ padding: "24px" }}>
            <h1>Driver Performance Dashboard</h1>

            <MetricsCards />

            <p>Weekly delays and average driver ratings</p>

            <WeeklyChart />
        </main>
    );
}