'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { PlayCircle, Mic2, Guitar, Sparkles } from 'lucide-react';
import Mascot from '@/components/Mascot';

interface Song {
    _id: string;
    title: string;
    artist: string;
    language: string;
    type: string;
    source?: 'local' | 'songsterr';
    tabTypes?: string[];
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
                let url = 'http://localhost:5000/api/songs';
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
        <div className="space-y-8">
            {/* Header with gradient */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 via-gray-900 to-gray-900 border border-gray-800 p-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="text-blue-400" size={32} />
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                            {search ? `Results for "${search}"` : language ? `${language} Songs` : 'Discover Songs'}
                        </h2>
                    </div>
                    <p className="text-gray-400 text-lg">
                        {songs.length} {songs.length === 1 ? 'song' : 'songs'} available
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400 text-lg">Loading songs...</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {songs.map((song) => (
                        <Link
                            key={song._id}
                            href={`/song/${song._id}`}
                            className="group relative bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
                        >
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-all duration-500"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-5">
                                    <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl group-hover:from-blue-500/20 group-hover:to-blue-600/10 transition-all duration-300 shadow-lg">
                                        {song.type === 'Chords' ? (
                                            <Guitar size={24} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                                        ) : (
                                            <Mic2 size={24} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                                        )}
                                    </div>
                                    <div className="flex gap-2 flex-wrap justify-end">
                                        <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-800/80 text-gray-400 border border-gray-700 backdrop-blur-sm">
                                            {song.language}
                                        </span>
                                        {song.source === 'songsterr' && (
                                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-900/40 text-green-400 border border-green-800/50 backdrop-blur-sm">
                                                SONGSTERR
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 mb-2 truncate transition-colors">
                                    {song.title}
                                </h3>
                                <p className="text-sm text-gray-400 mb-6 truncate">
                                    {song.artist}
                                </p>

                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 group-hover:text-blue-400 transition-colors">
                                    <PlayCircle size={16} className="group-hover:scale-110 transition-transform" />
                                    <span>View {song.type}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {songs.length === 0 && !loading && (
                <div className="text-center py-24 bg-gradient-to-br from-gray-900/50 to-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
                    <Mascot size={120} showAnimation={true} className="mx-auto mb-6" />
                    <p className="text-gray-500 text-xl font-medium mb-2">No songs found.</p>
                    <p className="text-gray-600 text-sm">Try adjusting your search filters or browse all songs.</p>
                </div>
            )}
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="text-gray-400 text-lg">Loading...</div></div>}>
            <HomePage />
        </Suspense>
    );
}
