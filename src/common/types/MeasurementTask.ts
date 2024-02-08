export type TaskQueObject = {
    queId: string,
    taskId: string,
    state: "start" | "stop" | "pause",
    time: {
        start: number | undefined,
        end: number | undefined,
        minutes: number,
    },
}