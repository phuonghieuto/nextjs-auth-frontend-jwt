"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    accessToken: string | null;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = Cookies.get('accessToken');
        if (storedToken) {
            setAccessToken(storedToken);
        }
    }, []);

    const login = (accessToken: string, refreshToken: string) => {
        Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'strict' });
        Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict' });
        setAccessToken(accessToken);
        router.push('/');
    };

    const logout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        setAccessToken(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};