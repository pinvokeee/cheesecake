import { Box } from "@mui/material";
import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import './Card.css';

type NodeData = { label: string, onAppendNodeClick: (id: string) => void, }

export const cardRect = {
    width: 150,
    height: 38,
}

export const Card = (props: { data: NodeData, id: string, isConnectable: boolean, selected: boolean }) => {

    const { id, selected } = props;
    const { label, onAppendNodeClick } = props.data;

    const onAppendClick = useCallback(() => {
        onAppendNodeClick(id);        
    }, []);

    const { width, height } = cardRect;

    return <>
        <Box className="NodeCard">
            <Handle type="target" className="handle" position={Position.Top} isConnectable={false} />
            {/* <Box sx={{ paddingLeft: "10px", width: "100%", height: "100%", display: "flex", alignItems: "center"}}> */}
                <div>{label ?? ""}</div>
            {/* </Box> */}
            <Handle className="handle" type="source"  position={Position.Bottom} isConnectable={false} />
        { props.selected && onAppendNodeClick != undefined ? <div className="NewAppnedButton" onClick={onAppendClick}>+</div> : <></> }
        </Box>
    </>
}