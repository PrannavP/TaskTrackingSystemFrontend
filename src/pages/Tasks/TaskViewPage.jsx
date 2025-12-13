import { useEffect } from "react";
import { useParams } from "react-router-dom";

const TaskViewPage = () => {
    const { params } = useParams();

    useEffect(() => {
        
    }, [params])

    return(
        <div>
            <h1>Task View Page</h1>
        </div>
    );
};

export default TaskViewPage;