'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { User, Calendar, Music, Type, ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ChordTransposer } from '@/utils/chordTransposer';

// Enable dynamic params for client-side rendering
export const dynamicParams = true;

// Required for static export - return empty array to generate client-side only
export async function generateStaticParams() {
    return [];
}


interface Song {
    _id: string;
    title: string;
    artist: string;
    language: string;
    type: string;
    content: string;
    source?: 'local' | 'songsterr';
    externalId?: string;
    createdBy?: {
        username: string;
    };
    createdAt: string;
}

export default function SongDetail() {
    const { id } = useParams();
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [transpose, setTranspose] = useState(0);
    const [displayContent, setDisplayContent] = useState('');

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/songs/${id}`);
                setSong(res.data);
                setDisplayContent(res.data.content);
            } catch (error) {
                console.error('Error fetching song:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSong();
        }
    }, [id]);

    // Update content when transpose changes
    useEffect(() => {
        if (song?.content) {
            const transposed = ChordTransposer.transposeContent(song.content, transpose);
            setDisplayContent(transposed);
        }
    }, [transpose, song]);

    const handleTranspose = (direction: number) => {
        setTranspose(prev => prev + direction);
    };

    const resetTranspose = () => {
        setTranspose(0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-400 text-lg">Loading song...</div>
            </div>
        );
    }

    if (!song) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-400 text-lg">Song not found.</div>
            </div>
        );
    }

    // Parse content into lines and detect chord lines
    const renderContent = () => {
        const lines = displayContent.split('\n');

        return lines.map((line, index) => {
            const isChordLine = ChordTransposer.isChordLine(line);

            return (
                <div
                    key={index}
                    className={`font-mono text-sm md:text-base leading-relaxed ${isChordLine
                        ? 'text-blue-400 font-bold tracking-wide'
                        : 'text-gray-300'
                        }`}
                >
                    {line || '\u00A0'}
                </div>
            );
        });
    };

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {/* Back Button */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Songs
            </Link>

            {/* Header with gradient background */}
            <div className="relative mb-8 p-8 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/30 border border-gray-800 overflow-hidden">
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        {song.title}
                    </h1>
                    <h2 className="text-3xl text-blue-400 font-medium mb-6">
                        {song.artist}
                    </h2>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                            <Music size={16} />
                            <span>{song.type}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                            <Type size={16} />
                            <span>{song.language}</span>
                        </div>
                        {song.source === 'local' && song.createdBy ? (
                            <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                <User size={16} />
                                <span>by {song.createdBy.username}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 bg-green-900/30 border border-green-800/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                <User size={16} />
                                <span className="text-green-400 font-medium">Songsterr</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                            <Calendar size={16} />
                            <span>{new Date(song.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transpose Controls (sticky) */}
            <div className="sticky top-4 z-20 mb-6 bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-xl p-4 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-medium text-sm">Transpose:</span>
                        <button
                            onClick={() => handleTranspose(-1)}
                            className="p-2 bg-gray-800 hover:bg-blue-600 text-white rounded-lg transition-all hover:scale-105 active:scale-95"
                            title="Transpose down"
                        >
                            <ChevronDown size={20} />
                        </button>
                        <div className="min-w-[80px] text-center">
                            <span className="text-white font-bold text-lg">
                                {transpose > 0 ? `+${transpose}` : transpose}
                            </span>
                            <span className="text-gray-500 text-xs block">semitones</span>
                        </div>
                        <button
                            onClick={() => handleTranspose(1)}
                            className="p-2 bg-gray-800 hover:bg-blue-600 text-white rounded-lg transition-all hover:scale-105 active:scale-95"
                            title="Transpose up"
                        >
                            <ChevronUp size={20} />
                        </button>
                    </div>

                    {transpose !== 0 && (
                        <button
                            onClick={resetTranspose}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Song Content */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-800 overflow-x-auto shadow-2xl">
                {song.content ? (
                    <div className="chord-sheet">
                        {renderContent()}
                    </div>
                ) : song.source === 'songsterr' ? (
                    <div className="text-center py-16">
                        <Music className="mx-auto mb-4 text-gray-600" size={64} />
                        <p className="text-gray-400 mb-6 text-lg">This song is from Songsterr.</p>
                        <a
                            href={`https://www.songsterr.com/a/wsa/song-s${song.externalId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-green-900/50"
                        >
                            <Music size={20} />
                            View Tabs on Songsterr
                        </a>
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        No content available
                    </div>
                )}
            </div>
        </div>
    );
}
