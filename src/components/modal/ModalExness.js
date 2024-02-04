import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, FormGroup, FormLabel, Input, Typography, Grid, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import Label from '../label';
import { prod, dev } from "../../utils/env";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ModalExness({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [currentEmail] = useState(localStorage.getItem("email") ? localStorage.getItem("email") : "");
    const [currentAccessToken] = useState(localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "");
    const [exnessId, setExnessId] = useState("");
    const [server, setServer] = useState("");
    const [password, setPassword] = useState("");
    const [passview, setPassview] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [reason, setReason] = useState("");
    const [refferal, setRefferal] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = () => {
        onClose();
        if (exnessId === "" || server === "" || password === "" || passview === "" || reason === "" || message === "" || refferal === "" || name === "") {
            Swal.fire({
                title: "Vui lòng nhập đủ các thông tin!",
                icon: "error",
                timer: 3000,
                position: 'center',
                showConfirmButton: false
            });
            return;
        }

        const data = JSON.stringify({
            "email": currentEmail,
            "exness": exnessId,
            "name": name,
            "server": server,
            "password": password,
            "passview": passview,
            "date" : message,
            "rate": reason,
            "refferal": refferal,
            "type": 1
        });

        console.log(data);
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${prod}/api/v1/secured/update-exnessLisa`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentAccessToken}`
            },
            "data": data
        };

        axios.request(config)
            .then((response) => {
                if (response.data.status === 200) {
                    Swal.fire({
                        title: response.data.message,
                        icon: "success",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    }).then(() => {
                        // window.location.reload();
                    });
                } else if (response.data.status === 226) {
                    Swal.fire({
                        title: response.data.message,
                        icon: "error",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    });
                }
            })
            .catch((error) => {
                // if (error.response.status === 403) {
                //     Swal.fire({
                //         title: "An error occured",
                //         icon: "error",
                //         timer: 3000,
                //         position: 'center',
                //         showConfirmButton: false
                //     });
                // } else {
                //     Swal.fire({
                //         title: "Session is ended, please login again !",
                //         icon: "error",
                //         timer: 3000,
                //         position: 'center',
                //         showConfirmButton: false
                //     }).then(() => {
                //         localStorage.clear();
                //         navigate('/login', { replace: true });
                //     });
                // }
                console.log(error);
            });
    };

    return (
        <div>
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style}>
                    <Typography variant="h4" gutterBottom>
                        Thêm tài khoản Exness
                    </Typography>
                    <Grid item xs={12} sm={12} md={12} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <TextField onChange={(e) => { setExnessId(e.target.value) }}
                            name="exnessId"
                            value={exnessId}
                            label="Exness ID"
                            required
                        />
                        <TextField onChange={(e) => { setName(e.target.value) }}
                            name="name"
                            value={name}
                            label="Tên"
                            required
                        />
                        <TextField onChange={(e) => { setServer(e.target.value) }}
                            name="server"
                            value={server}
                            label="Server"
                            required
                        />
                        <TextField onChange={(e) => { setPassword(e.target.value) }}
                            name="password"
                            value={password}
                            label="Password"
                            required
                        />
                        <TextField onChange={(e) => { setPassview(e.target.value) }}
                            name="passview"
                            value={passview}
                            label="Passview"
                            required
                        />
                        <TextField onChange={(e) => { setMessage(e.target.value) }}
                            name="message"
                            value={message}
                            label="Ngày bắt đầu"
                            required
                        />
                        <TextField onChange={(e) => { setReason(e.target.value) }}
                            name="reason"
                            value={reason}
                            label="Chỉ số"
                            required
                        />
                        <TextField onChange={(e) => { setRefferal(e.target.value) }}
                            name="refferal"
                            value={refferal}
                            label="ID Exness Người giới thiệu"
                            required
                        />
                        <Button onClick={handleSubmit}>Thêm mới</Button>
                    </Grid>
                </Box>
                
            </Modal>
        </div>
    );
}