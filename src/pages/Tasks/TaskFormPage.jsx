import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../../components/InputField";
import Select from "../../components/Select";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import "../../styles/register.css";

const TaskFormPage = ({ isEdit = false }) => {
    const navigate = useNavigate();
    const { authFetch, loading } = useAuthFetch();
    const { userId } = useAuth();
    const { id: routeTaskId } = useParams();

    const [taskName, setTaskName] = useState("");
    const [taskNumber, setTaskNumber] = useState("");
    const [bugNumber, setBugNumber] = useState("");
    const [type, setType] = useState([]);
    const [branchName, setBranchName] = useState("");
    const [changesType, setChangesType] = useState([]);
    const [description, setDescription] = useState("");
    const [prefillLoading, setPrefillLoading] = useState(false);

    // ref
    const firstElemRef = useRef();

    // focus first input when component mounts
    useEffect(() => {
        firstElemRef.current.focus();
    }, []);

    // Helpers
    const arrayToCsv = (arr) => Array.isArray(arr) ? arr.join(", ") : (arr == null ? "" : String(arr));
    const normalizeTypeCasing = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(v => {
            if (typeof v !== 'string') return v;
            if (!v) return v;
            return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
        });
    };

    // Prefill form in edit mode
    useEffect(() => {
        const fetchTask = async () => {
            if (!isEdit) return;
            if (!routeTaskId || !userId) return;
            setPrefillLoading(true);
            try {
                const res = await authFetch(`/task/get/${routeTaskId}/${userId}`, { method: 'GET' }, toast);
                if (res?.success && res?.data) {
                    const d = res.data;
                    setTaskName(d.task_name || "");
                    setTaskNumber(arrayToCsv(d.task_number));
                    setBugNumber(arrayToCsv(d.bug_number));
                    setType(normalizeTypeCasing(d.type));
                    setBranchName(arrayToCsv(d.branch_name));
                    setChangesType(Array.isArray(d.changes_type) ? d.changes_type : []);
                    setDescription(d.description || "");
                }
            } catch (e) {
                // errors are already toasted in hook if message exists
                console.error(e);
            } finally {
                setPrefillLoading(false);
            }
        };
        fetchTask();
    }, [isEdit, routeTaskId, userId]);

    const hasValue = (v) => Array.isArray(v) ? v.length > 0 : (v !== "" && v != null);
    const isFormValid = taskName.trim() !== "" && hasValue(type) && hasValue(changesType) && branchName.trim() !== "";

    const handleReset = () => {
        setTaskName("");
        setTaskNumber("");
        setBugNumber("");
        setType([]);
        setBranchName("");
        setChangesType([]);
        setDescription("");
        firstElemRef.current.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            toast.error("Please fill required fields: Task Name, Type and Changes Type.");
            return;
        }

        // parse comma-separated inputs into arrays
        const parseToArray = (val, convertNumber = false) => {
            if (val == null) return [];
            if (Array.isArray(val)) return val;
            const s = String(val).trim();
            if (!s) return [];
            return s.split(',').map(p => p.trim()).filter(Boolean).map(item => {
                if (convertNumber) {
                    const n = Number(item);
                    return Number.isNaN(n) ? item : n;
                }
                return item;
            });
        };

        const parsedTaskNumbers = parseToArray(taskNumber, true);
        const parsedBugNumbers = parseToArray(bugNumber, true);
        const parsedBranchNames = parseToArray(branchName, false);

        const payload = {
            task_name: taskName,
            task_number: parsedTaskNumbers.length ? parsedTaskNumbers : null,
            bug_number: parsedBugNumbers.length ? parsedBugNumbers : null,
            type,
            branch_name: parsedBranchNames.length ? parsedBranchNames : null,
            changes_type: changesType,
            description: description || null
        };

        if (isEdit) {
            const taskIdNum = Number(routeTaskId);
            payload.task_id = Number.isNaN(taskIdNum) ? routeTaskId : taskIdNum;
        } else {
            payload.user_id = userId;
        }

        try {
            const url = isEdit ? `/task/update/${routeTaskId}` : '/task/create';
            const response = await authFetch(url, {
                method: 'POST',
                body: JSON.stringify(payload)
            }, toast);

            if (response && response.success === true) {
                // clear form and navigate back to tasks list
                handleReset();
                navigate(-1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ width: '100%', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                    <h2 style={{ margin: 0 }}>{isEdit ? 'Update Task' : 'Create Task'}</h2>
                </div>

                <form onSubmit={handleSubmit} onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                        e.preventDefault();
                    }
                    }}  
                noValidate>
                    {isEdit && prefillLoading ? (
                        <div style={{ padding: 24 }}>
                            <Spinner />
                        </div>
                    ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                            <InputField
                                ref={firstElemRef}
                                type="text"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                isRequired={true}
                                labelTxt="Task Name"
                                validationMessage="Task name is required."
                            />
                        </div>

                        <div>
                            <InputField
                                type="text"
                                value={taskNumber}
                                onChange={(e) => setTaskNumber(e.target.value)}
                                isRequired={false}
                                labelTxt="Task Number"
                                validationMessage=""
                                placeholder="e.g. 30978, 30979 (comma-separated)"
                            />
                        </div>

                        <div>
                            <InputField
                                type="text"
                                value={bugNumber}
                                onChange={(e) => setBugNumber(e.target.value)}
                                isRequired={false}
                                labelTxt="Bug Number"
                                validationMessage=""
                                placeholder="e.g. 454545, 009912 (comma-separated)"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 6, color: '#334155', fontSize: 13 }}>Type <span style={{ color: 'red' }}>*</span></label>
                            <Select
                                options={["Task", "Bug"]}
                                value={type}
                                onChange={(val) => setType(val || "")}
                                placeholder="Select type"
                                isClearable={false}
                                isMulti={true}
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <InputField
                                type="text"
                                value={branchName}
                                onChange={(e) => setBranchName(e.target.value)}
                                isRequired={true}
                                labelTxt="Branch Name"
                                validationMessage="Branch name is required."
                                placeholder="e.g. feature/login-fix"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 6, color: '#334155', fontSize: 13 }}>Changes Type <span style={{ color: 'red' }}>*</span></label>
                            <Select
                                options={["API", "UI", "DB"]}
                                value={changesType}
                                onChange={(val) => setChangesType(val || "")}
                                placeholder="Select changes type"
                                isClearable={false}
                                isMulti={true}
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: 6, color: '#334155', fontSize: 13 }}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                placeholder="Optional: add details, links to PRs, steps to reproduce, etc."
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e6e9ee', background: '#fff', fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }}
                            />
                        </div>
                    </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 42, alignItems: 'center' }}>
                        <div>
                            <Button type="button" buttonType="text" color="error" onClick={() => { handleReset(); navigate(-1); }}>Cancel</Button>
                        </div>

                        <div>
                            <Button type="submit" content={loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Task' : 'Create Task')} buttonType="contained" isDisabled={!isFormValid || loading || (isEdit && prefillLoading)} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskFormPage;