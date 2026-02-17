/**
 * Favorites Page
 * Display user's locally saved favorite songs
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import { songAPI } from '../services/api';
import type { Song } from '../types';
import SongCard from '../components/SongCard';
import { SkeletonGrid } from '../components/Skeleton';
import SEO from '../components/SEO';

export default function FavoritesPage() {
    const { getAllFavorites, count } = useFavorites();
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            setError(null);

            const favorites = getAllFavorites();

            if (favorites.length === 0) {
                setSongs([]);
                setLoading(false);
                return;
            }

            // Fetch all favorite songs
            const promises = favorites.map(fav =>
                songAPI.getSongById(fav.id.toString()).catch(() => null)
            );

            const results = await Promise.all(promises);
            const validSongs = results.filter((song): song is Song => song !== null);

            setSongs(validSongs);
        } catch (err: any) {
            setError(err.message || 'Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <SEO title="My Favorites" />
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-8">My Favorites</h1>
                    <SkeletonGrid count={6} />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <SEO title="My Favorites" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-12 text-center max-w-2xl mx-auto"
                >
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Error Loading Favorites</h2>
                    <p className="text-error mb-6">{error}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={loadFavorites}
                        className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-3 rounded-xl font-semibold shadow-glow"
                    >
                        Try Again
                    </motion.button>
                </motion.div>
            </>
        );
    }

    if (songs.length === 0) {
        return (
            <>
                <SEO title="My Favorites" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-12 text-center max-w-2xl mx-auto"
                >
                    <div className="text-6xl mb-4">❤️</div>
                    <h2 className="text-3xl font-bold gradient-text mb-4">No Favorites Yet</h2>
                    <p className="text-text-secondary mb-8">
                        Start adding songs to your favorites to see them here!
                    </p>
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="/"
                        className="inline-block bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-3 rounded-xl font-semibold shadow-glow"
                    >
                        Browse Songs
                    </motion.a>
                </motion.div>
            </>
        );
    }

    return (
        <>
            <SEO title="My Favorites" />

            <div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">My Favorites</h1>
                    <p className="text-text-secondary">
                        You have <span className="text-accent-primary font-semibold">{count}</span> favorite {count === 1 ? 'song' : 'songs'}
                    </p>
                </div>

                {/* Song Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {songs.map((song, index) => (
                        <SongCard key={song.id} song={song} index={index} />
                    ))}
                </div>
            </div>
        </>
    );
}
