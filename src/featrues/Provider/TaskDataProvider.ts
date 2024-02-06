import { MeasurementTask } from "../../common/types/MeasurementTask";
import { TaskNode } from "../../common/types/TaskNode";
import { AppCommonConfig } from "../../common/types/appConfig";
import { keys } from "../keys";

export class TaskDataProvider {

    constructor () {

    }

    startTask(task: TaskNode, taskLog: MeasurementTask[]) {
        console.log(task, taskLog);

        const t: MeasurementTask = {
            taskId: task.id,
            start: new Date().getTime(),
            end: undefined,
            count: 0,
            state: "start",
        }

        taskLog.push(t);

        return t;
    }

    endTask(task: TaskNode, taskLog: MeasurementTask[]) {

        const currentTask = taskLog.findLast(t => task.id == t.taskId);

        if (currentTask) {
            currentTask.end = new Date().getTime();
            currentTask.state = "stop";
            currentTask.count += new Date(currentTask.end).getTime() - new Date(currentTask.start ?? 0).getTime();
        }

        return currentTask;
    }

    pauseTask(task: TaskNode, taskLog: MeasurementTask[]) {

        const currentTask = taskLog.findLast(t => task.id == t.taskId);

        if (currentTask) {
            currentTask.end = new Date().getTime();
            currentTask.state = "pause";
            currentTask.count += new Date(currentTask.end).getTime() - new Date(currentTask.start ?? 0).getTime();
        }

        return currentTask;
    }
    
    restartTask(task: TaskNode, taskLog: MeasurementTask[]) {

        const currentTask = taskLog.findLast(t => task.id == t.taskId);

        if (currentTask) {
            currentTask.start = new Date().getTime();
            currentTask.end = undefined;
            currentTask.state = "start";
        }

        return currentTask;
    }

    //タスク終了以外の処理
    handleTask(task: TaskNode, taskLog: MeasurementTask[], taskItems: TaskNode[]) {

        // const current = this.getTask(task, taskLog);
        const t = this.getCurrentTask(taskLog);
        const current = t ? { ...t } : t;
        
        //現在タスクなし　もしくは　現在タスクが終了済み
        if (!current || current.state == "stop") {
            //選択タスクの開始のみ
            const t = this.startTask(task, taskLog);
        }

        //現在のタスクが一時停止中
        if (current && current.state == "pause") {

            //一時停止中のタスクIDと指定したタスクIDが一致したら再開
            if (current.taskId == task.id) {
                const t = this.restartTask(task, taskLog);
                console.log(task, taskLog);
            }
            else { //そうでなければ別で開始
                const t = this.startTask(task, taskLog);
            }
        }
        
        //現在のタスクが開始済み
        if (current && current.state == "start") {

            //開始済みのタスクIDと指定したタスクIDが一致したら一時停止
            if (current.taskId == task.id) {
                const t = this.pauseTask(task, taskLog);
            }
            else { //そうでなければ現在のタスクを一時停止後、別で開始
                const ts = taskItems.find(tt => tt.id == current.taskId) as TaskNode;
                this.pauseTask(ts, taskLog);
                const t = this.startTask(task, taskLog);
            }
        }

        //状態の保存
        this.saveTaskLog(taskLog);
        
        return taskLog;
    }

    getTask(task: TaskNode, taskLog: MeasurementTask[]) {
        if (taskLog.length == 0) return undefined;
        const current = taskLog.findLast(t => t.taskId == task.id);
        return current;
    }

    getCurrentTask(taskLog: MeasurementTask[]) {
        if (taskLog.length == 0) return undefined;
        const current = taskLog.toReversed()[0];
        return current;
    }

    getTaskItems() {
        return new Promise<TaskNode[]>((resolve, reject) => {
            
            chrome.storage.local.get(keys.commonConfig, (value: any) => {
                const a: AppCommonConfig =  { ...value[keys.commonConfig] };
                resolve(a.taskItems);
            });
        });
    }

    loadTaskLog() {

        return new Promise<MeasurementTask[]>((resolve, reject) => {
            chrome.storage.local.get(keys.logData, (value: any) => {
                const a: MeasurementTask[] =  JSON.parse(value[keys.logData]);
                resolve(a);
            });
        });
    }

    saveTaskLog(taskLog: MeasurementTask[]) {
        chrome.storage.local.set({ [keys.logData]: JSON.stringify(taskLog) });
    }
}