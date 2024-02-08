import { TaskItem } from "./TaskItem"

export type AppCommonConfig = {

    provider: "local" | "kintone",

    kintoneSetting: {
        host: string,
        appId: string,
        apiKey: string,
    }

    taskItems: TaskItem[],
}

export type AppUserConfig = {
    name: string,
    uuid: string,
}