import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { TaskView } from './featrues/TaskView/TaskView'
import { HierarchyNode } from './common/types/hierarchyNode'
import { AppCommonConfig } from './common/types/appConfig'
import { keys } from './common/keys'
import { TaskCategoryObject } from './common/types/TaskCategory'

const data : TaskCategoryObject[] = [
    {
        "id": "c9d0e1f2-g3h4-i5j6-k7l8m9n0o1",
        "parentId": "",
        "text": "キュー管理"
    },
    {
        "id": "d2e3f4g5-h6i7-j8k9l0m1n2o3",
        "parentId": "c9d0e1f2-g3h4-i5j6-k7l8m9n0o1",
        "text": "待機時間最適化"
    },
    {
        "id": "e4f5g6h7-i8j9-k0l1m2n3o4",
        "parentId": "d2e3f4g5-h6i7-j8k9l0m1n2o3",
        "text": "オペレーター配置"
    },
    {
        "id": "f6g7h8i9-j0k1l2-m3n4o5",
        "parentId": "e4f5g6h7-i8j9-k0l1m2n3o4",
        "text": "シフト管理"
    },
    {
        "id": "g9h0i1j2-k3l4-m5n6o7",
        "parentId": "e4f5g6h7-i8j9-k0l1m2n3o4",
        "text": "トレーニングプログラム"
    },
    {
        "id": "h2i3j4-k5l6-m7n8o9",
        "parentId": "",
        "text": "顧客対応管理"
    },
    {
        "id": "i4j5k6-l7m8-n9o0",
        "parentId": "h2i3j4-k5l6-m7n8o9",
        "text": "クレーム処理"
    },
    {
        "id": "j7k8l9-m0n1-o2",
        "parentId": "h2i3j4-k5l6-m7n8o9",
        "text": "問い合わせ対応"
    },
    {
        "id": "k2l3-m4n5-o6",
        "parentId": "j7k8l9-m0n1-o2",
        "text": "電話対応トレーニング"
    },
    {
        "id": "l6m7-n8o9",
        "parentId": "j7k8l9-m0n1-o2",
        "text": "チャットサポート"
    },
    {
        "id": "nop012",
        "parentId": "",
        "text": "テクノロジー管理"
    },
    {
        "id": "qrs345",
        "parentId": "nop012",
        "text": "自動応答システム"
    },
    {
        "id": "tuv678",
        "parentId": "nop012",
        "text": "顧客データ分析"
    },
    {
        "id": "wxy901",
        "parentId": "qrs345",
        "text": "音声認識技術"
    },
    {
        "id": "zab234",
        "parentId": "qrs345",
        "text": "チャットボット開発"
    }
]
;

function App() {

    const config : AppCommonConfig = {
        kintoneSetting: {
            host: "",
            apiKey: "",
            appId: ""
        },
        provider: 'kintone',
        taskItems: [...data],
    }

    chrome.storage.local.set({
        [keys.commonConfig]: { ...config }
    });

    return (
        <div className="App">
            <TaskView></TaskView>
        </div>
    )
}

export default App
