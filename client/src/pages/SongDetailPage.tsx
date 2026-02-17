/**
 * Song Detail Page with Premium ChordViewer
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { songAPI } from '../services/api';
import type { Song } from '../types';
import ChordViewer from '../components/ChordDisplay';
import Skeleton from '../components/Skeleton';

export default function SongDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadSong(id);
        } else {
            setLoading(false);
            setError('Invalid song ID');
        }
    }, [id]);

    const loadSong = async (songId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await songAPI.getSongById(songId);
            setSong(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load song');
            console.error('Error loading song:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Skeleton type="detail" />;
    }

    if (error || !song) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-12 text-center max-w-2xl mx-auto"
            >
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-3xl font-bold text-text-primary mb-2">Song Not Found</h2>
                <p className="text-error mb-8">{error || 'This song doesn\'t exist'}</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-3 rounded-xl font-semibold shadow-glow"
                >
                    Back to Home
                </motion.button>
            </motion.div>
        );
    }

    return (
        <ChordViewer
            title={song.title}
            artist={song.artist}
            content={song.content}
        />
    );
}
