import { Alert, Box, Breadcrumbs, Button, CircularProgress, Divider, Link, Snackbar, Stack, Typography } from "@mui/material"
import { useTask } from "./hooks/useTask";
import "./TaskView.css";
import { useState } from "react";
import { TaskItem } from "../../common/types/TaskItem";
import { Measurement } from "./Measurement";
import { Message } from "./Message";
import { TaskQue } from "./TaskQue";

type Props = {
    
}

export const TaskView = (props: Props) => {

    const { 
            taskMap, 
            getSelecter, 
            getParentsArray, 
            hasChild, 
            handleTask, 
            // getCurrentMeasurementTask, 
            // getCurrentTask,
            getTaskStates,

    } = useTask();

    const [selectedNode, setSelectedNode] = useState<TaskItem>();
    // const currentTask = getCurrentTask();
    // const currentMeasuredTask = getCurrentMeasurementTask();
    const states = getTaskStates();

    const selecter = getSelecter(selectedNode);
    const breadCrumbs = getParentsArray(selectedNode);

    const [startMessage, setStartMessage] = useState({
        isOpen: false,
        text: "",
    });
 
    if (!selecter) return <Box className={"container"}><CircularProgress /></Box>

    const onClickNode = (node: TaskItem) => {
        if (hasChild(node)) setSelectedNode(node);
        else {
            handleTask(node);
            setStartMessage({
                isOpen: true,
                text: `タスク ${node.text}を開始しました`,
            });
        }
    }

    const onClickBreadCrumb = (node: TaskItem) => {
        setSelectedNode(node);
    }

    return <>
        <Box className={"container"}>

            <Message {...startMessage} onClose={() => setStartMessage((_) => ({ isOpen: false, text: _.text }))}></Message>

            <Stack gap={2}>
                
                <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "10pt" }}>
                    {<Link href="#" color="inherit" onClick={(e) => setSelectedNode(undefined)}>{"タスク一覧"}</Link>   }
                    {breadCrumbs.map((node, index) => 
                        (index < breadCrumbs.length - 1) 
                            ? <Link href="#" color="inherit" key={node.id} onClick={(e) => onClickBreadCrumb(node)}>{node.text}</Link> 
                            : <Typography fontSize={"inherit"} color="text.primary" key={node.id}>{node.text}</Typography>)}
                </Breadcrumbs>

                { (selecter.map(node => 
                    hasChild(node) ? 
                    <Button variant="text" sx={{justifyContent: "left"}} key={node.id} onClick={(e) => onClickNode(node)}>{ node.text }</Button> : 
                    <Button variant="text" sx={{justifyContent: "left"}} key={node.id} onClick={(e) => onClickNode(node)}>{ node.text }</Button>)) }

                {/* { (selecter.map(node => 
                    hasChild(node) ? 
                    <Button variant="contained" key={node.id} onClick={(e) => onClickNode(node)}>{ node.text }</Button> : 
                    <Button color="success" variant="contained" key={node.id} onClick={(e) => onClickNode(node)}>{ node.text }</Button>)) } */}
            </Stack>

            {/* <Stack sx={{overflow: "auto"}}> */}
                {/* <Measurement currentTask={currentTask} currentMeasuredTask={currentMeasuredTask} /> */}

                {/* <Divider></Divider> */}
                            
                <TaskQue taskMap={taskMap} states={states}></TaskQue>

            {/* </Stack> */}


        </Box>

    </>
}