import { useAuthFetch } from "../../hooks/useAuthFetch";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import MetricsCard from "../../components/dashboard/MetricsCard";
import Spinner from "../../components/Spinner";

const DashboardPage = () => {
    const { userId } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const { authFetch, loading } = useAuthFetch();

    // get the dashboard metrics when component mounts
    useEffect(() => {
        fetchDashboardMetrics(userId);
    }, [userId]);

    // function to fetch dashboard metrics
    const fetchDashboardMetrics = async (user_id) => {
        try{
            const response = await authFetch(`/dashboard/getDashboardMetrics/${user_id}`, {
                method: "GET"
            }, toast);

            const data = response?.data || response || {};
            setMetrics(data);
        }catch(err){
            console.error("Error while fetching dashboard metrics.", err);
        }
    };

    return(
        <div>
            {loading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                    <Spinner />
                </div>
            )}

            {!loading && (
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 18, marginLeft: 40 }}>
                    <MetricsCard title="Tasks Completed This Month" count={metrics?.tasksCompletedThisMonth ?? 0} />
                    <MetricsCard title="Not Merged" count={metrics?.notMergedCount ?? 0} />
                    <MetricsCard title="Completed Bugs" count={metrics?.completedBugCount ?? 0} />
                    <MetricsCard title="Completed Tasks" count={metrics?.completedTaskCount ?? 0} />
                    <MetricsCard title="In Progress" count={metrics?.inProgressCount ?? 0} />
                </div>
            )}
        </div>
    );
};

export default DashboardPage;