import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import { Button, FormGroup, FormLabel, Input, Typography, Grid, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import Label from '../label';
import { prod, dev } from '../../utils/env';

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
  const [currentAccessToken] = useState(
    localStorage.getItem('access_token') ? localStorage.getItem('access_token') : ''
  );
  const [server, setServer] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [rate, setRate] = useState('');
  const [refferal, setRefferal] = useState('');

  useEffect(() => {
    const config = {
      method: 'get',
      url: `${prod}/api/v1/secured/get-exness/exness=${exness}`,
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
      },
    };

    if (isOpen) {
      axios
        .request(config)
        .then((response) => {
          setServer(response.data.server);
          setPassword(response.data.password);
          setMessage(response.data.message);
          setRate(response.data.reason);
          setRefferal(response.data.refferal);
        })
        .catch(() => {
          Swal.fire({
            title: 'Session is ended, please login again !',
            icon: 'error',
            timer: 3000,
            position: 'center',
            showConfirmButton: false,
          }).then(() => {
            localStorage.clear();
            navigate('/login', { replace: true });
          });
        });
    }
  }, [exness, isOpen]);

  const handleSubmit = () => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${prod}/api/v1/secured/active-exness/${exness}`,
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          onClose();
          Swal.fire({
            title: 'Success',
            icon: 'success',
            timer: 3000,
            position: 'center',
            showConfirmButton: false,
          }).then(() => {
            window.location.reload();
          });
        }
      })
      .catch(() => {
        Swal.fire({
          title: 'Session is ended, please login again !',
          icon: 'error',
          timer: 3000,
          position: 'center',
          showConfirmButton: false,
        }).then(() => {
          localStorage.clear();
          navigate('/login', { replace: true });
        });
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
        <Box sx={style} className="flex">
          <Grid item xs={12} sm={12} md={12} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <TextField name="exnessId" value={exness} label="Exness ID" readOnly />
            <TextField
              onChange={(e) => {
                setServer(e.target.value);
              }}
              name="server"
              value={server}
              label="Server"
            />
            <TextField
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              name="password"
              value={password}
              label="Mật khẩu"
            />
            <TextField
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              name="date"
              value={message}
              label="Ngày bắt đầu"
            />
            <TextField
              onChange={(e) => {
                setRate(e.target.value);
              }}
              name="rate"
              value={rate}
              label="Chỉ số"
            />
            <TextField
              onChange={(e) => {
                setRefferal(e.target.value);
              }}
              name="refferal"
              value={refferal}
              label="Refferal"
            />
            <Button onClick={handleSubmit}>Cập nhật</Button>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
