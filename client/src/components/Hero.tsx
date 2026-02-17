/**
 * Hero Section Component
 * Animated search bar with gradient text
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
    onSearch?: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim() && onSearch) {
            onSearch(searchQuery);
        }
    };

    return (
        <div className="text-center space-y-8 mb-16">
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
            >
                <h1 className="text-5xl md:text-7xl font-bold gradient-text leading-tight">
                    Discover Your Next
                    <br />
                    Favorite Song
                </h1>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                    Free guitar chords and tabs for musicians. No sign-up, no limits.
                </p>
            </motion.div>

            {/* Animated Search Bar */}
            <motion.form
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                onSubmit={handleSearch}
                className="max-w-2xl mx-auto"
            >
                <motion.div
                    animate={{
                        boxShadow: isFocused
                            ? '0 0 30px rgba(139, 92, 246, 0.4)'
                            : '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}
                    className="glass rounded-2xl p-2 flex items-center gap-3 transition-all duration-300"
                >
                    {/* Search Icon */}
                    <div className="pl-4 text-accent-primary">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Input */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search songs, artists, or chords..."
                        className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none text-lg py-3"
                    />

                    {/* Search Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-3 rounded-xl font-semibold shadow-glow hover:shadow-glow-cyan transition-all duration-300"
                    >
                        Search
                    </motion.button>
                </motion.div>
            </motion.form>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-wrap gap-4 justify-center"
            >
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/upload')}
                    className="glass px-6 py-3 rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
                >
                    <svg className="w-5 h-5 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-text-primary font-medium">Upload PDF/Word</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/add')}
                    className="glass px-6 py-3 rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
                >
                    <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-text-primary font-medium">Add Manually</span>
                </motion.button>
            </motion.div>
        </div>
    );
}
