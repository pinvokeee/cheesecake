import { TaskNode } from "./TaskNode"

export type AppCommonConfig = {

    provider: "local" | "kintone",

    kintoneSetting: {
        host: string,
        appId: string,
        apiKey: string,
    }

    taskItems: TaskNode[],
}

export type AppUserConfig = {
    name: string,
    uuid: string,
}