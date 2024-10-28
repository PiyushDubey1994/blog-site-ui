import React, { useState,useContext, Fragment, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import UserRoleForm from "./UserRoleForm.jsx";
import {AuthContext} from "../authentication/AuthContext";

function Row({ row, onEdit,onDelete }) {
    const [open, setOpen] = useState(false);
    console.log(row);

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="right">{row.id}</TableCell>
                <TableCell component="th" scope="row">{row.username}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell component="th" scope="row">{row.secret}</TableCell>
                <TableCell align="right">{row.twoFactorEnabled}</TableCell>
                <TableCell>
                    <IconButton onClick={() => onEdit(row)} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton  onClick={() => onDelete(row.id)} color="secondary">
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Defined Roles
                            </Typography>
                            <Typography >
                                <UserRoleForm user={row} />
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

export default function UserTableView() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [rows, setRows] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const {getAccessToken ,login} = useContext(AuthContext);
    //import {AuthContext} from "../authentication/AuthContext";
    const [currentRow, setCurrentRow] = useState({
        id: '',
        username: '',
        email: '',
        roles: [],

    });
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        email: '',
        roles: [],
    });

    useEffect(() => {
        // Retrieve the access token using the helper function
        const token = getAccessToken();
        console.log("Token being sent:", token);

        if (!token) {
            console.error('No access token found!');
            return; // Stop further execution if no token is available
        }

        // Make the API request with the token in the Authorization header
        axios.get('http://34.70.118.87:80/api/v1.0/blogsite/auth/user/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log("Data fetched successfully:", response.data);
            setRows(response.data);
        })
        .catch(error => {
            // Handle different error cases, such as unauthorized access
            if (error.response) {
                console.error('Error Response:', error.response.status, error.response.data);
                if (error.response.status === 401 || error.response.status === 403) {
                    console.error('Unauthorized or Forbidden request. Please check your token.');
                }
            } else {
                console.error('There was an error fetching the data!', error.message);
            }
        });
    }, []);

   

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredRows = rows.filter(row =>
        row.username && row.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleEdit = (row) => {
        setCurrentRow(row);
        setFormData(row);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        const token = getAccessToken();
        axios.put(`http://34.70.118.87:80/api/v1.0/user/blogs/update/${currentRow.id}`, formData,{
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
            .then(response => {
                setRows(prevRows => prevRows.map(row =>
                    row.id === currentRow.id ? response.data : row
                ));
                setOpenModal(false);
            })
            .catch(error => {
                console.error('There was an error updating the data!', error);
            });
    };

    const handleDelete = (id) => {
        const token = getAccessToken();
        console.log("Token being sent:", token);
        axios.delete(`http://34.70.118.87:80/api/v1.0/blogsite/auth/user/delete/${id}`,{
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
            .then(() => {
                setRows(prevRows => prevRows.filter(row => row.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the data!', error);
            });
    };

    return (
        <Paper style={{ marginTop: '50px' }}>
            <Box p={5}>
                <div className="input-field col s12">
                    <input
                        id="search"
                        type="text"
                        className="validate"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <label htmlFor="search">Search</label>
                </div>
            </Box>
            <TableContainer style={{ marginTop: '-50px' }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="center">#ID</TableCell>
                            <TableCell align="center">UserName</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">secret</TableCell>
                            <TableCell align="center">twoFactorEnabled</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRows.map((row) => (

                            <Row key={row.id} row={row} onEdit={handleEdit} onDelete={handleDelete} />

                        ))}
                        {rows.roles}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Modal for Editing */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Edit Blog</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="blogname"
                        label="Blog Name"
                        type="text"
                        fullWidth
                        value={formData.id}
                        onChange={handleChange}
                        disabled
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="blogname"
                        label="Blog Name"
                        type=""
                        fullWidth
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="category"
                        label="Category"
                        type="text"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="authorname"
                        label="Author Name"
                        type="text"
                        fullWidth
                        value={formData.roles.values()}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
