"use client"
import {useAuth} from "@/app/context/AuthContext";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getUser} from "@/api/api";
import {User} from "@/type/user.type";

export default function Profile() {
    const { userInfo } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser();
                setUser(userData);
            } catch (error) {
                if (!userInfo()) {
                    router.push('/login');
                }
            }
        };

        if (!userInfo()) {
            router.push('/login');
        } else {
            fetchUser().then();
        }
    }, [router, userInfo]);


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    return (
        <div className = "flex flex-col items-center justify-center h-screen">
            <h1 className = "text-4xl font-bold text-blue-600">
                Name: {user?.name}!
            </h1>
            <h3 className = "text-2xl font-bold text-blue-600 mt-5">
                Email: {user?.email}!
            </h3>
            <h4 className = "text-lg font-bold text-blue-600 mt-5">
                Your account was created on {user ? formatDate(user.createdAt) : ''}
            </h4>
        </div>
    );
}