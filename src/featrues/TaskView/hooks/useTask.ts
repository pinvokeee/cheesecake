import { useEffect, useState } from "react"
import { keys } from "../../keys";
import { AppCommonConfig } from "../../../common/types/appConfig";
import { TaskDataProvider } from "../../Provider/TaskDataProvider";
import { TaskNode } from "../../../common/types/TaskNode";
import { MeasurementTask } from "../../../common/types/MeasurementTask";

const getParent = (targetNode: TaskNode, taskMap: Map<string, TaskNode>) => {

    const child = [];
    let currentId: string | undefined = targetNode.id;

    while (currentId && currentId.length > 0) {        
        child.push(currentId);
        currentId = taskMap.get(currentId)?.parentId;
    }

    return child;
}

export const useTask = () => {

    const provider = new TaskDataProvider();
    
    const [taskNodes, setTaskNodes] = useState<TaskNode[]>([]);
    const [taskLog, setTaskLog] = useState<MeasurementTask[]>([]);
    const taskMap = new Map(taskNodes?.map(task => [task.id, task]));
    const currentMeasuredTask = provider.getCurrentTask(taskLog);

    useEffect(() => {        
        
        provider.getTaskItems().then(nodes => setTaskNodes(nodes));
        provider.loadTaskLog().then(log => setTaskLog(log));

    }, []);

    const getSelecter = (parentTaskNode?: TaskNode) => {
        if (!parentTaskNode) return taskNodes?.filter(node => node.parentId == "") ?? [];
        return taskNodes?.filter(node => node.parentId == parentTaskNode.id) ?? [];        
    }

    const hasChild = (taskNode: TaskNode) => {
        return taskNodes?.find(n => n.parentId == taskNode.id) != undefined;
    }

    const getParentsArray = (target: TaskNode | undefined) => {
        if (!target) return [];
        return getParent(target, taskMap).map(id => taskMap.get(id) as TaskNode).reverse();
    }

    const handleTask = (target: TaskNode) => {
        const task = provider.getTask(target, taskLog);
        const newLog = provider.handleTask(target, taskLog, taskNodes);
        setTaskLog([...newLog]);

        console.log(newLog);

        // console.log(provider.getTaskLog());
    }

    const getCurrentTask = () => {

        const mtask = provider.getCurrentTask(taskLog);
        if (!mtask) return mtask;

        return taskMap.get(mtask.taskId) as TaskNode;
    }

    const getCurrentMeasurementTask = () => {
        return currentMeasuredTask;
    }

    const getTaskStates = () => {
        return taskLog;
    }

    return {
        taskMap,
        getSelecter,
        getParentsArray,
        hasChild,
        handleTask,
        getCurrentTask,
        getCurrentMeasurementTask,
        getTaskStates,
    }
}