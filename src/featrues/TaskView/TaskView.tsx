import { Alert, AlertColor, Box, Breadcrumbs, Button, CircularProgress, Divider, Link, Snackbar, Stack, Typography } from "@mui/material"
import { useTask } from "./hooks/useTask";
import "./TaskView.css";
import { useCallback, useState } from "react";
import { TaskCategoryObject } from "../../common/types/TaskCategory";
import { Measurement } from "./Measurement";
import { Message } from "./Message";
import { TaskQueue } from "./TaskQueue";
import { TaskQueueObject } from "../../common/types/TaskQueObject";

type Props = {
    
}

export const TaskView = (props: Props) => {

    const onChangedTask = (target: TaskQueueObject) => {

        if (target.state == "start") {
            const task = categories.find(t => t.id == target.taskId);
            if (task) setMessages(st => [...st, [crypto.randomUUID(), `${task?.text}を開始しました`, "success"]]);
        }

        if (target.state == "stop") {
            const task = categories.find(t => t.id == target.taskId);
            if (task) setMessages(st => [...st, [crypto.randomUUID(), `${task?.text}を終了しました`, "info"]]);
        }
    };

    const { 
            getSelecter, 
            getParentsArray, 
            hasChild, 
            handleStartTask,
            handleStopTask,
            handleCancelTask,
            handleTask,
            getTaskQueue,
            getTaskCategories,
            getTaskStates,

    } = useTask({ onChangedTask });

    const [selectedNode, setSelectedNode] = useState<TaskCategoryObject>();
    const [messages, setMessages] = useState<[string, string, AlertColor][]>([]);

    const queue = getTaskQueue();
    const categories = getTaskCategories();
    const states = getTaskStates();

    const selecter = getSelecter(selectedNode);
    const breadCrumbs = getParentsArray(selectedNode);
 
    if (!selecter) return <Box className={"container"}><CircularProgress /></Box>

    const onClickNode = (node: TaskCategoryObject) => {

        if (hasChild(node)) setSelectedNode(node);
        else {
            handleStartTask(node);
        }
    }

    const onClickBreadCrumb = (node: TaskCategoryObject) => {
        setSelectedNode(node);
    }

    const onStopTask = (queId: string) => {

        const queObject = queue.get(queId);

        if (queObject) {
            handleStopTask(queObject);
        }
    }

    const onCancelTask = (queId: string) => {
        handleCancelTask(queId);
    }

    const taskQueueProps = {
        categories,
        queue,
        states,
        onStopTask,
        onCancelTask,
    }

    return <>
        <Box className={"container"}>

            { 
                messages.map(m => <Message 
                key={m[0]} 
                text={m[1]}
                alertColor={m[2]}
                isOpen={messages.find(mm => mm[0] == m[0]) != undefined}
                onClose={() => setMessages(_ => _.filter(um => um[0] != m[0]))} />) 
            }

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
                        
            <TaskQueue {...taskQueueProps}></TaskQueue>

        </Box>

    </>
}