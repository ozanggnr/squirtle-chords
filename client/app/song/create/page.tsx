'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Save, ArrowLeft, Music, User as UserIcon, Globe, AlertCircle } from 'lucide-react';
import API_URL from '@/config/api';

interface ParsedSong {
    title: string;
    artist: string;
    content: string;
    chordCount: number;
}

export default function CreateSongPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<ParsedSong>({
        title: '',
        artist: '',
        content: '',
        chordCount: 0
    });
    const [language, setLanguage] = useState('Turkish');
    const [type, setType] = useState('Chords');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Load parsed data from sessionStorage
        const parsedData = sessionStorage.getItem('parsedSong');
        if (parsedData) {
            const data = JSON.parse(parsedData);
            setFormData(data);
            // Guess type based on chord count
            setType(data.chordCount > 10 ? 'Chords' : 'Tabs');
        } else {
            // No data, redirect to upload
            router.push('/upload');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        setError('');

        if (!formData.title || !formData.artist || !formData.content) {
            setError('Please fill in all fields');
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            await axios.post(`${API_URL}/api/songs`, {
                title: formData.title,
                artist: formData.artist,
                language,
                type,
                content: formData.content
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Clear sessionStorage
            sessionStorage.removeItem('parsedSong');

            // Redirect to home
            router.push('/');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save song');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-6">
                <button
                    onClick={() => router.push('/upload')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft size={18} />
                    Back to Upload
                </button>
                <h1 className="text-4xl font-bold text-white mb-2">Review & Edit Song</h1>
                <p className="text-gray-400">Review the parsed content and make any necessary edits</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 flex items-center gap-2">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {/* Metadata Section */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Music size={20} />
                        Song Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Song title"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Artist</label>
                            <input
                                type="text"
                                name="artist"
                                value={formData.artist}
                                onChange={handleChange}
                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Artist name"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option>Turkish</option>
                                <option>English</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option>Chords</option>
                                <option>Tabs</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Editor */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-white font-bold mb-4">Song Content</h3>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows={20}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                        placeholder="Paste or edit song content here..."
                    />
                    {formData.chordCount > 0 && (
                        <p className="text-gray-500 text-sm mt-3">
                            Detected {formData.chordCount} chord patterns
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={() => router.push('/')}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Song'}
                    </button>
                </div>
            </div>
        </div>
    );
}
