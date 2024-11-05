"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "@/api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export default function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{
        email?: string;
        name?: string;
        password?: string;
        confirmPassword?: string;
        general?: string;
    }>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validate = () => {
        const newErrors: { email?: string; name?: string; password?: string; confirmPassword?: string } = {};
        if (!email) newErrors.email = 'Email is required';
        if (!validateEmail(email)) newErrors.email = 'Email is invalid';
        if (!name) newErrors.name = 'Name is required';
        if (!password) newErrors.password = 'Password is required';
        if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        if (confirmPassword && password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
            case 'name':
                if (!value) newErrors.name = 'Name is required';
                else delete newErrors.name;
                break;
            case 'password':
                if (!value) newErrors.password = 'Password is required';
                else delete newErrors.password;
                break;
            case 'confirmPassword':
                if (!value) newErrors.confirmPassword = 'Confirm password is required';
                else if (value !== password) newErrors.confirmPassword = 'Passwords do not match';
                else delete newErrors.confirmPassword;
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const handleBlur = (field: string, value: string) => {
        validateField(field, value);
    };

    const handleRegister = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await registerUser(email, name, password);
            toast.success('Registration successful!');
            setTimeout(() => {
                router.push('/login');
            }, 1000);
        } catch (error: any) {
            setErrors({ ...errors, general: error.message || 'Registration failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:grid md:gap-x-0 md:grid-cols-4 sm:w-4/5 md:w-2/3 h-3/5">
            <div className="rounded-l-box bg-cover bg-[url('/images/mountain.jpg')] md:col-span-2 hidden md:block"></div>
            <div className="flex flex-col bg-base-200 gap-4 rounded-r-box p-6 md:col-span-2">
                <h1 className="text-3xl font-bold self-center">CREATE ACCOUNT</h1>
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
                        <span className="label-text">Name</span>
                    </div>
                    <input
                        className="input input-bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={(e) => handleBlur('name', e.target.value)}
                    />
                    {errors.name && <span className="text-red-500 mt-2">{errors.name}</span>}
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
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">Confirm Password</span>
                    </div>
                    <input
                        type="password"
                        className="input input-bordered"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                    />
                    {errors.confirmPassword && <span className="text-red-500 mt-2">{errors.confirmPassword}</span>}
                </label>
                {errors.general && <span className="text-red-500 mt-2">{errors.general}</span>}
                <button
                    className="btn btn-primary mt-5"
                    onClick={handleRegister}
                    disabled={loading || !email || !name || !password || !confirmPassword}
                >
                    {loading ? <span className="loading loading-spinner loading-md"></span> : 'Create'}
                </button>
                <div className="divider my-0">OR</div>
                <span className="self-center">
                    Already have an account? <a
                    className="link link-secondary"
                    onClick={() => router.push('/login')}>Login</a>
                </span>
            </div>
            <ToastContainer />
        </div>
    );
}