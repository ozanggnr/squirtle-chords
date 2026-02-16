"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header className="h-16 bg-black/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8 sticky top-0 z-40">
            <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search for songs, artists..."
                    className="w-full bg-gray-900 text-white pl-10 pr-4 py-2 rounded-full border border-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Log In
                </Link>
                <Link href="/register" className="bg-white text-black text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                    Sign Up
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
