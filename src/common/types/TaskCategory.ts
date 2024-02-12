export type TaskCategoryObject = {
    id: string,
    parentId: string,
    text: string,
}

export type TaskCategoryDicitonary = Map<string, TaskCategoryObject>;