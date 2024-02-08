import { Button, Divider, Stack, Typography } from "@mui/material"
import { TaskItem } from "../../common/types/TaskItem"
import { TaskQueObject } from "../../common/types/MeasurementTask"

type Props = {
    currentTask: TaskItem | undefined,
    currentMeasuredTask: TaskQueObject | undefined,
}

export const Measurement = (props: Props) => {

    const { currentTask, currentMeasuredTask } = props; 
    const isPause = currentMeasuredTask?.state == "pause" ?? false;

    if (!currentTask) {
        return <Typography fontSize={"inherit"} color="text.primary">測定中タスクなし</Typography>;
    }

    return <>
        <Typography fontSize={"inherit"} color="text.primary">最新タスク</Typography>
        <div>{currentTask.text}</div>
        <Stack direction={"row"} gap={4} justifyContent={"center"}>
            <Button fullWidth variant="contained" color="warning">終了</Button>
            <Button disabled={isPause} fullWidth variant="contained" color="success">一時停止</Button>
            <Button fullWidth variant="contained" color="error">キャンセル</Button>
        </Stack>
    </>
}