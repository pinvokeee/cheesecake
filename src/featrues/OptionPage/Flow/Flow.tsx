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

const getHeightArray = (nodes: HierarchyNode[]) => {

    let row = 0;
    const heightArray : number[] = [];

    flattenHiereachyNode(nodes, (n: HierarchyNode, parent) => {

        if (!parent) row = 0;

        const rect = getBBox(n.data, "NodeCard");
        n.width = rect.width;
        n.height = rect.height;

        const height = heightArray[row];

        heightArray[row] = height != undefined ? (height > n.height ? height : n.height) : n.height;

        row++;

        return true;
    });

    return heightArray;
}

const getNodeFamilyWidth = (topNode: HierarchyNode) => {

    let width = 0;

    flattenHiereachyNode(topNode.children, (n: HierarchyNode) => {
        width += n.width ?? 0;
        return true;
    });

    return width > 0 ? width : topNode.width ?? 0;
}

const applySize = (targetNodes: HierarchyNode[]) => {

    const f = (nodes: HierarchyNode[]) => {

        let width = 0;

        nodes.forEach(node => {

            const rect = getBBox(node.data, "NodeCard");
            node.width = rect.width;
            node.height = rect.height;

            width += node.width ?? 0;

            f(node.children);
        });
    }

    f(targetNodes);
}

const applyFamilySize = (targetNodes: Map<string, NodeInfo[]>) => {

    const a = () => {

        targetNodes.forEach((node, key) => {

        

        });    
    }

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

const generateNodesAndEdges = (targetNodes: HierarchyNode[]) => {

    const nodes : Node[] = [];
    const edges : Edge[] = [];

    const map = toMap(targetNodes);

    map.forEach((node, key) => {

        if (node.parentId == "") {



        }


    });

    console.log(map);

    return {
        nodes,
        edges
    };
}

const bgenerateNodesAndEdges = (hnodes: HierarchyNode[]) => {
    
    const nodes : Node[] = [];
    const edges : Edge[] = [];

    applySize(hnodes);

    // const heightArray = getHeightArray(hnodes);
    const stack : HierarchyNode[] = [];

    let cx = 0, cy = 0;

    const f = (baseNodes: HierarchyNode[]) => {

        console.log("A---");

        const row = stack.length;

        for (const n of baseNodes) {

            stack.unshift(n);

            n.x = cx;
            n.y = cy;

            const px = cx;

            console.log([...stack], row);

            // cy += heightArray[row];

            f(n.children);
        }

        const prev = stack.shift();
        const a = stack[0];

        console.log("B---", prev);

        cx = (prev?.x ?? 0) + (prev ? getNodeFamilyWidth(prev) : 0);
        cy = prev?.y ?? 0;
    }

    f(hnodes);

    //すべてのノードを描画用として追加
    flattenHiereachyNode(hnodes, (n) => {
    
        nodes.push({
            id: n.id,
            data: { label: n.data },
            type: "card",
            position: { x: n.x ?? 0, y: n.y ?? 0},
        });

        return true;
    });

    return {
        nodes,
        edges
    };
}

const agenerateNodesAndEdges = (hnodes: HierarchyNode[]) => {
    
    const nodes : Node[] = [];
    const edges : Edge[] = [];

    const paddingTop = 20;
    const marginTop = 48;
    const heightArray = getHeightArray(hnodes);

    let currentTreeWidth = 0;
    let currentRow = 0;
    let currentFamilyCol = 0;

    let lastHeight = 0;

    let stack : HierarchyNode[] = [];

    // const rectMap = new Map<string, { x: number, y: number, width: number, height: number, familyWidth: number }>();

    let col = 0;
    let cx = 0, cy = 0;

    flattenHiereachyNode(hnodes, (node, parentNode) => {

        const parentId = parentNode?.id ?? "";

        //各開始ノードか
        const isTopNode = !parentNode;

        //nodeが親から見たとき最初のノードか（親ノードがなくてもtrueとする）
        const isFirstChildNode = (parentNode && parentNode.children && parentNode.children[0].id == node.id) ?? true;

        //nodeが親から見たとき最後のノードか（親ノードがなくてもtrueとする）
        const isLastChildNode = (parentNode && parentNode.children && parentNode.children[parentNode.children.length - 1].id == node.id) ?? true;

        if (isFirstChildNode) {
            stack.unshift(node);
        }

        const row = (stack.length - 1);

        node.x = cx;
        node.y = cy;

        const nx = node.x;
        const ny = node.y;

        nodes.push({
            id: node.id,
            data: { label: node.data },
            type: "card",
            position: { x: nx, y: ny },
        });

        // cx += node.width ?? 0;
        cx += node.width ?? 0;
        cy += heightArray[row];

        console.log(node);

        // console.log(node, [...stack]);

        return true;

    }, () => {
        const n = stack.shift();
        const nn = stack[0];
        console.log("-----", nn);

        cx = (nn?.x ?? 0);
        // n ? console.log(getNodeFamilyWidth(n)) : 0;
        // cx = n ? (n.x ?? 0) + getNodeFamilyWidth(n) : 0;
        cy = n?.y ?? 0;
    });

    console.log(stack);
    console.log(hnodes);

    return {
        nodes,
        edges
    };
}

// const generateNodesAndEdges = (nodeMap: Map<string, NodeInfo>) => {

//     const nodes : Node[] = [];
//     const rowHeights = calcLayoutMap(nodeMap);
//     // const rows = layout[0], width = layout[1];
//     const paddingTop = 20;
//     const marginTop = 48;

//     let row = 0, col = 0;

//     nodeMap.forEach(node => {

//         if (node.parentId == "") row = 0;

//         const w = node.width;
//         const x = (node.childrenCount * w) / 2 - (w / 2);
//         const y = row > 0 ? rowHeights[row] + marginTop : paddingTop;

//         nodes.push({
//             id: node.id,
//             type: "card",
//             data: { label: node.text },
//             position: { x, y },
//         });

//         row++;

//         // nodes.push()

//         // nodes.push()

//     })

//     return [nodes];
// }

// const createHierarchyNodeNewButton = (hierarchyNodes: HierarchyNode[]) => {

//     const nodes =  [ ...hierarchyNodes ];
//     const newHiNodes : HierarchyNode[] = [];

//     const aa = (nodes: HierarchyNode[], appendTarget: HierarchyNode[]) => {

//         for (const node of nodes) {

//             const newNode : HierarchyNode = { ...node, children: [] };
//             appendTarget.push(newNode);
            
//             aa(node.children, newNode.children);

//             newNode.children.push({
//                 data: "test",
//                 children: [],
//                 id: node.id + "_NEW",
//                 type: "new",
//             })

//         }
//     }

//     //再帰呼出し
//     aa(nodes, newHiNodes);

//     return newHiNodes;
// }

// //ノードツリーからReactFlow用にNode・Edge配列を作成するメソッド
// const createNodesAndEdges = (hierarchyNodes: HierarchyNode[], onAppendNodeClick?: (id: string) => void): any => {

//     const n: Node[] = [];
//     const e: Edge[] = [];

//     const topMargin = 100;
//     const leftMargin = 32;
//     const width = 150, height = 38;

//     let global_x = 0;

//     const parents : { [id: string]: Node | undefined } = {};

//     const aa = (nodes: HierarchyNode[], parentNode?: Node) => {

//         let a = 0;

//         for (const node of nodes) {

//             parents[node.id] = parentNode;

//             const nNode: Node = {
//                 id: node.id,
//                 type: "card",
//                 data: { label: node.data, id: node.id, onAppendNodeClick: onAppendNodeClick },
//                 position: { x: global_x, y: 0 },
//             };

//             n.push(nNode);

//             if (parentNode) {
//                 e.push({
//                     id: crypto.randomUUID(),
//                     source: parentNode.id,
//                     target: nNode.id,
//                     type: 'smoothstep',
//                     markerEnd: {
//                         type: MarkerType.ArrowClosed,
//                     },
//                 })
//             }

//             if (parentNode) {
//                 nNode.position.x = global_x;
//                 nNode.position.y = parentNode.position.y + height + topMargin;
//             }

//             a += (width + leftMargin);

//             aa(node.children, nNode);
//         }

//         let pnode : Node | undefined = parentNode;

//         while (pnode != undefined && nodes.length > 1) {
//             pnode.position.x += (a - width - leftMargin) / 2;
//             pnode = parents[pnode.id];
//         }

//         if (nodes.length == 0) global_x += width + leftMargin;
//     }

//     //再帰呼出し
//     aa(hierarchyNodes);


//     return {
//         initNodes: n,
//         initEdges: e,
//     }
// }