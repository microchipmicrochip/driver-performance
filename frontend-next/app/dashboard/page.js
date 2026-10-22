import WeeklyChart from "../../components/WeeklyChart";

export default function DashboardPage() {
    return (
        <main style={{ padding: "24px" }}>
            <h1>Driver Performance Dashboard</h1>

            <p>Weekly delays and average driver ratings</p>

            <WeeklyChart />
        </main>
    );
}