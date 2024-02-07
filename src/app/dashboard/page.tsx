'use client'

import { AuthContext } from "@/context/auth-context";
import { Avatar, Button, Card, Divider, Grid, IconButton, TextField } from "@mui/material";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models";
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import { User } from "@/type";
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import * as yup from 'yup';
import { Form, useFormik } from "formik";

const Dashboard = () => {
    const { userInfo, logOut, setIsLoading } = useContext(AuthContext)
    const router = useRouter();

    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [users, setUsers] = useState<User[]>();
    const [page, setPage] = useState(0);
    const [editUser, setEditUser] = useState<User>();

    const validationSchema = yup.object({
        first_name: yup.string().required('First Name is required!'),
        last_name: yup.string().required('Last Name is required!'),
        email: yup.string().required('Email is required!')
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: { first_name: '', last_name: '', email: '' },
        validationSchema: validationSchema,
        onSubmit: (values) => {    
            setIsLoading(true);
            if (values && values.first_name && values.last_name && values.email) {
                axios.put('https://reqres.in/api/users/' + editUser?.id.toString(), { first_name: values.first_name, last_name: values.last_name, email: values.email})
                    .then((res) => {
                        console.log(res.data);

                        if (users && editUser) {
                            setUsers(users.map(item => {
                                if (item.id === editUser.id)
                                    return {...item, first_name: res.data.first_name}
                                else 
                                    return item
                            }));
                            
                        }

                        handleClose();
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            }
        }
    });

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
        },
        {
            field: 'avatar',
            headerName: 'Avatar',
            width: 100,
            renderCell: (params) => (
                <Avatar src={params.value} />
            ),
            sortable: false,
        },
        {
            field: 'first_name',
            headerName: 'First Name',
            width: 300,
            type: 'string'
        },
        {
            field: 'last_name',
            headerName: 'Last Name',
            width: 300,
            type: 'string'
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 400,
            type: 'string'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            type: 'actions',
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => {
                        setOpenEdit(true)
                        setEditUser(params.row)
                        formik.setFieldValue('first_name', params.row.first_name)
                        formik.setFieldValue('last_name', params.row.last_name)
                        formik.setFieldValue('email', params.row.email)
                    }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                        setOpenDelete(true)
                        setEditUser(params.row)
                    }}>
                        <DeleteIcon />
                    </IconButton>
                </>
            )
        }
    ] as GridColDef[]

    useEffect(() => {
        setIsLoading(true)
        axios.get('https://reqres.in/api/users?delay=1&page='+ (page + 1).toString())
            .then((res) => {
                setUsers(res.data.data)
                console.log(res.data);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [page])

    useEffect(() => {
        if (!userInfo) {
            router.push('/login')
        }
        console.log(userInfo);
        
    }, [userInfo])

    const handleClose = () => {
        setOpenEdit(false);
        setOpenDelete(false);
    }

    function handleDelete() {
        setUsers(users => users?.filter((item) => item.id !== editUser?.id))
        handleClose();
    }

    return (
        <>
            <Dialog open={openDelete} onClose={handleClose}>
                <div className="p-5 w-[450px]">
                    <div className="flex items-center justify-between">
                        <Typography className="text-[24px]">CONFIRM</Typography>
                        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                    </div>
                    <Divider className="mb-5"/>
                    <Typography className="text-[18px]">Are you sure you want to delete this user: {editUser?.first_name} {editUser?.last_name}?</Typography>
                    <div className="flex justify-end mt-4">
                        <Button className="mr-2" onClick={handleClose}>Cancel</Button>
                        <Button variant="contained" className="bg-[#0078d4]" onClick={handleDelete}>Agree</Button>
                    </div>
                </div>
            </Dialog>
            <Dialog open={openEdit} onClose={handleClose}>
                <form className="p-5 w-[450px]" onSubmit={formik.handleSubmit}>
                    <div className="flex items-center justify-between">
                        <Typography variant="h6">Edit user</Typography>
                        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                    </div>
                    <Divider className="mb-5"/>
                    <div className="flex justify-center">
                        <Avatar src={editUser?.avatar} className="w-[100px] h-[100px] mb-5" />
                    </div>
                    <Grid container className="flex items-center" rowSpacing={2}>
                        <Grid item xs={3}>
                            <Typography>First Name:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField 
                                id="first_name"
                                name="first_name"
                                className="[&_.MuiInputBase-root]:h-10 w-full" value={formik.values.first_name} onChange={(e) => formik.setFieldValue('first_name', e.target.value)}/>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography>Last Name:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                id="last_name"
                                name="last_name"
                                className="[&_.MuiInputBase-root]:h-10 w-full" value={formik.values.last_name} onChange={(e) => formik.setFieldValue('last_name', e.target.value)} />
                        </Grid>
                        <Grid item xs={3}>
                            <Typography>Email:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField 
                                id="email"
                                name="email"
                                className="[&_.MuiInputBase-root]:h-10 w-full" value={formik.values.email} onChange={(e) => formik.setFieldValue('email', e.target.value)} />
                        </Grid>
                    </Grid>
                    <div className="flex justify-end mt-4">
                        <Button variant="outlined" className="mr-4" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" className="bg-[#1976d2]" type='submit'>
                            Save
                        </Button>
                    </div>
                </form>
            </Dialog>
            <div className="bg-[#0078d4] w-full flex justify-between items-center p-5">
                <div className="flex items-center ml-5">
                    <AccountCircleIcon className="w-[32px] h-[32px]" sx={{ color: "white"}}/>
                    <Typography variant="h5" className="text-white ml-2">
                        Users manager
                    </Typography>
                </div>
                <div className="flex items-center mr-5">
                    <Typography className="text-white mr-5">
                        Welcome {userInfo?.email}
                    </Typography>
                    <Button variant="outlined" className="bg-white hover:bg-[#eeeeee]" onClick={() => logOut()}>
                        <LogoutIcon className="mr-2"/>
                        Log out
                    </Button>
                </div>
            </div>
            <div className="p-5">
                <Typography variant="h6" className="my-2">Users list:</Typography>
                <DataGrid paginationMode="server" onPaginationModelChange={(m) => setPage(m.page)} pageSizeOptions={[6]} paginationModel={{ page: page, pageSize: 6 }} rowCount={12} hideFooterSelectedRowCount disableColumnMenu columns={columns} rows={users || []} />
            </div>
        </>
    )
}

export default Dashboard;