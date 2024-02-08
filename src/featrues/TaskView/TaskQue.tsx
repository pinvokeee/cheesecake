import { Box, Button, Card, CardActions, CardContent, Chip, ChipPropsColorOverrides, Container, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { TaskQueObject } from "../../common/types/MeasurementTask"
import { TaskItem } from "../../common/types/TaskItem"
import { OverridableStringUnion } from '@mui/types';
import "./TaskQue.css";

type Props = {
    taskMap: Map<string, TaskItem>,
    states: TaskQueObject[],
}

export const TaskQue = (props: Props) => {

    const { taskMap, states } = props;

    const stateLabels = { "start": "進行中", "pause": "保留", "stop": "終了" };
    const stateColors: { [key: string]:     
            OverridableStringUnion<'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', 
            ChipPropsColorOverrides>
    } = { "start": "success", "pause": "error", "stop": "primary" };

    const list = states.filter(t => t.state != "stop").map(t => ({ ...t, node: taskMap.get(t.taskId) }));        

    return <>
        <TableContainer className="tbContainer">
            <Table stickyHeader >
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight: "bold"}}></TableCell>
                        <TableCell sx={{fontWeight: "bold"}}>タスク</TableCell>
                        <TableCell sx={{fontWeight: "bold"}}>状態</TableCell>
                        <TableCell sx={{fontWeight: "bold"}}>コントロール</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        list.map(t => 
                            <TableRow key={`table_${t.node?.id}`}>
                                <TableCell></TableCell>
                                <TableCell>{t.node?.text}</TableCell>
                                <TableCell>
                                    <Chip label={stateLabels[t.state]} color={stateColors[t.state]} clickable/>
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>

    </>

    // return <Stack spacing={2}>
    //     { list.map(t => 
    //         <Paper elevation={1}>                    
    //             <Stack gap="2" direction={"row"}>
    //                 <Box padding={"20px"}>{t.node?.text}</Box>
    //                 <Box>
    //                     <Button size="small">再開</Button>
    //                 </Box>                        
    //             </Stack>
    //         </Paper>) }
    // </Stack>
}