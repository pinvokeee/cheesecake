import { Box, Button, CircularProgress, Stack } from "@mui/material"
import { useTask } from "./hooks/useTask";
import "./TaskView.css";

type Props = {
    
}

export const TaskView = (props: Props) => {

    const { taskItems } = useTask();

    if (!taskItems) return <Box className={"container"}><CircularProgress /></Box>

    return <>
        <Box className={"container"}>
            <Stack gap={2}>
                { taskItems.map(node => <Button variant="contained">{ node.text }</Button>) }
            </Stack>
        </Box>

    </>
}