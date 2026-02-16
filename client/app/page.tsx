'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Guitar, Music } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { CardSkeleton } from '@/components/ui/skeleton';
import API_URL from '@/config/api';

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
        <div className="space-y-6">
            {/* Clean Header */}
            <div className="border-b border-gray-800 pb-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                    {search ? `Search: "${search}"` : language ? `${language} Songs` : 'All Songs'}
                </h1>
                <p className="text-gray-400">
                    {loading ? 'Loading...' : `${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`}
                </p>
            </div>

            {/* Songs Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : songs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {songs.map((song) => (
                        <Link key={song._id} href={`/song/${song._id}`}>
                            <Card className="cursor-pointer h-full">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="p-3 bg-gray-800 rounded-lg flex-shrink-0">
                                        {song.type === 'Chords' ? (
                                            <Guitar className="text-blue-400" size={24} />
                                        ) : (
                                            <Music className="text-purple-400" size={24} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white truncate mb-1">
                                            {song.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 truncate mb-2">
                                            {song.artist}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex gap-2 flex-wrap">
                                            <span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">
                                                {song.language}
                                            </span>
                                            <span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">
                                                {song.type}
                                            </span>
                                            {song.source === 'songsterr' && (
                                                <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded border border-green-800/50">
                                                    External
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<Music size={64} />}
                    title="No songs found"
                    description={
                        search || language
                            ? "Try adjusting your search or filters"
                            : "Start by adding some songs or searching for chords"
                    }
                />
            )}
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        }>
            <HomePage />
        </Suspense>
    );
}
