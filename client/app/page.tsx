'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Music, Guitar, Sparkles, TrendingUp, Clock, Users } from 'lucide-react';
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

    const stats = [
        { icon: Music, label: 'Total Songs', value: songs.length.toString(), color: 'text-blue-400' },
        { icon: TrendingUp, label: 'Popular', value: '12', color: 'text-green-400' },
        { icon: Clock, label: 'Recent', value: '24h', color: 'text-purple-400' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section with Gradient */}
            <section className="relative overflow-hidden border-b border-border">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass animate-fade-in">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-muted-foreground">
                                Guitar Chords & Tabs Library
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
                            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
                                {search ? `Results for "${search}"` : language ? `${language} Songs` : 'Discover Amazing Songs'}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
                            {loading ? 'Loading your music collection...' : `Browse ${songs.length} chord charts and tabs`}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="glass rounded-xl p-4 sm:p-6 text-center transition-all hover:scale-105 hover:glow animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                                <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
                                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Songs Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-40 rounded-xl glass animate-pulse"
                                style={{ animationDelay: `${i * 50}ms` }}
                            />
                        ))}
                    </div>
                ) : songs.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {songs.map((song, index) => (
                            <Link
                                key={song._id}
                                href={`/song/${song._id}`}
                                className="group relative glass rounded-xl p-6 transition-all hover:scale-[1.02] hover:glow animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Icon Badge */}
                                <div className="absolute top-4 right-4">
                                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 transition-all group-hover:bg-primary/20">
                                        {song.type === 'Chords' ? (
                                            <Guitar className="w-4 h-4 text-primary" />
                                        ) : (
                                            <Music className="w-4 h-4 text-purple-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-3 pr-12">
                                    <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                                        {song.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground truncate">
                                        {song.artist}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex gap-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                                            {song.language}
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                                            {song.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Indicator */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                        <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 space-y-4 animate-fade-in">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full glass flex items-center justify-center">
                            <Music className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-semibold">No songs found</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            {search || language
                                ? 'Try adjusting your search or browse all songs'
                                : 'Database is empty. Add songs to get started.'}
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        }>
            <HomePage />
        </Suspense>
    );
}
