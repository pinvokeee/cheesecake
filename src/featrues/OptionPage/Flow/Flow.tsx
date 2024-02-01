import './Flow.css';
import { Box, Button } from "@mui/material";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import ReactFlow, { useNodesState, useEdgesState, ReactFlowProvider, Controls, Background, useReactFlow, Node, Edge, useNodesInitialized, MarkerType, useStore, useStoreApi, Handle, Position } from "reactflow";
import { NodeNewButton } from "./NodeNewButton";
import { Card, cardRect } from './Card';
import './Card.css';

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
    nest: number,
}

const nodeTypes = {
    new : NodeNewButton,
    card: Card,
}

const textBoxId = `test_${crypto.randomUUID()}`;

const getBBox = (text: string, css: string) => {

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


// const createNodeInfo = (arr: HierarchyNode[], parentNode?: HierarchyNode) => {

//     const result: Map<string, NodeInfo> = new Map();

//     arr.forEach(node => {

//         const rect = getBBox(node.data, flowCardTextCss);

//         result.set(node.id, 
//             {
//                 text: node.data,
//                 id: node.id,
//                 parentId: parentNode?.id ?? "",
//                 width: rect.width,
//                 height: rect.height,
//                 childIdList: [],
//             });

//         if (node.children) createNodeInfo(node.children, node).forEach(n => result.set(n.id, n));
//     });

//     return result;
// }

const FlowInner = (props: { nodes: HierarchyNode[], onAppendNodeClick?: (id: string) => void }) => {

    const baseNodes = props.nodes;
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {

        // const aa = createNodeInfo(baseNodes);
        const gen = generateNodesAndEdges(baseNodes);

        // const aa = baseNodes.flatMap(node => node.children.flat());

        // console.log(aa);

        // const nodes = createHierarchyNodeNewButton([ ...props.nodes ]);
        // const { initNodes, initEdges } = createNodesAndEdges([ ...props.nodes ], props.onAppendNodeClick);

        setNodes(gen.nodes);
        setEdges(gen.edges);

    }, [props.nodes]);

    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        // console.log(node);
    }

    return (
        <ReactFlow 
        nodesDraggable={false} 
        nodes={nodes} 
        edges={edges} 
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

const toMap = (targetNodes: HierarchyNode[]) => {

    const nodes : NodeDictionary = new Map();

    //ネスト = 現在行
    //再帰呼び出し用の関数
    const f = (node: HierarchyNode, nest: number, parentNode: HierarchyNode | undefined = undefined) => {

        const { width, height } = getBBox(node.data, "NodeCard");

        nodes.set(node.id, {
            id: node.id, 
            parentId: parentNode?.id ?? "",
            text: node.data,
            childIdList: node.children.map(node => node.id),
            x: 0, 
            y: 0,
            width,
            height,
            nest,
        })

        for (const child of node.children) {
            f(child, nest + 1, node);
        }
    };

    let nest = 0; 

    for (const n of targetNodes) {
        f(n, nest);
    }

    return nodes;
}

const getChildNodesFromTopNode = (topNode: NodeInfo, nodes: NodeDictionary) => {
    return getChildNodes(topNode.childIdList, nodes);
}

const layoutAllNodes = (targetNodes: NodeInfo[], nodeDic: NodeDictionary) => {

    // const gapLeft = 8;
    const heights : number[] = getHeightArray(nodeDic);
    const ypos : number[] = getRowYPosition(heights, 4, 64);
    const layoutNodes: Node[] = [];
    const layoutEdges: Edge[] = [];

    console.log(ypos);

    const f = (id: string, beginX: number, yPositionArray: number[]) => {

        const node = nodeDic.get(id);
        if (!node) return 0;

        let w = beginX;
        
        // node.x = beginX;

        // const width = node.childIdList.map(id => nodeDic.get(id)?.width ?? 0).reduce((s, v) => s + v, 0);

        if (node.childIdList.length == 0) return node.width;

        let xx = 0;

        for (const childId of node.childIdList) {
            
            const child = nodeDic.get(childId);

            if (child) {
                console.log("A", child.text);
                const cw = f(childId, beginX + xx, ypos);
                const pw = (xx); 
                child.x = beginX + xx;
                xx += cw;
            }
        }

        if (node.childIdList.length > 0) {
            console.log("B", node.text);
            const lastChildId = node.childIdList[node.childIdList.length - 1];
            const lastChild = nodeDic.get(lastChildId);

            const first = nodeDic.get(node.childIdList[0]);
            const last = nodeDic.get(node.childIdList[node.childIdList.length - 1]);
            
            if (first && last) {

                if (first.id == last.id) {
                    node.childrenWidth = xx - (last?.width ?? 0);
                }
                else {
                    node.childrenWidth = xx - (last?.width ?? 0);
                }
            }
        }
        else {
            node.childrenWidth = node.width;
        }

        return xx;
    }

    let px = 0;

    for (const n of targetNodes) {
        // console.log(px);
        n.x = px;
        px += f(n.id, px, ypos);
    }

    for (const [key, n] of nodeDic) {

        const {id, nest, x, y, width, childrenWidth, text, childIdList} = n;
        const centerX = (x + (((childrenWidth ?? 0) / 2)));
        // const centerX = x;
        console.log(n, childrenWidth);
        
        layoutNodes.push({
            id,
            type: "card",
            position: { x: centerX, y: ypos[nest] },
            data: { label: text },
        });

        if (n.parentId != "") {
            layoutEdges.push({
                id: crypto.randomUUID(),
                source: n.parentId,
                target: n.id,    
            })
        }
    }

    console.log(nodeDic);

    return {
        nodes: layoutNodes,
        edges: layoutEdges
    }
}

/**
 * 与えたノード配列の子ノードをすべて取得する
 * @param topNode 
 * @param nodes 
 * @returns 
 */
const getChildNodes = (nodeIds: string[], nodes: NodeDictionary, nest: number = 0, columnIndex: number = 0) => {

    const childrenIds : { node: NodeInfo, column: number, columnIndex: number, nest: number }[] = [];

    let column = 0;

    for (const id of nodeIds) {

        const node = nodes.get(id);

        if (node) {

            childrenIds.push( { node, column, columnIndex, nest } );
            childrenIds.push(...getChildNodes(node.childIdList, nodes, nest + 1, columnIndex + 1));
        }

        column++;
    }

    return childrenIds;
}


/**
 * 行ごとのY座標を配列で取得する
 * @param nodes 
 * @returns 
 */
const getRowYPosition = (heightArray: number[], margin: number, padding: number) => {

    const widthArray = heightArray.map(y => y + padding);
    console.log(widthArray);
    return [margin, ...widthArray.map((h, index) => widthArray.slice(0, index + 1).reduce((s, v) => s + v, margin))];
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
            
            //IDからノードの実態を取得
            const n = nodes.get(id);

            //ネストを深くして再帰
            if (n) f(n, nest + 1);
        }
    }

    const n = Array.from(nodes);
    for (const [key, node] of n) {
        f(node, 0);
    }

    return rowHeights;
}


const generateNodesAndEdges = (targetNodes: HierarchyNode[]) => {

    // const nodes : Node[] = [];
    // const edges : Edge[] = [];

    const nodeDic = toMap(targetNodes);
    const topNodes = Array.from(nodeDic).filter(([key, node]) => node.parentId == "");

    const { nodes, edges } = layoutAllNodes(topNodes.map(([id, node]) => node), nodeDic);

    // nodes.push(...layoutAllNodes(topNodes.map(([id, node]) => node), nodeDic));

    // const x = 0;
    // const y = 0;

    // console.log(heights);

    // const a = (targetIds: string[], baseX: number = 0) => {

    //     let x = baseX;

    //     for (const id of targetIds) {

    //         const node = map.get(id);

    //         if (node) {

    //             const children = getChildNodesFromTopNode(node, map);
    //             console.log(targetIds);
    //             const w = children.reduce((val, nodeSet) => val + nodeSet.node.width, 0);
                
    //             const cx = x + (w / 2 - node.width / 2);
    //             const cy = heights.slice(0, node.nest).reduce((sum, val) => sum + val, 0)

    //             nodes.push({
    //                 id,
    //                 type: "card",
    //                 position: { x: cx , y: cy },
    //                 data: { label: x },
    //             });

    //             a(node.childIdList, x);

    //             x += node.width + w;
    //         }
    //     }    
    // }

    // a(topNodes.map(([id, node]) => id));

    //     const children = getChildNodes(node, map, 0);   
    //     const w = children.reduce((val, nodeSet) => val + nodeSet.node.width, 0);
    //     const cx = w / 2 - node.width / 2;

    //     nodes.push({
    //         id,
    //         type: "card",
    //         position: { x: cx , y: 0 },
    //         data: { label: node.text },
    //     });

    //     console.log(children);
    // }

    return {
        nodes,
        edges
    };
}
