import { TaskCategoryObject } from "./TaskCategory"

export type AppCommonConfig = {

    provider: "local" | "kintone",

    kintoneSetting: {
        host: string,
        appId: string,
        apiKey: string,
    }

    taskItems: TaskCategoryObject[],
}

export type AppUserConfig = {
    name: string,
    uuid: string,
}