/**
 * Enhanced Layout with PWA Install Prompt and Favorites Link
 */

import { Link, useLocation } from 'react-router-dom';
import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';
import { useFavorites } from '../hooks/useFavorites';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const { isInstallable, promptInstall } = usePWA();
    const { count } = useFavorites();
    const [showInstallBanner, setShowInstallBanner] = useState(true);

    const navLinks = [
        { path: '/', label: 'Browse' },
        { path: '/favorites', label: 'Favorites', badge: count > 0 ? count : undefined },
        { path: '/upload', label: 'Upload' },
        { path: '/add', label: 'Add Song' },
    ];

    const handleInstall = async () => {
        const installed = await promptInstall();
        if (installed) {
            setShowInstallBanner(false);
        }
    };

    return (
        <div className="min-h-screen gradient-bg">
            <div className="particles-bg" />

            {/* PWA Install Banner */}
            <AnimatePresence>
                {isInstallable && showInstallBanner && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-0 left-0 right-0 z-[60] glass border-b border-white/10 py-3"
                    >
                        <div className="container-custom flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📱</span>
                                <div>
                                    <p className="text-text-primary font-medium">Install ChordFlow</p>
                                    <p className="text-xs text-text-muted">Access offline, faster loading</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleInstall}
                                    className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-4 py-2 rounded-lg text-sm font-medium shadow-glow"
                                >
                                    Install
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowInstallBanner(false)}
                                    className="glass px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary"
                                >
                                    Later
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sticky Glass Navigation */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="sticky top-0 z-50 glass border-b border-white/10"
                style={{ marginTop: isInstallable && showInstallBanner ? '60px' : '0' }}
            >
                <div className="container-custom py-4">
                    <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group" aria-label="ChordFlow Home">
                            <motion.span
                                className="text-4xl"
                                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                aria-hidden="true"
                            >
                                🎸
                            </motion.span>
                            <h1 className="text-2xl font-bold gradient-text">
                                ChordFlow
                            </h1>
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex gap-2">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;

                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="relative"
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`
                        px-6 py-2.5 rounded-lg font-medium transition-all duration-300 relative
                        ${isActive
                                                    ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-glow'
                                                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                                }
                      `}
                                        >
                                            {link.label}
                                            {link.badge && (
                                                <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {link.badge > 99 ? '99+' : link.badge}
                                                </span>
                                            )}
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            </motion.header>

            {/* Main Content */}
            <motion.main
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 container-custom py-8 min-h-[calc(100vh-200px)]"
                role="main"
            >
                {children}
            </motion.main>

            {/* Footer */}
            <footer className="relative z-10 glass border-t border-white/10 mt-12" role="contentinfo">
                <div className="container-custom py-8">
                    <div className="text-center space-y-2">
                        <p className="text-text-secondary font-medium">
                            ChordFlow - Free Guitar Chords & Tabs
                        </p>
                        <p className="text-text-muted text-sm">
                            No sign-up required • Open access for all musicians
                        </p>
                        <div className="flex gap-4 justify-center items-center pt-2">
                            <span className="text-xs text-text-muted">Made with</span>
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                                className="text-error"
                                aria-label="love"
                            >
                                ❤️
                            </motion.span>
                            <span className="text-xs text-text-muted">for musicians</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
