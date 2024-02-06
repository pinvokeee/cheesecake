export type MeasurementTask = {
    taskId: string,
    start: number | undefined,
    end: number | undefined,
    count: number,
    state: "start" | "stop" | "pause",
}