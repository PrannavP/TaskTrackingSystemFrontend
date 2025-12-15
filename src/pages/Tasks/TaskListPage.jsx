import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../../components/InputField";
import Select from "../../components/Select";
import Button from "../../components/Button";
import { IconEye, IconPencil } from '@tabler/icons-react';
import Spinner from "../../components/Spinner";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import "../../styles/register.css";

const yesNoOptions = [
    { label: 'All', value: '' },
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' }
];

const typeOptions = ["Task", "Bug", "Improvement"];

const TaskListPage = () => {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const { authFetch, loading } = useAuthFetch();
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [filters, setFilters] = useState({
        type: '',
        bug_number: '',
        task_number: '',
        is_merged: '',
        is_completed: '',
        task_name: ''
    });

    const [tasks, setTasks] = useState([]);
    const [fetching, setFetching] = useState(false);

    const buildPayload = () => {
        const payload = { user_id: userId };
        if (filters.type) payload.type = filters.type;
        if (filters.bug_number) payload.bug_number = filters.bug_number;
        if (filters.task_number) payload.task_number = filters.task_number;
        if (filters.is_merged !== '') payload.is_merged = filters.is_merged === 'true';
        if (filters.is_completed !== '') payload.is_completed = filters.is_completed === 'true';
        if (filters.task_name) payload.task_name = filters.task_name;
        return payload;
    };

    const fetchList = async () => {
        setFetching(true);
        try {
            const payload = buildPayload();
            const response = await authFetch('/task/list', {
                method: 'POST',
                body: JSON.stringify(payload)
            }, toast);

            if (response && response.success === true) {
                setTasks(response.data || []);
            } else {
                setTasks([]);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch tasks');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (userId) fetchList();
    }, [userId]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = async (e) => {
        e && e.preventDefault();
        await fetchList();
    };

    const handleReset = () => {
        setFilters({ type: '', bug_number: '', task_number: '', is_merged: '', is_completed: '', task_name: '' });
        setTasks([]);
    };

    const containerStyle = { width: '100%', boxSizing: 'border-box', padding: '28px 24px' };
    const innerStyle = { maxWidth: 1200, width: '100%', margin: '0 auto' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 };
    const cardStyle = { padding: 18, marginBottom: 18, borderRadius: 10 };
    const filterGrid = { display: 'grid', gridTemplateColumns: '1fr 180px 180px 1fr', gap: 12, alignItems: 'start' };
    const selectStyles = { control: (base) => ({ ...base, minHeight: 44, borderRadius: 8 }) };

    const tableWrapper = { overflowX: 'auto', padding: 0 }; // internal horizontal scroll only
    const tableStyle = { width: '100%', borderCollapse: 'collapse', minWidth: 1100, tableLayout: 'auto' };
    const thStyle = { padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#0f172a' };
    const tdStyle = { padding: '14px 16px', verticalAlign: 'middle', color: '#0f172a', lineHeight: 1.5 };
    const taskNameCell = { whiteSpace: 'normal', wordBreak: 'break-word' };

    return (
        <div style={containerStyle}>
            <div style={innerStyle}>
                <div style={headerStyle}>
                    <h2 style={{ margin: 0 }}>Tasks</h2>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setShowFilterModal(true)} style={{ background: 'transparent', border: '1px solid #e6e9ee', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Filter</button>
                        <Button htmlType="button" type="contained" onClick={() => navigate('/task/add')}>New Task</Button>
                    </div>
                </div>

                {/* Filter modal */}
                {showFilterModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
                        <div style={{ width: 'min(980px, 96%)', background: '#fff', borderRadius: 10, padding: 18, boxShadow: '0 12px 40px rgba(2,6,23,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <h3 style={{ margin: 0 }}>Filters</h3>
                                <button aria-label="Close" onClick={() => setShowFilterModal(false)} style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
                            </div>

                            <form onSubmit={async (e) => { e.preventDefault(); await handleApply(); setShowFilterModal(false); }} style={filterGrid}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, color: '#334155', fontSize: 13 }}>Type</label>
                                    <Select styles={selectStyles} options={typeOptions} value={filters.type} onChange={(v) => handleFilterChange('type', v || '')} placeholder="All types" isClearable={true} />
                                </div>

                                <div>
                                    <InputField type="text" value={filters.task_number} onChange={(e) => handleFilterChange('task_number', e.target.value)} isRequired={false} labelTxt="Task Number" validationMessage="" />
                                </div>

                                <div>
                                    <InputField type="text" value={filters.bug_number} onChange={(e) => handleFilterChange('bug_number', e.target.value)} isRequired={false} labelTxt="Bug Number" validationMessage="" />
                                </div>

                                <div>
                                    <InputField type="text" value={filters.task_name} onChange={(e) => handleFilterChange('task_name', e.target.value)} isRequired={false} labelTxt="Task Name" validationMessage="" />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, color: '#334155', fontSize: 13 }}>Merged</label>
                                    <Select styles={selectStyles} options={yesNoOptions} value={filters.is_merged} onChange={(v) => handleFilterChange('is_merged', v || '')} placeholder="All" isClearable={false} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, color: '#334155', fontSize: 13 }}>Completed</label>
                                    <Select styles={selectStyles} options={yesNoOptions} value={filters.is_completed} onChange={(v) => handleFilterChange('is_completed', v || '')} placeholder="All" isClearable={false} />
                                </div>

                                <div style={{ display: 'flex', gap: 8, gridColumn: '3 / 5', justifyContent: 'flex-end', alignSelf: 'end' }}>
                                    <Button htmlType="button" type="text" color="error" onClick={() => { handleReset(); }}>Reset</Button>
                                    <Button htmlType="submit" type="contained">Apply</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div style={{ padding: 0, borderRadius: 10 }}>
                    {fetching || loading ? (
                        <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
                            <Spinner />
                        </div>
                    ) : (
                        <div style={tableWrapper}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e6e9ee' }}>
                                        <th style={{ ...thStyle, width: 60 }}>ID</th>
                                        <th style={{ ...thStyle }}>Task Name</th>
                                        <th style={{ ...thStyle, width: 120 }}>Task #</th>
                                        <th style={{ ...thStyle, width: 120 }}>Bug #</th>
                                        <th style={{ ...thStyle, width: 140 }}>Type</th>
                                        <th style={{ ...thStyle, width: 90 }}>Merged</th>
                                        <th style={{ ...thStyle, width: 100 }}>Completed</th>
                                        <th style={{ ...thStyle, width: 140 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.length === 0 && (
                                        <tr><td colSpan={8} style={{ padding: 24, color: '#667085' }}>No tasks found.</td></tr>
                                    )}

                                    {tasks.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid #0f1215ff' }}>
                                            <td style={tdStyle}>{t.id}</td>
                                            <td style={{ ...tdStyle, ...taskNameCell }}>{t.task_name}</td>
                                            <td style={tdStyle}>{Array.isArray(t.task_number) ? t.task_number.join(', ') : (t.task_number ?? '')}</td>
                                            <td style={tdStyle}>{Array.isArray(t.bug_number) ? t.bug_number.join(', ') : (t.bug_number ?? '')}</td>
                                            <td style={tdStyle}>{Array.isArray(t.type) ? t.type.join(', ') : (t.type ?? '')}</td>
                                            <td style={tdStyle}>{t.is_merged ? 'Yes' : 'No'}</td>
                                            <td style={tdStyle}>{t.is_completed ? 'Yes' : 'No'}</td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button
                                                        onClick={() => navigate(`/task/view/${t.id}`)}
                                                        aria-label={`View task ${t.id}`}
                                                        title="View"
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: '#2e7d32',
                                                            color: '#fff',
                                                            border: 'none',
                                                            padding: '8px 10px',
                                                            borderRadius: 6,
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <IconEye size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => navigate(`/task/edit/${t.id}`)}
                                                        aria-label={`Edit task ${t.id}`}
                                                        title="Edit"
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: '#2e7d32',
                                                            color: '#fff',
                                                            border: 'none',
                                                            padding: '8px 10px',
                                                            borderRadius: 6,
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <IconPencil size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskListPage;