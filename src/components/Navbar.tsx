"use client"

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <button
                        tabIndex={0}
                        className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </button>
                </div>
                <button
                    className="btn btn-ghost text-xl"
                    onClick={() => router.push('/')}>Home</button>
            </div>
            <div className="navbar-end">
                <button
                    className="mr-2 btn"
                    onClick={() => router.push('/profile')}>Profile</button>
                <button
                    className="btn"
                    onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}