import { Button } from "@mui/material";
import { MeasurementTask } from "../../common/types/MeasurementTask"
import { TaskNode } from "../../common/types/TaskNode"

type Props = {
    taskMap: Map<string, TaskNode>,
    states: MeasurementTask[],
}

export const TaskList = (props: Props) => {

    const { taskMap, states } = props;
    const list = states.filter(t => t.state != "stop").map(t => ({ ...t, node: taskMap.get(t.taskId) }));        

    return <>
        { list.map(t => <Button>{t.node?.text}</Button>) }
    </>
}