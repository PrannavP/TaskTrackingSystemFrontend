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
    const yesNo = (b) => (b ? "Yes" : "No");
    const fmtDate = (d) => {
        if (!d) return "—";
        const dt = new Date(d);
        return Number.isNaN(dt.getTime()) ? String(d) : dt.toLocaleString();
    };

    useEffect(() => {
        const getTask = async () => {
            if (!id || !userId) return;
            setPrefetching(true);
            try {
                const res = await authFetch(`/task/get/${id}/${userId}`, { method: "GET" }, toast);
                if (res?.success) setTask(res.data);
            } finally {
                setPrefetching(false);
            }
        };
        getTask();
    }, [id, userId]);

    /* ================== STYLES ================== */

    const container = { padding: "28px 24px" };
    const inner = { maxWidth: 1100, margin: "0 auto" };

    const header = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    };

    const h1 = { fontSize: 28, fontWeight: 700, color: "#0f172a", margin: 0 };
    const h2 = { fontSize: 18, fontWeight: 600, color: "#0f172a" };

    const backBtn = {
        border: "1px solid #e6e9ee",
        padding: "10px 14px",
        borderRadius: 10,
        background: "#fff",
        cursor: "pointer",
        fontSize: 14,
    };

    const card = {
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e6e9ee",
        padding: 24,
        boxShadow: "0 8px 24px rgba(2,6,23,0.06)",
    };

    const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 };
    const row = { display: "flex", flexDirection: "column", gap: 6 };

    const label = {
        fontSize: 13,
        fontWeight: 600,
        color: "#64748b",
        textTransform: "uppercase",
    };

    const value = { fontSize: 16, fontWeight: 500, color: "#0f172a" };
    const metaValue = { fontSize: 14, color: "#475569" };

    const section = { display: "flex", flexDirection: "column", gap: 16 };
    const divider = { height: 1, background: "#e6e9ee", margin: "6px 0" };

    return (
        <div style={container}>
            <div style={inner}>
                <div style={header}>
                    <h1 style={h1}>Task Details</h1>
                    <button onClick={() => navigate(-1)} style={backBtn}>
                        Back
                    </button>
                </div>

                {(prefetching || loading) && (
                    <div style={{ padding: 40 }}>
                        <Spinner />
                    </div>
                )}

                {!prefetching && !loading && (
                    <div style={card}>
                        {!task ? (
                            <div style={{ color: "#667085" }}>No data found.</div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                
                                {/* Basic Info */}
                                <div style={section}>
                                    <span style={h2}>Basic Information</span>
                                    <div style={grid}>
                                        <div style={row}>
                                            <span style={label}>Task Name</span>
                                            <span style={value}>{task.task_name}</span>
                                        </div>
                                        <div style={row}>
                                            <span style={label}>Type</span>
                                            <span style={value}>{asCsv(task.type) || "—"}</span>
                                        </div>
                                        <div style={row}>
                                            <span style={label}>Task Number</span>
                                            <span style={metaValue}>{asCsv(task.task_number) || "—"}</span>
                                        </div>
                                        <div style={row}>
                                            <span style={label}>Bug Number</span>
                                            <span style={metaValue}>{asCsv(task.bug_number) || "—"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={divider} />

                                {/* Status */}
                                <div style={section}>
                                    <span style={h2}>Status</span>
                                    <div style={grid}>
                                        <div style={row}>
                                            <span style={label}>Branch</span>
                                            <span style={value}>{asCsv(task.branch_name) || "—"}</span>
                                        </div>
                                        <div style={row}>
                                            <span style={label}>Merged</span>
                                            <span style={value}>
                                                {task.is_merged == null ? "—" : yesNo(task.is_merged)}
                                            </span>
                                        </div>
                                        <div style={row}>
                                            <span style={label}>Completed</span>
                                            <span style={value}>
                                                {task.is_completed == null ? "—" : yesNo(task.is_completed)}
                                            </span>
                                        </div>
                                        <div style={row}>
                                            <span style={label}>Published</span>
                                            <span style={value}>
                                                {task.is_published == null ? "—" : yesNo(task.is_published)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div style={divider} />

                                {/* Timeline */}
                                <div style={section}>
                                    <span style={h2}>Timeline</span>
                                    <div style={grid}>
                                        <div style={row}>
                                            <span style={label}>Created</span>
                                            <span style={metaValue}>{fmtDate(task.created_date)}</span>
                                        </div>
                                        <div style={row}>
                                            <span style={label}>Updated</span>
                                            <span style={metaValue}>{fmtDate(task.updated_date)}</span>
                                        </div>
                                        <div style={row}>
                                            <span style={label}>Merged Date</span>
                                            <span style={metaValue}>{fmtDate(task.merged_date)}</span>
                                        </div>
                                        <div style={row}>
                                            <span style={label}>Completed Date</span>
                                            <span style={metaValue}>{fmtDate(task.completed_date)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={divider} />

                                {/* Description */}
                                <div style={section}>
                                    <span style={h2}>Description</span>
                                    <div
                                        style={{
                                            padding: "18px 20px",
                                            borderRadius: 14,
                                            border: "1px solid #e6e9ee",
                                            background: "#f8fafc",
                                            fontSize: 16,
                                            lineHeight: 1.7,
                                            color: "#0f172a",
                                        }}
                                    >
                                        {task.description || "—"}
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