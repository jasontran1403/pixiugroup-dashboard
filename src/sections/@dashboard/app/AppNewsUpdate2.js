import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  CardHeader,
  Divider
} from '@mui/material';
// components

import ModalExness from '../../../components/modal/ModalExness';
import ModalDetailRole from '../../../components/modalDetailRole/ModalDetail';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../user';
import { prod, dev } from "../../../utils/env";
// mock

const TABLE_HEAD = [
  { id: 'id', label: '#ID', alignRight: false },
  { id: 'email', label: 'Địa chỉ email', alignRight: false },
  { id: 'fullname', label: 'Họ và tên', alignRight: false },
  { id: 'vai trò', label: 'Vai trò', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
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
    return filter(array, (_user) => _user.email.toString().indexOf(query.toString()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function AppNewsUpdate2() {
  return (
    <Card>
      <CardHeader title={"Danh sách tài khoản"} subheader={""} />

      <Scrollbar>
        <TransactionItem />
      </Scrollbar>

      <Divider />
    </Card>
  );
}

// ----------------------------------------------------------------------
function TransactionItem() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [openDetail, setOpenDetail] = useState(null);

  const [listExness, setListExness] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isLoading, setIsLoading] = useState(false);
  const [currentExness, setCurrentExness] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [currentAccessToken] = useState(localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "");
  console.log("a");
  useEffect(() => {
    const config = {
      method: 'get',
      url: `${prod}/api/v1/secured/get-all-account`,
      headers: {
        'Authorization': `Bearer ${currentAccessToken}`
      }
    };

    axios.request(config)
      .then((response) => {
        setListExness(response.data);
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
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModalDetail = (id) => {
    setIsModalDetailOpen(true);
    setCurrentExness(id);
  };

  const closeModalDetail = () => {
    setIsModalDetailOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return (() => {
      clearTimeout(timeout);
    })
  }, []);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listExness.map((n) => n.exness);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listExness.length) : 0;

  const filteredUsers = applySortFilter(listExness, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
      <Card>
        <UserListToolbar currentChose={selected} numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={listExness.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const selectedUser = selected.indexOf(row) !== -1;
                  const { id, email, name, role } = row;

                  return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2} style={{ marginLeft: "15px" }}>
                          <Typography variant="subtitle2" noWrap>
                            {id}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2} style={{ marginLeft: "15px" }}>
                          <Typography variant="subtitle2" noWrap>
                            {email}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2} style={{ marginLeft: "15px" }}>
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2} style={{ marginLeft: "15px" }}>
                          <Typography variant="subtitle2" noWrap>
                            {role}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2} style={{ marginLeft: "15px" }}>
                          <Label onClick={() => { openModalDetail(id) }} style={{ cursor: "pointer" }} color={("info")}>{"Cập nhật"}</Label>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <ModalDetailRole className="abc" isOpen={isModalDetailOpen} onClose={closeModalDetail} exness={currentExness} />
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
          count={listExness.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
  );
}
