'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import API_URL from '@/config/api';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, formData);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data));
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 w-full max-w-md backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-2"
                    >
                        Log In
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
