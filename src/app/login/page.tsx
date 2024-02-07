'use client'

import { AuthContext } from "@/context/auth-context";
import { Button, CircularProgress, Grid, Modal, TextField } from "@mui/material";
import { Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
    const { userInfo, logIn, isLoading, setIsLoading } = useContext(AuthContext)  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (userInfo) {
            router.push('/dashboard')
        }
    }, [userInfo])

    const handleLogIn = async () => {
        setIsLoading(true);
        axios.post('https://reqres.in/api/login', { email: email, password: password })
        .then(() => {
            logIn({ email, password })
        })
        .catch((error) => {
            toast.error(error.response.data.error);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    return (
        <div className="bg-[url(/login.jpg)] bg-cover h-screen flex items-center justify-center">
            <Modal open={isLoading}>
                <CircularProgress className='absolute top-[50%] left-[50%]' size='60px' />
            </Modal>
            <div className="bg-[#FFFFFFCC] p-10 w-[400px] rounded-md">
                <div className="flex justify-center items-center mb-4 flex-col">
                    <Typography variant="h4">Users manager</Typography>
                    <Typography variant="h6">Login</Typography>
                </div>
                <Grid container className="flex items-center justify-center" rowSpacing={2}>
                    <Grid item xs={3}>
                        <Typography className="text-black text-right mr-2">Email</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField placeholder="Insert Email" className="[&_.MuiInputBase-root]:h-10 w-full" value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography className="text-black text-right mr-2">Password</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField placeholder="Insert Password" type='password' className="[&_.MuiInputBase-root]:h-10 w-full" value={password} onChange={(e) => setPassword(e.target.value)}></TextField>
                    </Grid>
                </Grid>
                <Button className="mt-4 w-full bg-[#0078d4]" variant="contained" onClick={handleLogIn}>Login</Button>
            </div>
        </div>
    )
}

export default Login;