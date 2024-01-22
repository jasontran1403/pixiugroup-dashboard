import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import { Button, FormGroup, FormLabel, Input, Typography, Grid, TextField, Popover, MenuItem } from '@mui/material';
import Swal from 'sweetalert2';
import Label from '../label';
import { prod, dev } from "../../utils/env";
import Iconify from '../iconify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const StyledProductImg = styled('img')({
    top: 0,
    width: '60%',
    height: '60%',
    objectFit: 'cover',
    margin: 'auto',
});

export default function ModalDetail({ exness, isOpen, onClose }) {
    const navigate = useNavigate();
    const [currentAccessToken] = useState(localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "");
    const [server, setServer] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [rate, setRate] = useState("");
    const [refferal, setRefferal] = useState("");
    const [role, setRole] = useState("");
    const [open2, setOpen2] = useState(null);
    const [listExness, setListExness] = useState([{role: "USER"}, {role: "MANAGER"}, {role: "ADMIN"}]);

    const handleOpen2 = (event) => {
        setOpen2(event.currentTarget);
    };

    const handleClose2 = () => {
        setOpen2(null);
    };

    const handleChangeExness = (exness) => {
        setRole(exness);
        handleClose2();
      }

    useEffect(() => {
        const config = {
            method: 'get',
            url: `${prod}/api/v1/secured/get-info/id=${exness}`,
            headers: {
                'Authorization': `Bearer ${currentAccessToken}`
            }
        };

        if (isOpen) {
            axios.request(config)
                .then((response) => {
                    setRole(response.data);
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        Swal.fire({
                            title: "An error occured",
                            icon: "error",
                            timer: 3000,
                            position: 'center',
                            showConfirmButton: false
                        });
                    } else {
                        Swal.fire({
                            title: "Session is ended, please login again !",
                            icon: "error",
                            timer: 3000,
                            position: 'center',
                            showConfirmButton: false
                        }).then(() => {
                            localStorage.clear();
                            navigate('/login', { replace: true });
                        });
                    }
                });
        }
    }, [exness, isOpen]);

    const handleSubmit = (id) => {
        const config = {
            method: 'get',
            url: `${prod}/api/v1/secured/change-role/id=${exness}/role=${role}`,
            headers: {
                'Authorization': `Bearer ${currentAccessToken}`
            }
        };

        axios.request(config)
            .then((response) => {
                if (response.status === 200) {
                    onClose();
                    Swal.fire({
                        title: "Success",
                        icon: "success",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    }).then(() => {
                        window.location.reload();
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 403) {
                    Swal.fire({
                        title: "An error occured",
                        icon: "error",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        title: "Session is ended, please login again !",
                        icon: "error",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    }).then(() => {
                        localStorage.clear();
                        navigate('/login', { replace: true });
                    });
                }
            });
    }

    return (
        <div>
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style} className="flex">
                    <Grid item xs={12} sm={12} md={12} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <TextField
                            onClick={handleOpen2}
                            name="role"
                            value={role}
                            label="Vai trò"
                        />
                        <Popover
                            open={Boolean(open2)}
                            anchorEl={open2}
                            onClose={handleClose2}
                            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            PaperProps={{
                                sx: {
                                    p: 1,
                                    width: 240,
                                    marginTop: "40px",
                                    '& .MuiMenuItem-root': {
                                        px: 1,
                                        typography: 'body2',
                                        borderRadius: 0.75,
                                    },
                                },
                            }}
                        >
                            {listExness.map((item, index) => {
                                return <MenuItem key={index} onClick={() => { handleChangeExness(item.role) }}>
                                    <Iconify sx={{ mr: 2 }} />
                                    {item.role}
                                </MenuItem>
                            })}
                        </Popover>
                        <Button onClick={handleSubmit}>Cập nhật</Button>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}