import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import {
  Box, Grid, TextField, Card, Table, Stack, Paper, Avatar, Button, Popover, Checkbox, TableRow, MenuItem, TableBody, TableCell, Container, Typography, IconButton, TableContainer, TablePagination,
} from '@mui/material';
import { format } from 'date-fns';
// components
import Swal from 'sweetalert2';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// sections
import { prod } from "../utils/env";
import { TransactionListHead, TransactionListToolbar } from '../sections/@dashboard/transactions';
// mock
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'time', label: 'Thời gian', alignRight: false },
  { id: 'amount', label: 'Số tiền', alignRight: false },
  { id: 'message', label: 'Ghi chú', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.amount.toString().toLowerCase().indexOf(query.toString().toLowerCase()) !== -1 ||
      _user.transactionId.toString().toLowerCase().indexOf(query.toString().toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CommissionPage() {
  const [open, setOpen] = useState(null);

  const [capital, setCapital] = useState(0.0);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [listTransactions, setListTransactions] = useState([]);

  const [isAdmin] = useState(localStorage.getItem("r") === "a");

  const [currentEmail] = useState(localStorage.getItem("email") ? localStorage.getItem("email") : "");
  const [currentAccessToken] = useState(localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "");

  useEffect(() => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${prod}/api/v1/secured/get-all-commission-pixiu`,
      headers: {
        'Authorization': `Bearer ${currentAccessToken}`
      }
    };

    axios.request(config)
      .then((response) => {
        setListTransactions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });


  }, []);

  const handleConvertTime = (timeunix) => {
    return format(new Date(timeunix * 1000), 'HH:mm:ss dd/MM/yyyy');
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleSubmit = () => {
    if (capital <= 0.0) {
      return;
    }

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${prod}/api/v1/auth/pixiu-group/capital=${parseFloat(capital)}`,
    };

    axios.request(config)
      .then((response) => {
        if (response.data === "ok") {
          Swal.fire({
            title: "Thao tác chia IB thành công",
            icon: "success",
            timer: 3000,
            position: 'center',
            showConfirmButton: false
          }).then(() => {
            window.location.reload();
          });
        }
      });
  }

  const handleDelete = () => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${prod}/api/v1/auth/pixiu-group/delete`,
    };

    axios.request(config)
      .then((response) => {
        if (response.data === "ok") {
          Swal.fire({
            title: "Xoá dữ liệu IB thành công!",
            icon: "success",
            timer: 3000,
            position: 'center',
            showConfirmButton: false
          }).then(() => {
            window.location.reload();
          });
        }
      });
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listTransactions.length) : 0;

  const filteredUsers = applySortFilter(listTransactions, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Commission </title>
        <link rel='icon' type='image/x-icon' href='/assets/logo.svg' />
      </Helmet>

      <Container item style={{ marginBottom: "20px" }}>
        <Card>
          {isAdmin ? <Box>
            <Typography variant="h4" gutterBottom>
              Chia IB (chức năng test dành cho ADMIN)
            </Typography>
            <Grid item xs={12} sm={12} md={12} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <TextField onChange={(e) => { setCapital(e.target.value) }}
                name="capital"
                value={capital}
                label="Doanh số"
                type="number"
                required
              />
              <Card style={{ textAlign: "center" }}>
                <Button onClick={handleSubmit}>Tiến hành chia IB</Button>
                <Button onClick={handleDelete}>Xoá dữ liệu chia IB</Button>
              </Card>
            </Grid>
          </Box> : <></>}
        </Card>
      </Container>

      <Container>
        <Card>
          <TransactionListToolbar filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TransactionListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listTransactions.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { transactionId, time, amount, sender, message } = row;

                    return (
                      <TableRow hover key={index} tabIndex={-1}>
                        <TableCell align="left">{handleConvertTime(time)}</TableCell>

                        <TableCell align="left">{`$${amount.toString().substring(0, 4)}`}</TableCell>

                        <TableCell align="left">{transactionId}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={listTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
