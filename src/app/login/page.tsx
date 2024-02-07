'use client'

import { AuthContext } from "@/context/auth-context";
import { Button, Grid, TextField } from "@mui/material";
import { Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Paper from '@mui/material/Paper';

const Login = () => {
    const { userInfo, logIn } = useContext(AuthContext)  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    useEffect(() => {
        if (userInfo) {
            router.push('/dashboard')
        }
    }, [userInfo])

    const handleLogIn = async () => {
        const res = await axios.post('https://reqres.in/api/login', { email: email, password: password })
        console.log(res);
        logIn({email, password})
    }

    return (
        <div className="bg-[url(/login.jpg)] bg-cover h-screen flex items-center justify-center">
            <div className="bg-[#FFFFFFCC] p-10 w-[400px] rounded-md">
                <div className="flex justify-center items-center mb-4 flex-col">
                    <Typography variant="h4">Users manager</Typography>
                    <Typography variant="h6">Login</Typography>
                </div>
                <Grid container className="flex items-center justify-center" rowSpacing={2}>
                    <Grid item xs={3}>
                        <Typography className="text-black">Email</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField className="[&_.MuiInputBase-root]:h-10 w-full" value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography className="text-black">Password</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField className="[&_.MuiInputBase-root]:h-10 w-full" value={password} onChange={(e) => setPassword(e.target.value)}></TextField>
                    </Grid>
                </Grid>
                <Button className="mt-4 w-full bg-[#0078d4]" variant="contained" onClick={handleLogIn}>Login</Button>
                <div className="flex justify-center mt-2">
                    <Typography className="underline text-[#0078d4] cursor-pointer">Don't have an account?</Typography>
                </div>  
            </div>
        </div>
    )
}

export default Login;