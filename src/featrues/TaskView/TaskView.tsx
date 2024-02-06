import { Box, Breadcrumbs, Button, CircularProgress, Divider, Link, Stack, Typography } from "@mui/material"
import { useTask } from "./hooks/useTask";
import "./TaskView.css";
import { useState } from "react";
import { TaskNode } from "../../common/types/TaskNode";
import { Measurement } from "./Measurement";
import { TaskList } from "./TaskList";

type Props = {
    
}

export const TaskView = (props: Props) => {

    const { 
            taskMap, 
            getSelecter, 
            getParentsArray, 
            hasChild, 
            handleTask, 
            getCurrentMeasurementTask, 
            getCurrentTask,
            getTaskStates,

    } = useTask();

    const [selectedNode, setSelectedNode] = useState<TaskNode>();
    const currentTask = getCurrentTask();
    const currentMeasuredTask = getCurrentMeasurementTask();
    const states = getTaskStates();

    const selecter = getSelecter(selectedNode);
    const breadCrumbs = getParentsArray(selectedNode);

    console.log(currentTask, currentMeasuredTask);

    if (!selecter) return <Box className={"container"}><CircularProgress /></Box>

    const onClickNode = (node: TaskNode) => {
        console.log(hasChild(node));
        if (hasChild(node)) {
            setSelectedNode(node);
        }
        else {
            handleTask(node);
        }
    }

    const onClickBreadCrumb = (node: TaskNode) => {
        setSelectedNode(node);
    }

    return <>
        <Box className={"container"}>
            <Stack gap={2}>

                <Measurement currentTask={currentTask} currentMeasuredTask={currentMeasuredTask} />

                <Divider></Divider>
                <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "10pt" }}>
                    {<Link href="#" color="inherit" onClick={(e) => setSelectedNode(undefined)}>{"タスク一覧"}</Link>   }
                    {breadCrumbs.map((node, index) => 
                        (index < breadCrumbs.length - 1) 
                            ? <Link href="#" color="inherit" key={node.id} onClick={(e) => onClickBreadCrumb(node)}>{node.text}</Link> 
                            : <Typography fontSize={"inherit"} color="text.primary" key={node.id}>{node.text}</Typography>)}
                </Breadcrumbs>
                
                { (selecter.map(node => 
                    hasChild(node) ? 
                    <Button variant="contained" key={node.id} onClick={(e) => onClickNode(node)}>{ node.text }</Button> : 
                    <Button color="success" variant="contained" key={node.id} onClick={(e) => onClickNode(node)}>{ node.text }</Button>)) }

                <Divider></Divider>
                
                <TaskList taskMap={taskMap} states={states}></TaskList>

            </Stack>

        </Box>

    </>
}