"use client"
import {useAuth} from "@/app/context/AuthContext";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function Profile() {
    const {userInfo} = useAuth();
    const [user, setUser] = useState(userInfo());
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = userInfo();
                if (data) {
                    setUser(data);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                router.push('/login');
            }
        };

        fetchUser().then();
    }, [user, userInfo]);

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