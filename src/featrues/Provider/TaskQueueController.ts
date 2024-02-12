import { TaskQueueObject, TaskState } from "../../common/types/TaskQueObject";
import { TaskCategoryObject } from "../../common/types/TaskCategory";
import { AppCommonConfig } from "../../common/types/appConfig";
import { keys } from "../../common/keys";
import { TaskQueueDicitonary } from "../../common/types/TaskQueueDicitonary";

export type TaskControlResult = {
    newQueue: TaskQueueDicitonary,
    startTask?: TaskQueueObject,
    pauseTask?: TaskQueueObject,
}

export class TaskQueueController {
    
    onChangeTaskState: (target: TaskQueueObject, state: TaskState) => void;

    constructor (onChangeTaskState: (target: TaskQueueObject, state: TaskState) => void) {
        this.onChangeTaskState = onChangeTaskState;
    }

    private getNowTime() {
        return (new Date()).getTime();
    }

    //開始
    private startTask(task: TaskCategoryObject, taskQue: TaskQueueDicitonary) {

        const newId = crypto.randomUUID();
        const state: TaskState = "start";

        const newQueue = taskQue.set(newId, {
            taskId: task.id,
            queId: newId,
            state,
            startTime: this.getNowTime(),
            endTime: undefined,
            countSeconds: 0,
        });

        this.onChangeTaskState?.call(this, newQueue.get(newId) as TaskQueueObject, state);

        return newQueue.get(newId);
    }

    //終了
    private stopTask(queObjId: string, taskQue: TaskQueueDicitonary) {

        const endTime = this.getNowTime();
        const queObj = taskQue.get(queObjId);
        const state: TaskState = "stop";

        if (queObj) {

            taskQue.set(queObj.queId, {
                ...queObj,
                state,
                endTime,
                countSeconds: queObj.countSeconds + (endTime - (queObj.startTime ?? 0)),
            });

            this.onChangeTaskState?.call(this, taskQue.get(queObj.queId) as TaskQueueObject, state);
        }

        return taskQue.get(queObjId);
    }

    //一時停止
    private pauseTask(queObjId: string, taskQue: TaskQueueDicitonary) {

        const endTime = this.getNowTime();
        const queObj = taskQue.get(queObjId);
        const state: TaskState = "pause";

        if (queObj) {

            taskQue.set(queObj.queId, {
                ...queObj,
                state,
                endTime,
                countSeconds: queObj.countSeconds + (endTime - (queObj.startTime ?? 0)),
            });

            this.onChangeTaskState?.call(this, taskQue.get(queObj.queId) as TaskQueueObject, state);
        }

        return taskQue.get(queObjId);
    }

    //再開    
    private restartTask(queObjId: string, taskQue: TaskQueueDicitonary) {

        const queObj = taskQue.get(queObjId);
        const state: TaskState = "start";

        if (queObj) {

            taskQue.set(queObj.queId, {
                ...queObj,
                state,
                startTime: this.getNowTime(),
                endTime: undefined, 
                countSeconds: queObj.countSeconds,
            });

            this.onChangeTaskState?.call(this, taskQue.get(queObj.queId) as TaskQueueObject, state);
        }

        return taskQue.get(queObjId);
    }

    //キャンセル
    private cancelTask(queObjId: string, taskQue: TaskQueueDicitonary) {

        const endTime = this.getNowTime();
        const queObj = taskQue.get(queObjId);
        const state: TaskState = "cancel";

        if (queObj) {

            taskQue.set(queObj.queId, {
                ...queObj,
                state,
                endTime,
                countSeconds: queObj.countSeconds + (endTime - (queObj.startTime ?? 0)),
            });

            this.onChangeTaskState?.call(this, taskQue.get(queObj.queId) as TaskQueueObject, state);
        }

        return taskQue.get(queObjId);
    }

    shouldConfrimStartTask(task: TaskCategoryObject, taskLog: TaskQueueDicitonary[], taskItems: TaskCategoryObject[]) {
    }

    getMovementTask(queue: TaskQueueDicitonary) {
        return Array.from(queue.values()).find(t => t.state == "start");
    }

    //タスクの状態を変更する処理
    handleTask(queId: string | undefined, taskId: string, queue: TaskQueueDicitonary, taskCategories: TaskCategoryObject[]): TaskQueueDicitonary {

        //タスクキューのコピー
        const newQueue = new TaskQueueDicitonary(queue);

        //進行中タスクを取得
        const currentMovementTask = this.getMovementTask(newQueue);

        //実行予定のタスクと進行中タスクが不一致なら一旦保留に変更
        if (currentMovementTask && currentMovementTask.taskId != taskId) {
            this.pauseTask(currentMovementTask.queId, newQueue);
        }
        
        //キューIDが指定されていたら
        if (queId) {

            //キューオブジェクトを取得する
            const queObj = newQueue.get(queId);
            
            //進行中なら保留に変更
            if (queObj && queObj.state == "start") {
                this.pauseTask(queId, newQueue);
            }

            //保留なら進行中に変更
            if (queObj && queObj.state == "pause") {
                this.restartTask(queId, newQueue);
            }
        }
        else {

            //タスクIDと一致するキューオブジェクトを探索
            const queObj = Array.from(newQueue.values()).find(t => t.taskId == taskId && t.state != "stop");

            //上記があれば = 新規タスクを開始したつもりがそれがすでに進行中なのであれば、そのキューで処理をしておく
            if (queObj) {

                //見つかったキューオブジェクトで改めて再帰実行
                return this.handleTask(queObj.queId, queObj.taskId, newQueue, taskCategories);
            }
            else {

                //なければタスク情報を取得
                const task = taskCategories.find(t => t.id == taskId);

                //タスク情報が見つかればそれを開始
                if (task) {
                    this.startTask(task, newQueue);
                }
            }
        }
        
        //状態の保存
        this.saveTaskQueue(newQueue);

        return newQueue;
    }

    handleStopTask(queId: string, queue: TaskQueueDicitonary): TaskQueueDicitonary {
        
        //タスクキューのコピー
        const newQueue = new TaskQueueDicitonary(queue);
        const queObject = newQueue.get(queId);
        
        if (queObject) {

            this.stopTask(queId, newQueue);

            //状態の保存
            this.saveTaskQueue(newQueue);
        }

        return newQueue;
    }


    handleCancelTask(queId: string, queue: TaskQueueDicitonary): TaskQueueDicitonary {

        //タスクキューのコピー
        const newQueue = new TaskQueueDicitonary(queue);
        const queObject = newQueue.get(queId);
        
        if (queObject) {

            this.cancelTask(queId, newQueue);

            //状態の保存
            this.saveTaskQueue(newQueue);
        }

        return newQueue;
    }

    getTaskCategoryItems() {
        return new Promise<TaskCategoryObject[]>((resolve, reject) => {
            
            chrome.storage.local.get(keys.commonConfig, (value: any) => {
                const a: AppCommonConfig =  { ...value[keys.commonConfig] };
                resolve(a.taskItems);
            });
        });
    }

    loadTaskQueue() {

        return new Promise<TaskQueueDicitonary>((resolve, reject) => {
            chrome.storage.local.get(keys.taskQue, (value: any) => {

                const data = value[keys.taskQue];

                if (!data) {
                    resolve(new TaskQueueDicitonary());
                    return;
                }

                const a: TaskQueueDicitonary = new TaskQueueDicitonary(JSON.parse(data));
                resolve(a);
            });
        });
    }

    saveTaskQueue(q: TaskQueueDicitonary) {
        chrome.storage.local.set({ [keys.taskQue]: JSON.stringify(Array.from(q)) });
        // chrome.storage.local.set({ [keys.taskQue]: JSON.stringify(queue) });
    }
}