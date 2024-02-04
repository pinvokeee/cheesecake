import { useEffect, useState } from "react"
import { keys } from "../../keys";
import { AppCommonConfig } from "../../../common/types/appConfig";

export const useTask = () => {

    const [aa, setAa] = useState<AppCommonConfig>();
    const taskItems = aa?.taskItems.filter((node) => node.parentId == "");

    useEffect(() => {
        chrome.storage.local.get(keys.commonConfig, (value: any) => setAa({ ...value.AppCommonConfig }));
    }, []);

    const handleTask = () => {

    }

    return {
        taskItems,
    }
}