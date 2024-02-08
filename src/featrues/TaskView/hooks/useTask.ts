import { useEffect, useState } from "react"
import { keys } from "../../../common/keys";
import { AppCommonConfig } from "../../../common/types/appConfig";
import { TaskDataController } from "../../Provider/TaskDataController";
import { TaskItem } from "../../../common/types/TaskItem";
import { TaskQueObject } from "../../../common/types/MeasurementTask";

const getParent = (targetNode: TaskItem, taskMap: Map<string, TaskItem>) => {

    const child = [];
    let currentId: string | undefined = targetNode.id;

    while (currentId && currentId.length > 0) {        
        child.push(currentId);
        currentId = taskMap.get(currentId)?.parentId;
    }

    return child;
}

export const useTask = () => {

    const provider = new TaskDataController();
    
    const [taskNodes, setTaskNodes] = useState<TaskItem[]>([]);
    const [taskLog, setTaskLog] = useState<TaskQueObject[]>([]);
    const taskMap = new Map(taskNodes?.map(task => [task.id, task]));

    useEffect(() => {        
        
        provider.getTaskItems().then(nodes => setTaskNodes(nodes));
        provider.loadTaskLog().then(log => setTaskLog(log));

    }, []);

    const getSelecter = (parentTaskNode?: TaskItem) => {
        if (!parentTaskNode) return taskNodes?.filter(node => node.parentId == "") ?? [];
        return taskNodes?.filter(node => node.parentId == parentTaskNode.id) ?? [];        
    }

    const hasChild = (taskNode: TaskItem) => {
        return taskNodes?.find(n => n.parentId == taskNode.id) != undefined;
    }

    const getParentsArray = (target: TaskItem | undefined) => {
        if (!target) return [];
        return getParent(target, taskMap).map(id => taskMap.get(id) as TaskItem).reverse();
    }

    const handleTask = (target: TaskItem) => {
        // const task = provider.getTask(target, taskLog);
        // const newLog = provider.handleTask(target, taskLog, taskNodes);
        // setTaskLog([...newLog]);

        // console.log(newLog);

        // console.log(provider.getTaskLog());
    }

    const getCurrentTask = () => {

        // const mtask = provider.getCurrentTask(taskLog);
        // if (!mtask) return mtask;

        // return taskMap.get(mtask.taskId) as TaskItem;
    }

    const getCurrentMeasurementTask = () => {
        // return currentMeasuredTask;
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