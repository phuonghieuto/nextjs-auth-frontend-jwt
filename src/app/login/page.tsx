"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/api/api";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";

const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            router.push('/');
        }
    }, [router]);

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) newErrors.email = 'Email is required';
        if (!validateEmail(email)) newErrors.email = 'Email is invalid';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateField = (field: string, value: string) => {
        const newErrors = { ...errors };
        switch (field) {
            case 'email':
                if (!value) newErrors.email = 'Email is required';
                else if (!validateEmail(value)) newErrors.email = 'Email is invalid';
                else delete newErrors.email;
                break;
            case 'password':
                if (!value) newErrors.password = 'Password is required';
                else delete newErrors.password;
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const handleBlur = (field: string, value: string) => {
        validateField(field, value);
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await loginUser(email, password);
            if (response.accessToken != null && response.refreshToken != null) {
                login(response.accessToken, response.refreshToken);
            }
        } catch (error: any) {
            setErrors({ ...errors, general: error.message || 'Login failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:grid md:gap-x-0 md:grid-cols-5 sm:w-4/5 md:w-2/3 h-3/5">
            <div className="flex flex-col bg-base-200 gap-4 rounded-box p-6 md:col-span-2 sm:col-span-5">
                <h1 className="text-3xl font-bold self-center">LOGIN</h1>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">Email</span>
                    </div>
                    <input
                        className="input input-bordered"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={(e) => handleBlur('email', e.target.value)}
                    />
                    {errors.email && <span className="text-red-500 mt-2">{errors.email}</span>}
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">Password</span>
                    </div>
                    <input
                        type="password"
                        className="input input-bordered"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={(e) => handleBlur('password', e.target.value)}
                    />
                    {errors.password && <span className="text-red-500 mt-2">{errors.password}</span>}
                </label>
                {errors.general && <span className="text-red-500 mt-2">{errors.general}</span>}
                <button
                    className="btn btn-primary mt-5"
                    onClick={handleLogin}
                    disabled={loading || !email || !password}
                >
                    {loading ? <span className="loading loading-spinner loading-md"></span> : 'Login'}
                </button>
                <div className="divider">OR</div>
                <span className="self-center">
                    Don't have an account? <a
                    className="link link-secondary"
                    onClick={() => router.push('/register')}>Register</a>
                </span>
            </div>
            <div className="bg-cover bg-[url('/images/mountain.jpg')] md:col-span-3 sm:hidden md:block"></div>
        </div>
    );
}