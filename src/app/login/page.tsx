'use client'

import { AuthContext } from "@/context/auth-context";
import { Button, Grid, TextField } from "@mui/material";
import { Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

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
        <div className="bg-white h-screen flex items-center justify-center">
            <div className="bg-[#b7b7b7] p-5 w-[400px] rounded-md">
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
                <div className="flex justify-end my-2">
                    <Button variant="contained" onClick={handleLogIn}>Login</Button>
                </div>
            </div>
        </div>
    )
}

export default Login;