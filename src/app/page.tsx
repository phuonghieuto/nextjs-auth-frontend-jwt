"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/context/AuthContext";

export default function Home() {
    const { userInfo } = useAuth();
    const [user, setUser] = useState(userInfo());
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = userInfo();
                if(data){
                    setUser(data);
                    setIsLogin(true);
                }
            } catch (error) {
                router.push('/login');
            }
        };

        fetchUser().then();
    }, [user, userInfo]);

    if (isLogin) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold text-blue-600">
                    Welcome, {user?.name}!
                </h1>
                <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                    onClick={() => router.push('/profile')}
                >
                    Profile
                </button>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold text-blue-600">
                    Hello stranger, please login to view your profile.
                </h1>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => router.push('/login')}
                >
                    Login
                </button>
            </div>
        );
    }
}