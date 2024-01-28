import { Box, Button } from "@mui/material"
import { Handle, Position } from "reactflow"
import './NodeNewButton.css';
import { useCallback } from "react";

export const NodeNewButton = (props: { data: string, isConnectable: boolean }) => {

    return <Box sx={{ width: "150px", height: "38px" }}>
        <Handle 
        type="target" 
        position={Position.Top} 
        style={{}} 
        isConnectable={false}
      />
        <div>
            <div className="NewAppnedButton">+</div>
            {/* <input type="button" value="test"></input> */}
            {/* <Button>{"NEW"}</Button> */}
        </div>
        <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{}} 
        isConnectable={false}
      />
    </Box>
}

// type NodeData = {
//     // id: string,
//     label: string,
//     onAppendNodeClick: (id: string) => void,
// }

// export const Card = (props: { data: NodeData, id: string, isConnectable: boolean, selected: boolean }) => {

//     const { id, selected } = props;
//     const { label, onAppendNodeClick } = props.data;

//     const onAppendClick = useCallback(() => {
//         onAppendNodeClick(id);        
//     }, []);

//     return <Box sx={{ 
//     width: "150px", 
//     height: "38px",
//     border: "solid 1px gray",
//     borderRadius: "2px",
//     background: "white",
//     // boxShadow: "2px 2px 4px 0px gray", 
//     }}>
//         <Handle 
//         type="target" 
//         className="handle"
//         position={Position.Top} 
//         style={{}} 
//         isConnectable={false}
//       />
//         <Box sx={{ paddingLeft: "10px", width: "100%", height: "100%", display: "flex", alignItems: "center"}}>
//             <div>{label ?? ""}</div>
//         </Box>
//         <Handle 
//         className="handle"
//         type="source" 
//         position={Position.Bottom} 
//         style={{}} 
//         isConnectable={false}
//       />
//       { props.selected && onAppendNodeClick != undefined ? <div className="NewAppnedButton" onClick={onAppendClick}>+</div> : <></> }
//     </Box>
// }