/**
 * Manual Entry Page
 * Premium design for adding chords manually
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { songAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';

export default function ManualEntryPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { toasts, removeToast, success, error } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !artist || !content) {
            error('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const song = await songAPI.createManualSong({ title, artist, content });
            success('Song created successfully!');
            setTimeout(() => {
                navigate(`/song/${song.id}`);
            }, 500);
        } catch (err: any) {
            error(err.response?.data?.error || err.message || 'Failed to create song');
            console.error('Creation error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold gradient-text mb-3">Add Your Song</h1>
                    <p className="text-xl text-text-secondary">
                        Paste or type chords and tabs directly
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title & Artist */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Song Title <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full glass px-4 py-3 rounded-lg focus:ring-2 focus:ring-accent-primary outline-none text-text-primary text-lg"
                                placeholder="Enter song title"
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Artist <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                className="w-full glass px-4 py-3 rounded-lg focus:ring-2 focus:ring-accent-primary outline-none text-text-primary text-lg"
                                placeholder="Enter artist name"
                                required
                            />
                        </motion.div>
                    </div>

                    {/* Content Textarea */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Chords & Tabs <span className="text-error">*</span>
                        </label>
                        <div className="glass rounded-xl p-4">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-transparent text-text-primary font-mono text-sm outline-none resize-none"
                                placeholder={`Paste or type your chords here...

Example:
[Verse 1]
    C              G
Hey there, Delilah
        Am
What's it like in New York City?
               C                    G
I'm a thousand miles away
                Am                       F
But, girl, tonight you look so pretty
      G        Am
Yes you do

[Chorus]
            G              Am
Times Square can't shine as bright as you
      G
I swear, it's true`}
                                rows={20}
                                required
                            />
                        </div>
                        <p className="text-sm text-text-muted mt-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Tip: Use proper spacing for chord alignment
                        </p>
                    </motion.div>

                    {/* Character Count */}
                    <div className="flex justify-between items-center text-sm text-text-muted">
                        <span>{content.length} characters</span>
                        <span>{content.split('\n').length} lines</span>
                    </div>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-4 rounded-xl font-semibold shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Save Song</span>
                                </>
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => navigate('/')}
                            disabled={loading}
                            className="glass px-8 py-4 rounded-xl font-semibold hover:bg-white/5 disabled:opacity-50"
                        >
                            Cancel
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </>
    );
}
