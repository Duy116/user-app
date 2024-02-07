'use client';

import { Auth } from '@/type';
import { Modal, CircularProgress } from '@mui/material';
import React from 'react';
import { createContext } from 'react';

export type AuthContextType = {
    userInfo: Auth | undefined;
    isLoading: boolean;
    setIsLoading: (val: boolean) => void;
    logIn: (res: Auth) => void;
    logOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    userInfo: undefined,
    isLoading: false,
    setIsLoading: () => { },
    logIn: () => { },
    logOut: () => { }
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userInfo, setUserInfo] = React.useState<Auth | undefined>();
    const [isLoading, setIsLoading] = React.useState(false);

    const logIn = (res: Auth) => {
        if (res) {
            setIsLoading(false);
            setUserInfo(res);
        }
    };

    const logOut = () => {
        setUserInfo(undefined);
    };

    return (
        <>
            <Modal open={isLoading}>
                <CircularProgress className='absolute top-[50%] left-[50%]' size='60px' />
            </Modal>
            <AuthContext.Provider value={{ userInfo, isLoading, setIsLoading, logIn, logOut }}>
                {children}
            </AuthContext.Provider>
        </>
    );
}
