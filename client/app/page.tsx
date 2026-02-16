'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Search, Music2, Guitar, ArrowRight } from 'lucide-react';
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
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-black border-b border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
                            <Music2 size={20} className="text-blue-400" />
                            <span className="text-blue-400 text-sm font-medium">Guitar Chords & Tabs</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                            {search ? `"${search}"` : language ? `${language} Songs` : 'Discover Songs'}
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            {loading ? 'Loading...' : `${songs.length} songs available`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Songs Grid */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-900 border border-gray-800 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : songs.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {songs.map((song) => (
                            <Link
                                key={song._id}
                                href={`/song/${song._id}`}
                                className="group relative bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-lg p-5 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate mb-1">
                                            {song.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate mb-3">
                                            {song.artist}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <span className="px-2 py-1 bg-gray-800 rounded">{song.language}</span>
                                            <span className="px-2 py-1 bg-gray-800 rounded">{song.type}</span>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 mt-1">
                                        {song.type === 'Chords' ? (
                                            <Guitar size={20} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
                                        ) : (
                                            <Music2 size={20} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
                                        )}
                                    </div>
                                </div>

                                <ArrowRight size={16} className="absolute bottom-5 right-5 text-gray-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 border border-gray-800 rounded-full mb-4">
                            <Search size={32} className="text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No songs found</h3>
                        <p className="text-gray-500">
                            {search || language ? 'Try adjusting your search' : 'Database is empty. Run seeder to add sample songs.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
            <HomePage />
        </Suspense>
    );
}
