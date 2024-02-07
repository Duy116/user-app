'use client'
import AuthProvider from "@/context/auth-context";
import { CircularProgress, Modal, StyledEngineProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css'
import { useContext } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledEngineProvider injectFirst>
          <AuthProvider>
            {children}
          </AuthProvider>
        </StyledEngineProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
