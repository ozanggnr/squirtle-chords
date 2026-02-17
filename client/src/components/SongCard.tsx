/**
 * Enhanced SongCard with Favorite Button
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../hooks/useToast';
import type { Song } from '../types';

interface SongCardProps {
    song: Song;
    index?: number;
}

export default function SongCard({ song, index = 0 }: SongCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { success, error } = useToast();
    const favorited = isFavorite(song.id);

    const badgeColors = {
        manual: 'from-blue-500 to-blue-600',
        upload: 'from-green-500 to-emerald-600',
        api: 'from-purple-500 to-purple-600',
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            toggleFavorite(song.id);
            if (favorited) {
                success('Removed from favorites');
            } else {
                success('Added to favorites');
            }
        } catch (err: any) {
            error(err.message || 'Failed to update favorites');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
        >
            <Link to={`/song/${song.id}`}>
                <motion.div
                    whileHover={{
                        scale: 1.02,
                        y: -4,
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="glass rounded-xl p-6 hover:shadow-glow transition-all duration-300 h-full flex flex-col group relative"
                >
                    {/* Favorite Button */}
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleFavoriteClick}
                        className="absolute top-4 right-4 z-10 text-2xl"
                        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {favorited ? '❤️' : '🤍'}
                    </motion.button>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 pr-8">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-text-primary mb-1 truncate group-hover:text-gradient transition-all">
                                {song.title}
                            </h3>
                            <p className="text-text-secondary truncate">{song.artist}</p>
                        </div>

                        {/* Source Badge */}
                        <motion.span
                            whileHover={{ scale: 1.1 }}
                            className={`
                ml-3 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                bg-gradient-to-r ${badgeColors[song.source]} text-white shadow-lg
              `}
                        >
                            {song.source}
                        </motion.span>
                    </div>

                    {/* Content Preview */}
                    <div className="flex-1 mb-4">
                        <div className="glass rounded-lg p-3 bg-bg-secondary/30">
                            <pre className="text-xs text-text-muted font-mono line-clamp-3 overflow-hidden">
                                {song.content.substring(0, 120)}...
                            </pre>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{new Date(song.createdAt).toLocaleDateString()}</span>
                        </div>

                        {song.fileType && (
                            <span className="px-2 py-0.5 rounded bg-white/5 text-text-secondary uppercase">
                                {song.fileType}
                            </span>
                        )}
                    </div>

                    {/* Hover Indicator */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mt-3 text-accent-primary text-sm font-medium"
                    >
                        <span>View Chords</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.div>
                </motion.div>
            </Link>
        </motion.div>
    );
}
