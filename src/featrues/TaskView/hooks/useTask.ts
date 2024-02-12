import { useEffect, useState } from "react"
import { keys } from "../../../common/keys";
import { AppCommonConfig } from "../../../common/types/appConfig";
import { TaskQueueController } from "../../Provider/TaskQueueController";
import { TaskCategoryObject } from "../../../common/types/TaskCategory";
import { TaskQueueObject } from "../../../common/types/TaskQueObject";
import { TaskQueueDicitonary } from "../../../common/types/TaskQueueDicitonary";

const getParent = (targetNode: TaskCategoryObject, taskMap: Map<string, TaskCategoryObject>) => {

    const child = [];
    let currentId: string | undefined = targetNode.id;

    while (currentId && currentId.length > 0) {        
        child.push(currentId);
        currentId = taskMap.get(currentId)?.parentId;
    }

    return child;
}

type Props = {
    onChangedTask: (target: TaskQueueObject) => void, 
}

export const useTask = (props: Props) => {

    const [taskCategories, setTaskCategories] = useState<TaskCategoryObject[]>([]);
    const [taskQueue, setTaskQueue] = useState<TaskQueueDicitonary>(new TaskQueueDicitonary());

    const onChangeTask = (target: TaskQueueObject) => {
        props.onChangedTask?.call(this, target);
    }

    const controller = new TaskQueueController(onChangeTask); 
    const taskCategoryDic = new Map(taskCategories?.map(task => [task.id, task]));

    useEffect(() => {
        
        controller.getTaskCategoryItems().then(nodes => setTaskCategories(nodes));
        controller.loadTaskQueue().then(log => setTaskQueue(log));

    }, []);

    const getSelecter = (parentTaskNode?: TaskCategoryObject) => {
        if (!parentTaskNode) return taskCategories?.filter(node => node.parentId == "") ?? [];
        return taskCategories?.filter(node => node.parentId == parentTaskNode.id) ?? [];        
    }

    const hasChild = (taskNode: TaskCategoryObject) => {
        return taskCategories?.find(n => n.parentId == taskNode.id) != undefined;
    }

    const getParentsArray = (target: TaskCategoryObject | undefined) => {
        if (!target) return [];
        return getParent(target, taskCategoryDic).map(id => taskCategoryDic.get(id) as TaskCategoryObject).reverse();
    }

    const handleStartTask = (target: TaskCategoryObject) => {
        setTaskQueue(controller.handleTask(undefined, target.id, taskQueue, taskCategories));
    }

    const handleStopTask = (target: TaskQueueObject) => {
        setTaskQueue(controller.handleStopTask(target.queId, taskQueue));
    }

    const handleCancelTask = (targetQueId: string) => {
        setTaskQueue(controller.handleStopTask(targetQueId, taskQueue));
    }

    const getTaskStates = () => {
        return Array.from(taskQueue.values()).filter(t => t.state != "stop").map(t => ({ ...t, taskCategory: taskCategoryDic.get(t.taskId)}));
   }

    const handleTask = (target: TaskCategoryObject) => {
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

    const getTaskCategories = () => {
        return taskCategories;
    }

    const getTaskQueue = () => {
        return taskQueue;
    }

    return {
        taskCategoryDic,
        getSelecter,
        getParentsArray,
        hasChild,
        handleStartTask,
        handleStopTask,
        handleCancelTask,
        handleTask,
        getCurrentTask,
        getCurrentMeasurementTask,
        getTaskQueue,
        getTaskCategories,
        getTaskStates,
    }
}