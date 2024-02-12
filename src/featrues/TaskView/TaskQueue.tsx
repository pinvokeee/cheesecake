import { Box, Button, Card, CardActions, CardContent, Chip, ChipPropsColorOverrides, Container, Dialog, DialogActions, DialogContent, DialogContentText, Divider, Menu, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { TaskQueueObject, TaskState } from "../../common/types/TaskQueObject"
import { TaskCategoryDicitonary, TaskCategoryObject } from "../../common/types/TaskCategory"
import { OverridableStringUnion } from '@mui/types';
import "./TaskQueue.css";
import { TaskQueueDicitonary } from "../../common/types/TaskQueueDicitonary";
import { useState } from "react";

type Props = {
    categories: TaskCategoryObject[],
    queue: TaskQueueDicitonary,
    states: {
        taskCategory: TaskCategoryObject | undefined;
        queId: string;
        taskId: string;
        state: TaskState;
        startTime: number | undefined;
        endTime: number | undefined;
        countSeconds: number;
    }[],
    onStopTask: (queId: string) => void,
    onCancelTask: (queId: string) => void,
}

export const TaskQueue = (props: Props) => {

    const { categories, queue, states, onStopTask, onCancelTask } = props;

    const [anchor, setAnchor] = useState<undefined | HTMLElement>(undefined);
    const [isOpenConfirmCancel, setIsOpenConfirmCancel] = useState(false);
    const [selectQueId, setSelectQueId] = useState("");
    const isOpenMenu = anchor != undefined;

    const handleStopTask = () => {
        setAnchor(undefined);
        onStopTask(selectQueId);
    }

    const handleConfrimCancelTask = () => {
        setAnchor(undefined);
        setIsOpenConfirmCancel(true);
    }

    const handleClickCancel = () => {
        onCancelTask(selectQueId);
        setIsOpenConfirmCancel(false);
    }

    const handleClose = () => {
        setAnchor(undefined);
    }

    const handleConfrimClose = () => {
        setIsOpenConfirmCancel(false);
    }

    const handleMenuOpen = (e: any, queId: string) => {
        setSelectQueId(queId);
        setAnchor(e.currentTarget);
    }

    const stateLabels: { [key in TaskState]: string} = { start: "進行中", pause: "保留", stop: "終了", cancel: "キャンセル" };
    const stateColors: { [key: string]:     
            OverridableStringUnion<'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', 
            ChipPropsColorOverrides>
    } = { "start": "success", "pause": "error", "stop": "primary" };

    return <>
        <TableContainer className="tbContainer">
            <Table stickyHeader >
                <TableHead>
                    <TableRow>
                        {/* <TableCell sx={{fontWeight: "bold"}}></TableCell> */}
                        <TableCell className="stateCell" sx={{fontWeight: "bold"}}>状態</TableCell>
                        <TableCell sx={{fontWeight: "bold"}}>タスク</TableCell>
                        <TableCell sx={{fontWeight: "bold"}}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        states.map(t => 
                            <TableRow key={`table_${t.taskId}`}>
                                {/* <TableCell></TableCell> */}
                                <TableCell className="stateCell">
                                    <Chip label={stateLabels[t.state]} color={stateColors[t.state]} clickable/>
                                </TableCell>
                                <TableCell>{t.taskCategory?.text}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={(e) => handleMenuOpen(e, t.queId)}>...</Button>
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>

        <Menu anchorEl={anchor} open={isOpenMenu} onClose={handleClose}>
            <MenuItem onClick={handleStopTask}>
                <Typography color="success">タスクを終了</Typography>
            </MenuItem>
            <Divider></Divider>
            <MenuItem onClick={handleConfrimCancelTask}>
                <Typography color="error">測定をキャンセル</Typography>
            </MenuItem>
        </Menu>

        <Dialog open={isOpenConfirmCancel}>
            <DialogContent>
                <DialogContentText>測定をキャンセルしますか？</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickCancel}>はい</Button>
                <Button onClick={handleConfrimClose} autoFocus>いいえ</Button>
            </DialogActions>
        </Dialog>
        
    </>
}