import './Flow.css';
import { Box, Button } from "@mui/material";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import ReactFlow, { useNodesState, useEdgesState, ReactFlowProvider, Controls, Background, useReactFlow, Node, Edge, useNodesInitialized, MarkerType, useStore, useStoreApi, Handle, Position } from "reactflow";
import { NodeNewButton } from "./NodeNewButton";
import { Card, cardRect } from './Card';
import './Card.css';

type NodeInfo = {
    id: string,
    text: string,
    parentId: string,
    width: number,
    height: number,
    childIdList: string[],
    familyWidth?: number,
}

const nodeTypes = {
    new : NodeNewButton,
    card: Card,
}

const textBoxId = `test_${crypto.randomUUID()}`;
const flowCardTextCss = "flowCardText";

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


const createNodeInfo = (arr: HierarchyNode[], parentNode?: HierarchyNode) => {

    const result: Map<string, NodeInfo> = new Map();

    arr.forEach(node => {

        const rect = getBBox(node.data, flowCardTextCss);

        result.set(node.id, 
            {
                text: node.data,
                id: node.id,
                parentId: parentNode?.id ?? "",
                width: rect.width,
                height: rect.height,
                childIdList: [],
            });

        if (node.children) createNodeInfo(node.children, node).forEach(n => result.set(n.id, n));
    });

    return result;
}

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
        // setEdges(initEdges);

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

const flattenHiereachyNode = (
    nodes: HierarchyNode[], 
    callback: (node: HierarchyNode, parentNode?: HierarchyNode) => boolean, 
    reduceCallback?: (parentNode?: HierarchyNode) => void,
    parentNode?: HierarchyNode,) => {

    for (const n of nodes) {
        const isNext = callback(n, parentNode);
        if (isNext) flattenHiereachyNode(n.children, callback, reduceCallback, n);
        if (!isNext) break;
    }

    reduceCallback?.call(parentNode);
}

const toMap = (targetNodes: HierarchyNode[]) => {

    const nodes : Map<string, NodeInfo> = new Map();

    flattenHiereachyNode(targetNodes, (node, parentNode) => {

        const { width, height } = getBBox(node.data, "NodeCard");

        nodes.set(node.id, {
            id: node.id, 
            parentId: parentNode?.id ?? "",
            text: node.data,
            childIdList: [],
            width,
            height,
        })

        nodes.get(parentNode?.id ?? "")?.childIdList.push(node.id);

        return true;
    })

    return nodes;
}

/**
 * 与えたノード配下の子ノードをすべて取得する
 * @param topNode 
 * @param nodes 
 * @returns 
 */
const getChildNodes = (topNode: NodeInfo, nodes: Map<string, NodeInfo>, nest: number = 0, columnIndex: number = 0) => {

    const childrenIds : { node: NodeInfo, column: number, columnIndex: number, nest: number }[] = [];

    let column = 0;

    console.log("--" + nest);
    for (const id of topNode.childIdList) {

        const node = nodes.get(id);

        if (node) {
            console.log(node);

            childrenIds.push( { node, column, columnIndex, nest } );
            childrenIds.push(...getChildNodes(node, nodes, nest + 1, columnIndex + 1));
        }

        column++;
    }

    return childrenIds;
}

/**
 * 行ごとの高さを配列で取得する
 * @param nodes 
 * @returns 
 */
const getHeightArray = (nodes: Map<string, NodeInfo>) => {

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

    const nodes : Node[] = [];
    const edges : Edge[] = [];

    const map = toMap(targetNodes);
    const topNodes = Array.from(map).filter(([key, node]) => node.parentId == "");
    const heights : number[] = getHeightArray(map);

    const x = 0;
    const y = 0;

    for (const [id, node] of topNodes) {
        
        const children = getChildNodes(node, map, 0);   
        const w = children.reduce((val, nodeSet) => val + nodeSet.node.width, 0);
        const cx = w / 2 - node.width / 2;

        nodes.push({
            id,
            type: "card",
            position: { x: cx , y: 0 },
            data: { label: node.text },
        });

        console.log(children);
    }

    return {
        nodes,
        edges
    };
}
