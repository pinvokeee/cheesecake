import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import ReactFlow, { useEdgesState, useNodesState, Node, Position, getNodesBounds, ReactFlowProvider, useNodes, useNodesInitialized, useReactFlow, useStore, Controls, Edge, MarkerType, Background } from "reactflow"
import 'reactflow/dist/style.css';
import './OptionPage.css';
import { Flow } from "./featrues/OptionPage/Flow/Flow";

const getHierarchyNodeFromId = (id: string, nodes: HierarchyNode[]) : HierarchyNode | undefined => {

    for (const node of nodes) {
        if (node.id == id) return node;
        const n = getHierarchyNodeFromId(id, node.children);
        if (n) return n;
    }

    return undefined;
}

function OptionPage() {

    const [ hierarchyNodes, setHierarchyNodes ] = useState([ ...abc ]);


    const onClick = () => {
        setHierarchyNodes(nodes => [...nodes, { id: crypto.randomUUID(), data: "testaaaaaa", children: [] }] );
        // setHierarchyNodes(nodes =>  [...nodes, { id: crypto.randomUUID(), data: "testaaaaaa", children: [] }]);
    }

    const onAppendNodeClick = (id: string) => {
        const n = getHierarchyNodeFromId(id, hierarchyNodes) as HierarchyNode;
        n.children.push({ id: crypto.randomUUID(), data: "testaaaaaa", children: [] })

        console.log(hierarchyNodes)
;
        setHierarchyNodes(nodes => [...nodes]);
    }
    
    return <>
        <div className="Container">
            <div className="GridBox">
                <div><Button onClick={onClick}>test</Button></div>
                <Flow nodes={hierarchyNodes} onAppendNodeClick={onAppendNodeClick}></Flow>
            </div>
        </div>
    </>
}



const abc : HierarchyNode[] = [

    {
        id: crypto.randomUUID(),
        data: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1",
        children: [
            {
                id: crypto.randomUUID(),
                data: "A1-1",
                children: [
                    {
                        id: crypto.randomUUID(),
                        data: "A1-1-1",
                        children: [
                            {
                                id: crypto.randomUUID(),
                                data: "A1-1-1-1",
                                children: []
                            },

                            {
                                id: crypto.randomUUID(),
                                data: "A1-1-1-2",
                                children: []
                            }
                        ]
                    },

                    {
                        id: crypto.randomUUID(),
                        data: "A1-1-2",
                        children: []
                    }
                ]
            },

            {
                id: crypto.randomUUID(),
                data: "A1-2",
                children: [
                    {
                        id: crypto.randomUUID(),
                        data: "A1-2-1",
                        children: []
                    }
                ]
            }
        ]
    },

    {
        id: crypto.randomUUID(),
        data: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2",
        children: [
        ]
    },

    {
        id: crypto.randomUUID(),
        data: "testbbb",
        children: [
            {
                id: crypto.randomUUID(),
                data: "testbbbchildaaaa",
                children: [],
            },

            {
                id: crypto.randomUUID(),
                data: "testbbbchildbbbb",
                children: [],
            }
        ]
    },

    {
        id: crypto.randomUUID(),
        data: "test1",
        children: [
            {
                id: crypto.randomUUID(),
                data: "test2",
                children: [
                    {
                        id: crypto.randomUUID(),
                        data: "test3",
                        children: [
                            {
                                id: crypto.randomUUID(),
                                data: "test4",
                                children: [
                                    {
                                        id: crypto.randomUUID(),
                                        data: "test5-1",
                                        children: [],
                                    },
                                    
                                    {
                                        id: crypto.randomUUID(),
                                        data: "test5-2",
                                        children: [],
                                    },

                                    {
                                        id: crypto.randomUUID(),
                                        data: "test5-3",
                                        children: [],
                                    },

                                    {
                                        id: crypto.randomUUID(),
                                        data: "test5-4",
                                        children: [],
                                    }
                                ],
                            },
                            {
                                id: crypto.randomUUID(),
                                data: "test4-2",
                                children: [],
                            }
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        data: "test6",
                        children: [
                            {
                                id: crypto.randomUUID(),
                                data: "test7",
                                children: [
                                    {
                                        id: crypto.randomUUID(),
                                        data: "test7-1",
                                        children: [],
                                    },

                                    {
                                        id: crypto.randomUUID(),
                                        data: "test7-2",
                                        children: [],
                                    },
                                ],
                            },
                            {
                                id: crypto.randomUUID(),
                                data: "test8aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                                children: [
                                    
                                    {
                                        id: crypto.randomUUID(),
                                        data: "test8-1",
                                        children: [],
                                    },

                                ],
                            }
             
                        ],
                    }
                ],
            }
        ]
    },

]


const maxHeight = (a: Node | undefined, b: Node | undefined) => Math.max(a?.height ?? 0, b?.height ?? 0);

export default OptionPage