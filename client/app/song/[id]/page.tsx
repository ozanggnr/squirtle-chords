'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Music, ChevronUp, ChevronDown, ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { ChordTransposer } from '@/utils/chordTransposer';
import API_URL from '@/config/api';

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
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/songs/${id}`);
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

    useEffect(() => {
        if (song?.content) {
            const transposed = ChordTransposer.transposeContent(song.content, transpose);
            setDisplayContent(transposed);
        }
    }, [transpose, song]);

    const handleTranspose = (direction: number) => {
        setTranspose(prev => prev + direction);
    };

    const handleCopy = async () => {
        if (displayContent) {
            await navigator.clipboard.writeText(displayContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-slate-400">Loading song...</div>
            </div>
        );
    }

    if (!song) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-slate-400">Song not found</div>
            </div>
        );
    }

    const renderContent = () => {
        const lines = displayContent.split('\n');

        return lines.map((line, index) => {
            const isChordLine = ChordTransposer.isChordLine(line);
            const isSection = line.trim().startsWith('[') && line.trim().endsWith(']');

            if (isSection) {
                return (
                    <div key={index} className="text-blue-400 font-bold text-lg mt-6 mb-3">
                        {line}
                    </div>
                );
            }

            return (
                <div
                    key={index}
                    className={`font-mono text-base leading-relaxed ${isChordLine
                            ? 'text-blue-400 font-bold tracking-wider'
                            : 'text-slate-300'
                        }`}
                >
                    {line || '\u00A0'}
                </div>
            );
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <header className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Songs
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Song Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-bold text-white mb-3">
                        {song.title}
                    </h1>
                    <p className="text-2xl text-blue-400 font-medium mb-6">
                        {song.artist}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1.5 bg-slate-800/50 text-slate-300 rounded-lg border border-slate-700/50 text-sm">
                            {song.language}
                        </span>
                        <span className="px-3 py-1.5 bg-slate-800/50 text-slate-300 rounded-lg border border-slate-700/50 text-sm">
                            {song.type}
                        </span>
                        {song.source === 'songsterr' && (
                            <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 text-sm font-medium">
                                Songsterr
                            </span>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="sticky top-20 z-40 mb-6 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-400">Transpose:</span>

                            <button
                                onClick={() => handleTranspose(-1)}
                                className="w-10 h-10 bg-slate-800 hover:bg-blue-600 text-white rounded-lg transition-all hover:scale-105"
                            >
                                <ChevronDown className="w-5 h-5 mx-auto" />
                            </button>

                            <div className="min-w-[4rem] text-center">
                                <div className="text-xl font-bold text-white">
                                    {transpose > 0 ? `+${transpose}` : transpose}
                                </div>
                                <div className="text-xs text-slate-500">semitones</div>
                            </div>

                            <button
                                onClick={() => handleTranspose(1)}
                                className="w-10 h-10 bg-slate-800 hover:bg-blue-600 text-white rounded-lg transition-all hover:scale-105"
                            >
                                <ChevronUp className="w-5 h-5 mx-auto" />
                            </button>

                            {transpose !== 0 && (
                                <button
                                    onClick={() => setTranspose(0)}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* Song Content */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    {song.content ? (
                        <div className="overflow-x-auto">
                            <div className="min-w-max">
                                {renderContent()}
                            </div>
                        </div>
                    ) : song.source === 'songsterr' ? (
                        <div className="text-center py-20">
                            <Music className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 mb-6">This song is from Songsterr</p>
                            <a
                                href={`https://www.songsterr.com/a/wsa/song-s${song.externalId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold rounded-xl transition-all hover:scale-105"
                            >
                                <Music className="w-5 h-5" />
                                View on Songsterr
                            </a>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-slate-500">
                            No content available
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
