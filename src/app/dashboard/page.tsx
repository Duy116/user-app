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

const Dashboard = () => {
    const { userInfo, logOut } = useContext(AuthContext)
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<User[]>();
    const [page, setPage] = useState(0);
    const [editUser, setEditUser] = useState<User>();

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
            width: 200,
            type: 'string'
        },
        {
            field: 'last_name',
            headerName: 'Last Name',
            width: 200,
            type: 'string'
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 300,
            type: 'string'
        },
        {
            field: 'edit',
            width: 200,
            type: 'actions',
            renderCell: (params) => (
                <IconButton onClick={() => {
                    setOpen(true)
                    setEditUser(params.row)
                }}>
                    <EditIcon />
                </IconButton>
            )
        }
    ] as GridColDef[]

    useEffect(() => {
        axios.get('https://reqres.in/api/users?page='+ (page + 1).toString()).then((res) => {
            setUsers(res.data.data)
            console.log(res.data);
            
        })
    }, [page])

    useEffect(() => {
        if (!userInfo) {
            router.push('/login')
        }
        console.log(userInfo);
        
    }, [userInfo])

    const handleClose = () => {
        setOpen(false);
    }
    
    const handleEdit = () => {
        axios.put('https://reqres.in/api/users/' + editUser?.id.toString(), { first_name: 'AAAAA', last_name: editUser?.last_name, email: editUser?.email}).then((res) => {
            console.log(res.data);
            handleClose();
            if (users && editUser) {
                setUsers(users.map(item => {
                    if (item.id === editUser.id)
                        return {...item, first_name: res.data.first_name}
                    else 
                        return item
                }));
                
            }
        })
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <div className="p-5 w-[450px]">
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
                            <Typography>Id:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField disabled className="[&_.MuiInputBase-root]:h-10 w-full"/>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography>First Name:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField className="[&_.MuiInputBase-root]:h-10 w-full" />
                        </Grid>
                        <Grid item xs={3}>
                            <Typography>Last Name:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField className="[&_.MuiInputBase-root]:h-10 w-full" />
                        </Grid>
                        <Grid item xs={3}>
                            <Typography>Email:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField className="[&_.MuiInputBase-root]:h-10 w-full" />
                        </Grid>
                    </Grid>
                    <div className="flex justify-end mt-4">
                        <Button variant="outlined" className="mr-4" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" className="bg-[#1976d2]" onClick={handleEdit}>
                            Save
                        </Button>
                    </div>
                </div>
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