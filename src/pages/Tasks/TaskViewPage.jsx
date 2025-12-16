import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthFetch } from "../../hooks/useAuthFetch";

const TaskViewPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { userId } = useAuth();
    const { authFetch, loading } = useAuthFetch();

    const [task, setTask] = useState(null);
    const [prefetching, setPrefetching] = useState(false);

    const asCsv = (val) => Array.isArray(val) ? val.join(", ") : (val ?? "");
    const yesNo = (b) => b ? "Yes" : "No";
    const fmtDate = (d) => {
        if (!d) return "—";
        try {
            const dt = new Date(d);
            if (Number.isNaN(dt.getTime())) return String(d);
            return dt.toLocaleString();
        } catch {
            return String(d);
        }
    };

    useEffect(() => {
        const getTask = async () => {
            if (!id || !userId) return;
            setPrefetching(true);
            try {
                const res = await authFetch(`/task/get/${id}/${userId}`, { method: 'GET' }, toast);
                if (res?.success && res?.data) setTask(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setPrefetching(false);
            }
        };
        getTask();
    }, [id, userId]);

    const container = { width: '100%', boxSizing: 'border-box', padding: '28px 24px' };
    const inner = { maxWidth: 1100, width: '100%', margin: '0 auto' };
    const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 };
    const titleStyle = { margin: 0, fontSize: 26, lineHeight: 1.2, color: '#0f172a' };
    const backBtn = { background: 'transparent', border: '1px solid #e6e9ee', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 15 };
    const card = { background: '#fff', borderRadius: 14, border: '1px solid #e6e9ee', padding: 22, boxShadow: '0 8px 24px rgba(2,6,23,0.06)' };
    const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 };
    const row = { display: 'flex', flexDirection: 'column', gap: 6 };
    const label = { color: '#475569', fontSize: 14, fontWeight: 600 };
    const value = { color: '#0f172a', fontSize: 16, lineHeight: 1.5 };

    return (
        <div style={container}>
            <div style={inner}>
                <div style={header}>
                    <h2 style={titleStyle}>Task Details</h2>
                    <button onClick={() => navigate(-1)} style={backBtn}>Back</button>
                </div>

                {(prefetching || loading) && (
                    <div style={{ padding: 40 }}>
                        <Spinner />
                    </div>
                )}

                {!prefetching && !loading && (
                    <div style={card}>
                        {!task ? (
                            <div style={{ color: '#667085' }}>No data found.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                <div style={grid}>
                                    <div style={row}>
                                        <span style={label}>ID</span>
                                        <span style={value}>{task.id}</span>
                                    </div>
                                    <div style={row}>
                                        <span style={label}>Task Name</span>
                                        <span style={value}>{task.task_name}</span>
                                    </div>

                                    <div style={row}>
                                        <span style={label}>Task Number</span>
                                        <span style={value}>{asCsv(task.task_number) || '—'}</span>
                                    </div>
                                    <div style={row}>
                                        <span style={label}>Bug Number</span>
                                        <span style={value}>{asCsv(task.bug_number) || '—'}</span>
                                    </div>

                                    <div style={row}>
                                        <span style={label}>Type</span>
                                        <span style={value}>{asCsv(task.type) || '—'}</span>
                                    </div>
                                    <div style={row}>
                                        <span style={label}>Branch Name</span>
                                        <span style={value}>{asCsv(task.branch_name) || '—'}</span>
                                    </div>

                                    <div style={row}>
                                        <span style={label}>Changes Type</span>
                                        <span style={value}>{asCsv(task.changes_type) || '—'}</span>
                                    </div>
                                    <div style={row}>
                                        <span style={label}>Merged</span>
                                        <span style={value}>{task.is_merged == null ? '—' : yesNo(task.is_merged)}</span>
                                    </div>

                                    <div style={row}>
                                        <span style={label}>Merged Date</span>
                                        <span style={value}>{fmtDate(task.merged_date)}</span>
                                    </div>
                                    <div style={row}>
                                        <span style={label}>Completed</span>
                                        <span style={value}>{task.is_completed == null ? '—' : yesNo(task.is_completed)}</span>
                                    </div>

                                    <div style={row}>
                                        <span style={label}>Completed Date</span>
                                        <span style={value}>{fmtDate(task.completed_date)}</span>
                                    </div>
                                    <div style={row}>
                                        <span style={label}>Created Date</span>
                                        <span style={value}>{fmtDate(task.created_date)}</span>
                                    </div>

                                    <div style={row}>
                                        <span style={label}>Updated Date</span>
                                        <span style={value}>{fmtDate(task.updated_date)}</span>
                                    </div>
                                </div>

                                <div style={{ ...row, gridColumn: '1 / -1' }}>
                                    <span style={label}>Description</span>
                                    <div style={{
                                        padding: '14px 16px',
                                        borderRadius: 12,
                                        border: '1px solid #e6e9ee',
                                        background: '#f8fafc',
                                        color: '#0f172a',
                                        fontSize: 16,
                                        lineHeight: 1.6
                                    }}>
                                        {task.description || '—'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskViewPage;