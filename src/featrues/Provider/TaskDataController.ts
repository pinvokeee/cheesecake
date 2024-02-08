import { TaskQueObject } from "../../common/types/MeasurementTask";
import { TaskItem } from "../../common/types/TaskItem";
import { AppCommonConfig } from "../../common/types/appConfig";
import { keys } from "../../common/keys";

export class TaskDataController {
    
    constructor () {

    }

    getNowTime() {
        return (new Date()).getTime();
    }

    registTaskState(task: TaskQueObject, taskQue: TaskQueObject[]) {
        if (!taskQue.find((_) => _.queId != task.queId)) return [...taskQue, task];
        return taskQue.map(pre => pre.queId != task.queId ? task : pre);
    }

    //開始
    startTask(task: TaskItem, taskQue: TaskQueObject[]) {

        const newId = crypto.randomUUID();

        return {
            que: this.registTaskState({
                queId: newId,
                taskId: task.id,
                state: "start", 
                time: {
                    start: this.getNowTime(),
                    end: undefined,
                    minutes: 0,
                },}, taskQue),
            
            startQueId: newId,
        }
    }

    //終了
    endTask(task: TaskQueObject, taskQue: TaskQueObject[]) {

        const end = this.getNowTime();

        return this.registTaskState(
            {...task, 
                state: "stop",
                time: {
                    start: task.time.start,
                    end,
                    minutes: task.time.minutes + (end - (task.time.start ?? 0)),
                }
            }, 

        taskQue);
    }

    //一時停止
    pauseTask(task: TaskQueObject, taskQue: TaskQueObject[]) {

        const end = this.getNowTime();

        return this.registTaskState(
            {...task, 
                state: "pause",
                time: {
                    start: task.time.start,
                    end,
                    minutes: task.time.minutes + (end - (task.time.start ?? 0)),
                }
            }, 

        taskQue);
    }

    //再開    
    restartTask(task: TaskQueObject, taskQue: TaskQueObject[]) {

        return this.registTaskState(
            {...task, 
                state: "start",
                time: {
                    start: task.time.start,
                    end: undefined,
                    minutes: task.time.minutes,
                }
            }, 

        taskQue);
    }

    shouldConfrimStartTask(task: TaskItem, taskLog: TaskQueObject[], taskItems: TaskItem[]) {
    }

    //タスク終了以外の処理
    handleTask(task: TaskItem | TaskQueObject, taskQue: TaskQueObject[], taskDic: TaskItem[]) {

        //状態の保存
        this.saveTaskLog(taskQue);
        
        // return taskLog;
    }

    // getTask(task: TaskNode, taskLog: MeasurementTask[]) {
    //     if (taskLog.length == 0) return undefined;
    //     const current = taskLog.findLast(t => t.taskId == task.id);
    //     return current;
    // }

    // getCurrentTask(taskLog: MeasurementTask[]) {
    //     if (taskLog.length == 0) return undefined;
    //     const current = taskLog.toReversed()[0];
    //     return current;
    // }

    // getTaskItems() {
    //     return new Promise<TaskNode[]>((resolve, reject) => {
            
    //         chrome.storage.local.get(keys.commonConfig, (value: any) => {
    //             const a: AppCommonConfig =  { ...value[keys.commonConfig] };
    //             resolve(a.taskItems);
    //         });
    //     });
    // }

    getTaskItems() {
        return new Promise<TaskItem[]>((resolve, reject) => {
            
            chrome.storage.local.get(keys.commonConfig, (value: any) => {
                const a: AppCommonConfig =  { ...value[keys.commonConfig] };
                resolve(a.taskItems);
            });
        });
    }

    loadTaskLog() {

        return new Promise<TaskQueObject[]>((resolve, reject) => {
            chrome.storage.local.get(keys.taskQue, (value: any) => {
                const a: TaskQueObject[] =  JSON.parse(value[keys.taskQue]);
                resolve(a);
            });
        });
    }

    saveTaskLog(taskLog: TaskQueObject[]) {
        chrome.storage.local.set({ [keys.taskQue]: JSON.stringify(taskLog) });
        chrome.storage.local.set({ [keys.taskQue]: JSON.stringify(taskLog) });
    }
}