export type TaskState = "start" | "stop" | "pause" | "cancel";

export type TaskQueueObject = {
    queId: string,
    taskId: string,
    state: TaskState,
    startTime: number | undefined,
    endTime: number | undefined,
    countSeconds: number,
}