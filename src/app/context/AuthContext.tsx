"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { User } from "@/type/user.type";
import { getUser } from "@/api/api";

interface AuthContextType {
    userInfo: () => User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const accessToken = Cookies.get('accessToken');
            const refreshToken = Cookies.get('refreshToken');
            if (accessToken && refreshToken) {
                setUser(await getUser());
            }
        };

        fetchUser();
    }, []);

    const userInfo = () => {
        return user;
    };

    const login = (user: User) => {
        if (typeof user.accessToken === "string") {
            Cookies.set('accessToken', user.accessToken, { secure: true, sameSite: 'strict' });
        } else {
            user.accessToken = Cookies.get('accessToken') || '';
        }
        if (typeof user.refreshToken === "string") {
            Cookies.set('refreshToken', user.refreshToken, { secure: true, sameSite: 'strict' });
        } else {
            user.refreshToken = Cookies.get('refreshToken');
        }
        setUser({
            name: user?.name || '',
            email: user?.email || '',
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            createdAt: user?.createdAt || ''
        });
        router.push('/');
    };

    const logout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, logout }}>
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