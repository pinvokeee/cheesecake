import { Snackbar, Alert } from "@mui/material"
import { useCallback, useEffect, useState } from "react";

type Props = {
    text: string,
    isOpen: boolean,
    onClose: () => void,
}

export const Message = (props: Props) => {

    const [isOpen, setOpen] = useState(false);
    const { onClose, text  } = props;

    useEffect(() => {
        setOpen(props.isOpen);
    }, [props.isOpen]);
    
    const handleClose = useCallback(() => onClose(), []);

    return <>
        <Snackbar open={isOpen} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>{text}</Alert>
        </Snackbar>
    </>
}