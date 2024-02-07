import { Box, Button, Card, CardActions, CardContent, Container } from "@mui/material";
import { MeasurementTask } from "../../common/types/MeasurementTask"
import { TaskNode } from "../../common/types/TaskNode"

type Props = {
    taskMap: Map<string, TaskNode>,
    states: MeasurementTask[],
}

export const TaskList = (props: Props) => {

    const { taskMap, states } = props;
    const list = states.filter(t => t.state != "stop").map(t => ({ ...t, node: taskMap.get(t.taskId) }));        

    return <Box>
        { list.map(t => 
            <Card variant="outlined">
                <CardContent>{t.node?.text}</CardContent>
                <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>) }
    </Box>
}