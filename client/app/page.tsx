'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Search, Music2, Guitar, Sparkles, ArrowRight, Filter } from 'lucide-react';
import API_URL from '@/config/api';

interface Song {
    _id: string;
    title: string;
    artist: string;
    language: string;
    type: string;
}

function HomePage() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const search = searchParams.get('search');
    const language = searchParams.get('language');

    useEffect(() => {
        const fetchSongs = async () => {
            setLoading(true);
            try {
                let url = `${API_URL}/api/songs`;
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (language) params.append('language', language);
                if (params.toString()) url += `?${params.toString()}`;

                const res = await axios.get(url);
                setSongs(res.data);
            } catch (error) {
                console.error('Error fetching songs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [search, language]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Modern Header */}
            <header className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Guitar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Squirtle Chords</h1>
                                <p className="text-xs text-slate-400">Guitar Tabs & Chords</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="px-3 py-1.5 bg-slate-800/50 text-slate-300 rounded-lg border border-slate-700/50">
                                {songs.length} songs
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Title Section */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">
                            {search ? 'Search Results' : language ? `${language} Collection` : 'All Songs'}
                        </span>
                    </div>

                    <h2 className="text-5xl font-bold text-white mb-4">
                        {search ? `"${search}"` : language ? `${language} Songs` : 'Browse Songs'}
                    </h2>

                    <p className="text-xl text-slate-400">
                        {loading ? 'Loading your collection...' : `${songs.length} ${songs.length === 1 ? 'song' : 'songs'} available`}
                    </p>
                </div>

                {/* Songs Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 bg-slate-800/30 border border-slate-700/50 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : songs.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {songs.map((song) => (
                            <Link
                                key={song._id}
                                href={`/song/${song._id}`}
                                className="group relative bg-gradient-to-br from-slate-800/40 to-slate-800/20 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                            >
                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative">
                                    {/* Icon */}
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {song.type === 'Chords' ? (
                                            <Guitar className="w-6 h-6 text-blue-400" />
                                        ) : (
                                            <Music2 className="w-6 h-6 text-purple-400" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
                                        {song.title}
                                    </h3>

                                    <p className="text-sm text-slate-400 mb-4 truncate">
                                        {song.artist}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex gap-2 mb-4">
                                        <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-md text-xs font-medium">
                                            {song.language}
                                        </span>
                                        <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-md text-xs font-medium">
                                            {song.type}
                                        </span>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex items-center text-sm text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Chords
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-slate-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No songs found</h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                            {search || language
                                ? 'Try adjusting your search or filters'
                                : 'Database is empty. Add songs to get started.'}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-slate-500">Loading...</div>
            </div>
        }>
            <HomePage />
        </Suspense>
    );
}
