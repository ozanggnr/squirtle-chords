/**
 * HomePage with Hero Section
 * Premium design with glassmorphism and animations
 */

import { useEffect, useState } from 'react';
import { songAPI } from '../services/api';
import type { Song } from '../types';
import SongCard from '../components/SongCard';
import Hero from '../components/Hero';
import { SkeletonGrid } from '../components/Skeleton';
import { motion } from 'framer-motion';

export default function HomePage() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState<'title' | 'artist' | 'date'>('title');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        loadSongs();
    }, [page]);

    // Sort songs whenever sortBy or sortOrder changes
    useEffect(() => {
        const sorted = [...songs].sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'title') {
                comparison = a.title.localeCompare(b.title);
            } else if (sortBy === 'artist') {
                comparison = a.artist.localeCompare(b.artist);
            } else if (sortBy === 'date') {
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        setSongs(sorted);
        setFilteredSongs(sorted);
    }, [sortBy, sortOrder]);

    const loadSongs = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await songAPI.getAllSongs(page, 20);
            setSongs(data.songs);
            setFilteredSongs(data.songs);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            setError(err.message || 'Failed to load songs');
            console.error('Error loading songs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        const filtered = songs.filter(song =>
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSongs(filtered);
    };

    if (loading) {
        return (
            <div>
                <Hero />
                <SkeletonGrid count={6} />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Hero />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-12 text-center max-w-2xl mx-auto"
                >
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Oops! Something went wrong</h2>
                    <p className="text-error mb-6">{error}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={loadSongs}
                        className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-3 rounded-xl font-semibold shadow-glow"
                    >
                        Try Again
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    if (songs.length === 0) {
        return (
            <div>
                <Hero />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-12 text-center max-w-2xl mx-auto"
                >
                    <div className="text-6xl mb-4">🎸</div>
                    <h2 className="text-3xl font-bold gradient-text mb-4">No songs yet</h2>
                    <p className="text-text-secondary mb-8">
                        Be the first to add a song! Upload a file or create one manually.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="/upload"
                            className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-3 rounded-xl font-semibold shadow-glow"
                        >
                            Upload File
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="/add"
                            className="glass px-8 py-3 rounded-xl font-semibold hover:bg-white/5"
                        >
                            Add Manually
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div>
            <Hero onSearch={handleSearch} />

            {/* Sort Controls */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 flex items-center justify-between flex-wrap gap-4"
            >
                <div className="flex items-center gap-3">
                    <span className="text-text-secondary text-sm">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'title' | 'artist' | 'date')}
                        className="glass px-4 py-2 rounded-lg text-text-primary bg-transparent border border-white/10 focus:outline-none focus:border-accent-primary"
                    >
                        <option value="title" className="bg-bg-secondary">Title</option>
                        <option value="artist" className="bg-bg-secondary">Artist</option>
                        <option value="date" className="bg-bg-secondary">Date Added</option>
                    </select>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="glass px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                        aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                    >
                        {sortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A'}
                    </motion.button>
                </div>
            </motion.div>

            {/* Results Count */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 flex items-center justify-between"
            >
                <p className="text-text-secondary">
                    Showing <span className="text-accent-primary font-semibold">{filteredSongs.length}</span> {filteredSongs.length === 1 ? 'song' : 'songs'}
                </p>
            </motion.div>

            {/* Song Grid */}
            {filteredSongs.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredSongs.map((song, index) => (
                        <SongCard key={song.id} song={song} index={index} />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-xl p-12 text-center"
                >
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-text-primary mb-2">No results found</h3>
                    <p className="text-text-secondary">Try a different search term</p>
                </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center gap-3 mt-12"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="glass px-6 py-3 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
                    >
                        Previous
                    </motion.button>

                    <div className="glass px-6 py-3 rounded-lg flex items-center gap-2">
                        <span className="text-text-primary font-medium">{page}</span>
                        <span className="text-text-muted">/</span>
                        <span className="text-text-secondary">{totalPages}</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="glass px-6 py-3 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
                    >
                        Next
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
}
