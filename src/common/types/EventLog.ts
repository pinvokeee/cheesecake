export type EventLog = {
    dateTime: number,
    taskId: string,
    taskName: string,
    queId: string,
    state: "start" | "stop" | "pause" | "restart",
}