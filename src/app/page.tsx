'use client'
import { AuthContext } from "@/context/auth-context";
import { CircularProgress } from "@mui/material";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { userInfo } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (userInfo) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [userInfo])
  
  return (
    <div className='fixed inset-0 bg-white z-[9999]'>
      <CircularProgress className='absolute top-[50%] left-[50%]' size='60px' />
    </div>
  );
}
