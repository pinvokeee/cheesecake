import './Flow.css';
import { Box, Button } from "@mui/material";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import ReactFlow, { useNodesState, useEdgesState, ReactFlowProvider, Controls, Background, useReactFlow, Node, Edge, useNodesInitialized, MarkerType, useStore, useStoreApi, Handle, Position } from "reactflow";
import { NodeNewButton } from "./NodeNewButton";
import { Card, cardRect } from './Card';
import './Card.css';
import { HierarchyNode } from '../../../common/types/hierarchyNode';
import { TaskItem } from '../../../common/types/TaskItem';

// const data : TaskNode[] = [ 
//     {
//         "id": "c6efcbca-1261-4992-b882-8484643c393d",
//         "parentId": "",
//         "text": "北海道"
//     },
//     {
//         "id": "d0a52a49-835f-47c8-aa01-62fe95c070e2",
//         "parentId": "c6efcbca-1261-4992-b882-8484643c393d",
//         "text": "札幌市"
//     },
//     {
//         "id": "76fb44c4-f9d5-4d65-ac27-93d0018d86db",
//         "parentId": "d0a52a49-835f-47c8-aa01-62fe95c070e2",
//         "text": "中央区"
//     },
//     {
//         "id": "2a58712e-91aa-4a6a-85bc-6399ff3aa257",
//         "parentId": "76fb44c4-f9d5-4d65-ac27-93d0018d86db",
//         "text": "旭ケ丘"
//     },
//     {
//         "id": "d42e9e8f-ed8a-4fef-862c-5b10ba747e9f",
//         "parentId": "2a58712e-91aa-4a6a-85bc-6399ff3aa257",
//         "text": "1丁目"
//     },
//     {
//         "id": "f53e5e01-1737-428f-9a76-2e7bae008d86",
//         "parentId": "d42e9e8f-ed8a-4fef-862c-5b10ba747e9f",
//         "text": "1-14"
//     },
//     {
//         "id": "902ef9d6-4047-42cb-970b-2806f9357c27",
//         "parentId": "d42e9e8f-ed8a-4fef-862c-5b10ba747e9f",
//         "text": "2-26"
//     },
//     {
//         "id": "647fd99b-e787-4241-9a78-2b80846d836c",
//         "parentId": "76fb44c4-f9d5-4d65-ac27-93d0018d86db",
//         "text": "大通西"
//     },
//     {
//         "id": "d06be6df-c6f3-4d2c-a80a-dc010e867af5",
//         "parentId": "d0a52a49-835f-47c8-aa01-62fe95c070e2",
//         "text": "北区"
//     },
//     {
//         "id": "ef7ffc67-35a5-457e-b1c6-21682d52144d",
//         "parentId": "d06be6df-c6f3-4d2c-a80a-dc010e867af5",
//         "text": "北39条西"
//     },
//     {
//         "id": "69626c31-1108-422f-8332-2562a358c2a7",
//         "parentId": "d06be6df-c6f3-4d2c-a80a-dc010e867af5",
//         "text": "北40条西"
//     },
//     {
//         "id": "6b11c999-2233-4c14-a4c7-2fafa0c0323b",
//         "parentId": "c6efcbca-1261-4992-b882-8484643c393d",
//         "text": "A1-2"
//     },
//     {
//         "id": "60524bd7-56ca-4a75-b72a-09ca0f76a56d",
//         "parentId": "6b11c999-2233-4c14-a4c7-2fafa0c0323b",
//         "text": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2A1AAAAAAAAAAAAAAAAAAAAAAAAAA2A1-2-1"
//     },
//     {
//         "id": "cda24004-b198-42b8-ad1e-bb1c5cadefd8",
//         "parentId": "",
//         "text": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2"
//     },
//     {
//         "id": "48d80f68-ff1f-4d47-91ea-15cec1dfbd3a",
//         "parentId": "",
//         "text": "testbbb"
//     },
//     {
//         "id": "e8582ab5-8a63-4fbc-b4ee-7080354e2124",
//         "parentId": "48d80f68-ff1f-4d47-91ea-15cec1dfbd3a",
//         "text": "testbbbchildaaaa"
//     },
//     {
//         "id": "07bdd73a-c548-4eb2-9628-e9098756a6ea",
//         "parentId": "48d80f68-ff1f-4d47-91ea-15cec1dfbd3a",
//         "text": "testbbbchildbbbb"
//     },
//     {
//         "id": "424f758f-077a-418f-86c3-edd292948467",
//         "parentId": "",
//         "text": "test1"
//     },
//     {
//         "id": "e93d2167-9238-4966-a3f3-4d15dd6ba2e4",
//         "parentId": "424f758f-077a-418f-86c3-edd292948467",
//         "text": "test2"
//     },
//     {
//         "id": "26e62364-458e-45c3-8131-874e29389404",
//         "parentId": "e93d2167-9238-4966-a3f3-4d15dd6ba2e4",
//         "text": "test3"
//     },
//     {
//         "id": "8216921b-6afa-4b7c-8138-913a3274cf22",
//         "parentId": "26e62364-458e-45c3-8131-874e29389404",
//         "text": "test4"
//     },
//     {
//         "id": "ca50c355-1c7b-4687-975b-4cceaca5e4c0",
//         "parentId": "8216921b-6afa-4b7c-8138-913a3274cf22",
//         "text": "test5-1"
//     },
//     {
//         "id": "45249453-fa3c-4a37-9bfa-158c3ed8b593",
//         "parentId": "8216921b-6afa-4b7c-8138-913a3274cf22",
//         "text": "test5-2"
//     },
//     {
//         "id": "83fbedba-a371-46db-8470-eaa46e99f1c1",
//         "parentId": "8216921b-6afa-4b7c-8138-913a3274cf22",
//         "text": "test5-3"
//     },
//     {
//         "id": "7c849b45-d6df-49b2-a984-be88cfc3f9fc",
//         "parentId": "8216921b-6afa-4b7c-8138-913a3274cf22",
//         "text": "test5-4"
//     },
//     {
//         "id": "d92378a6-d4c8-4960-a441-50bf3d103d56",
//         "parentId": "26e62364-458e-45c3-8131-874e29389404",
//         "text": "test4-2"
//     },
//     {
//         "id": "07c61ff5-c090-4449-99fd-84ecff7f3500",
//         "parentId": "e93d2167-9238-4966-a3f3-4d15dd6ba2e4",
//         "text": "test6"
//     },
//     {
//         "id": "c65dbdad-e2d3-4006-810b-5a700df69ee3",
//         "parentId": "07c61ff5-c090-4449-99fd-84ecff7f3500",
//         "text": "test7"
//     },
//     {
//         "id": "f190b1cb-f232-4caa-ac67-4c3e649b86f0",
//         "parentId": "c65dbdad-e2d3-4006-810b-5a700df69ee3",
//         "text": "test7-1"
//     },
//     {
//         "id": "41c33532-008c-4188-ab62-1f115a643f71",
//         "parentId": "c65dbdad-e2d3-4006-810b-5a700df69ee3",
//         "text": "test7-2"
//     },
//     {
//         "id": "e5d0cc4b-02e9-4750-8525-455d1392a17d",
//         "parentId": "07c61ff5-c090-4449-99fd-84ecff7f3500",
//         "text": "test8aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
//     },
//     {
//         "id": "7c6daf43-cf21-40d8-b179-489a3373dfdc",
//         "parentId": "e5d0cc4b-02e9-4750-8525-455d1392a17d",
//         "text": "test8-1"
//     }
// ]

const data : TaskItem[] = [
    {
        "id": "a1b2c3d4-e5f6-g7h8-i9j0k1l2m3n4",
        "parentId": "",
        "text": "コールセンターの管理者"
    },
    {
        "id": "b5c6d7e8-f9g0-h1i2-j3k4l5m6n7o8",
        "parentId": "a1b2c3d4-e5f6-g7h8-i9j0k1l2m3n4",
        "text": "オペレーション管理"
    },
    {
        "id": "c9d0e1f2-g3h4-i5j6-k7l8m9n0o1",
        "parentId": "b5c6d7e8-f9g0-h1i2-j3k4l5m6n7o8",
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
        "parentId": "b5c6d7e8-f9g0-h1i2-j3k4l5m6n7o8",
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
        "parentId": "b5c6d7e8-f9g0-h1i2-j3k4l5m6n7o8",
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

export type NodeDictionary = Map<string, NodeInfo>;

export type NodeInfo = {
    id: string,
    text: string,
    parentId: string,
    x: number,
    y: number,
    width: number,
    height: number,
    childIdList: string[],
    childrenWidth?: number,
    // nest: number,
}

const nodeTypes = {
    new : NodeNewButton,
    card: Card,
}

const textBoxId = `test_${crypto.randomUUID()}`;

const getCardBoundingBox = (text: string, css: string) => {

    let div = document.getElementById(textBoxId);

    if (!div) {
        div = document.createElement("div");
        div.id = textBoxId;
        div.className = css;
        div.style.position = "absolute";
        div.style.top = "-100px";
        div.style.visibility = "hidden";
        document.body.appendChild(div);
    }

    div.innerText = text;

    const boundingBox = div.getBoundingClientRect();

    div.style.top = `${-boundingBox.height}px`;

    return boundingBox;
}

export const Flow = (props: { nodes: HierarchyNode[], onAppendNodeClick?: (id: string) => void }) => {

    return (
        <ReactFlowProvider>
            <FlowInner nodes={props.nodes} onAppendNodeClick={props.onAppendNodeClick}></FlowInner>
        </ReactFlowProvider>
    )
}

const FlowInner = (props: { nodes: HierarchyNode[], onAppendNodeClick?: (id: string) => void }) => {

    const baseNodes = props.nodes;
    const [flowNodes, setNodes, onNodesChange] = useNodesState([]);
    const [flowEdges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {

        const { nodes, edges } = generateNodesAndEdges(baseNodes);
        setNodes(nodes);
        setEdges(edges);

    }, [props.nodes]);

    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        // console.log(node);
    }

    return (
        <ReactFlow 
        nodesDraggable={false} 
        nodes={flowNodes} 
        edges={flowEdges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}>
            {/* <AutoLayout/> */}
            <Controls />
            <Background />
        </ReactFlow>
    )
}

// const toMap = (targetNodes: HierarchyNode[]) => {

const toMap = (sourceNodes: TaskItem[]) => {
    
    const nodeInfo : [string, NodeInfo][] = sourceNodes.map(node => {

        const { id, parentId, text } = node;
        const { width, height } = getCardBoundingBox(text, "NodeCard");
        const childIdList = sourceNodes.filter(n => node.id == n.parentId).map(n => n.id);
        const x = 0, y = 0;

        return [id, {
            id, parentId, text, childIdList, x, y, width, height,
        }]
    });

    return new Map(nodeInfo);
}

const createNodes = (nodes: NodeDictionary) => {

    const topNodes = Array.from(nodes).filter(([key, node]) => node.parentId == "").map(([key, node]) => node);
    
    layoutAllNodes(topNodes, nodes);

    const layoutNodes: Node[] = [];
    const layoutEdges: Edge[] = [];

    for (const [key, n] of nodes) {

        const {id, x, y, width, childrenWidth, text, childIdList} = n;

        layoutNodes.push({
            id,
            type: "card",
            position: { x: x, y: y },
            data: { label: text },
        });

        if (n.parentId != "") {
            layoutEdges.push({
                id: crypto.randomUUID(),
                source: n.parentId,
                target: n.id, 
                type: 'smoothstep',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                },
            });
        }
    }

    return {
        nodes: layoutNodes,
        edges: layoutEdges
    }
    
}

const getNodeX = (base: number, targetNode: NodeInfo, dic: NodeDictionary) => {

    if (targetNode.childIdList.length == 0) return base;

    const first = dic.get(targetNode.childIdList[0]);
    const last = dic.get(targetNode.childIdList[targetNode.childIdList.length - 1]);

    if (first && last) {
        if (first.id == last.id) return first.x;
        const a =  (((last.x + last.width) - first.x) / 2 - (targetNode.width / 2));
        return first.x + a;
    }

    return 0;
}

const layoutAllNodes = (targetNodes: NodeInfo[], nodeDic: NodeDictionary) => {
    
    const gapLeft = 24;
    const heights : number[] = getHeightArray(nodeDic);
    const ypos : number[] = getRowYPosition(heights, 4, 64);

    const f = (id: string, basex: number, yPositionArray: number[], nest: number) => {

        const node = nodeDic.get(id);

        if (!node) return 0;
        if (node.childIdList.length == 0) return node.width + gapLeft;

        let newWidth = 0;

        for (const childId of node.childIdList) {
            
            const child = nodeDic.get(childId);

            if (child) {

                const cw = f(childId, basex + newWidth, ypos, nest + 1);
                child.x = getNodeX(basex + newWidth, child, nodeDic);
                child.y = ypos[nest];

                newWidth += cw;
            }
        }

        return newWidth;
    }

    let px = 0;
    for (const n of targetNodes) {
        const nx = px + f(n.id, px, ypos, 1);
        n.x = getNodeX(px, n, nodeDic);
        n.y = ypos[0];
        px = nx;
    }
}

/**
 * 行ごとの高さを配列で取得する
 * @param nodes 
 * @returns 
 */
const getHeightArray = (nodes: NodeDictionary) => {

    //行の高さを保存する配列
    const rowHeights: number[] = [];

    //ネスト = 現在行
    //再帰呼び出し用の関数
    const f = (node: NodeInfo, nest: number) => {
 
        //保存している現在行の高さが新しい値のほうが高ければ代入、低ければ保持、値が存在しなければ新しい値を代入
        rowHeights[nest] = rowHeights[nest] ? (node.height > rowHeights[nest] ? node.height : rowHeights[nest]) : node.height;

        //子のIDの数だけループ
        for (const id of node.childIdList) {
            //IDからノード本体を取得
            const n = nodes.get(id);
            //ネストを深くして再帰
            if (n) f(n, nest + 1);
        }
    }

    const n = Array.from(nodes.values()).filter(node => node.parentId == "");
    for (const node of n) f(node, 0);

    return rowHeights;
}

/**
 * 行ごとのY座標を配列で取得する
 * @param nodes 
 * @returns 
 */
const getRowYPosition = (heightArray: number[], margin: number, padding: number) => {

    const widthArray = heightArray.map(y => y + padding);
    return [margin, ...widthArray.map((h, index) => widthArray.slice(0, index + 1).reduce((s, v) => s + v, margin))];
}

const generateNodesAndEdges = (targetNodes: HierarchyNode[]) => {

    const nodeDic = toMap(data);
    const { nodes, edges } = createNodes(nodeDic); 
    return { nodes, edges };
}
