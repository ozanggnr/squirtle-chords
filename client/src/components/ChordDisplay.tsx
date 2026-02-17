/**
 * Enhanced ChordViewer with Syntax Highlighting
 * Premium practice mode with smart chord rendering
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseContent, formatForDisplay } from '../utils/chordUtils';
import { transposeContent, getCapoText, getTransposeText } from '../utils/transposeUtils';

interface ChordViewerProps {
    title: string;
    artist: string;
    content: string;
}

export default function ChordViewer({ title, artist, content }: ChordViewerProps) {
    const [fontSize, setFontSize] = useState(16);
    const [isAutoScroll, setIsAutoScroll] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(1);
    const [viewMode, setViewMode] = useState<'full' | 'chords'>('full');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [copied, setCopied] = useState(false);
    const [transpose, setTranspose] = useState(0); // Transpose amount (-6 to +6)
    const contentRef = useRef<HTMLDivElement>(null);
    const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Apply transpose to content
    const transposedContent = useMemo(() => {
        return transposeContent(content, transpose);
    }, [content, transpose]);

    // Parse and format content
    const displayContent = useMemo(() => {
        return formatForDisplay(transposedContent, viewMode === 'chords');
    }, [transposedContent, viewMode]);

    const parsedLines = useMemo(() => {
        return parseContent(displayContent);
    }, [displayContent]);

    // Auto-scroll logic
    useEffect(() => {
        if (isAutoScroll && contentRef.current) {
            scrollIntervalRef.current = setInterval(() => {
                if (contentRef.current) {
                    contentRef.current.scrollTop += scrollSpeed;

                    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
                    if (scrollTop + clientHeight >= scrollHeight) {
                        setIsAutoScroll(false);
                    }
                }
            }, 50);
        } else {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
            }
        }

        return () => {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
            }
        };
    }, [isAutoScroll, scrollSpeed]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className={`fixed inset-0 z-50 ${theme === 'dark' ? 'bg-bg-primary' : 'bg-white'} overflow-hidden`}>
            {/* Toolbar */}
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`glass border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} sticky top-0 z-10`}
            >
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Song Info */}
                        <div>
                            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-text-primary' : 'text-gray-900'}`}>
                                {title}
                            </h2>
                            <p className={`text-sm ${theme === 'dark' ? 'text-text-secondary' : 'text-gray-600'}`}>
                                {artist}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-6 flex-wrap">
                            {/* Transpose Controls */}
                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setTranspose(Math.max(-6, transpose - 1))}
                                    disabled={transpose <= -6}
                                    className={`w-8 h-8 rounded-lg font-bold ${theme === 'dark' ? 'glass hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
                                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                                    aria-label="Transpose down"
                                >
                                    −
                                </motion.button>
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <span className={`text-xs ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                                        Transpose
                                    </span>
                                    <span className={`text-lg font-bold ${theme === 'dark' ? 'text-accent-primary' : 'text-purple-600'}`}>
                                        {getTransposeText(transpose)}
                                    </span>
                                    <span className={`text-xs ${theme === 'dark' ? 'text-text-secondary' : 'text-gray-600'}`}>
                                        {getCapoText(transpose)}
                                    </span>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setTranspose(Math.min(6, transpose + 1))}
                                    disabled={transpose >= 6}
                                    className={`w-8 h-8 rounded-lg font-bold ${theme === 'dark' ? 'glass hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
                                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                                    aria-label="Transpose up"
                                >
                                    +
                                </motion.button>
                            </div>

                            {/* Font Size */}
                            <div className="flex items-center gap-3">
                                <span className={`text-sm ${theme === 'dark' ? 'text-text-secondary' : 'text-gray-600'}`}>Aa-</span>
                                <input
                                    type="range"
                                    min="12"
                                    max="28"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-24 accent-accent-primary"
                                />
                                <span className={`text-sm ${theme === 'dark' ? 'text-text-secondary' : 'text-gray-600'}`}>Aa+</span>
                            </div>

                            {/* Auto-scroll */}
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsAutoScroll(!isAutoScroll)}
                                    className={`
                    px-4 py-2 rounded-lg font-medium transition-all
                    ${isAutoScroll
                                            ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-glow'
                                            : theme === 'dark' ? 'glass hover:bg-white/5' : 'bg-gray-100 hover:bg-gray-200'
                                        }
                  `}
                                >
                                    {isAutoScroll ? '⏸ Pause' : '▶ Auto-scroll'}
                                </motion.button>

                                {isAutoScroll && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="3"
                                            step="0.5"
                                            value={scrollSpeed}
                                            onChange={(e) => setScrollSpeed(Number(e.target.value))}
                                            className="w-20 accent-accent-primary"
                                        />
                                        <span className={`text-xs ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                                            {scrollSpeed}x
                                        </span>
                                    </motion.div>
                                )}
                            </div>

                            {/* View Mode */}
                            <div className={`flex rounded-lg p-1 ${theme === 'dark' ? 'glass' : 'bg-gray-100'}`}>
                                <button
                                    onClick={() => setViewMode('full')}
                                    className={`
                    px-4 py-1.5 rounded text-sm font-medium transition-all
                    ${viewMode === 'full'
                                            ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                                            : theme === 'dark' ? 'text-text-secondary' : 'text-gray-600'
                                        }
                  `}
                                >
                                    Full
                                </button>
                                <button
                                    onClick={() => setViewMode('chords')}
                                    className={`
                    px-4 py-1.5 rounded text-sm font-medium transition-all
                    ${viewMode === 'chords'
                                            ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                                            : theme === 'dark' ? 'text-text-secondary' : 'text-gray-600'
                                        }
                  `}
                                >
                                    Chords Only
                                </button>
                            </div>

                            {/* Theme & Copy */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className={`p-2 rounded-lg ${theme === 'dark' ? 'glass hover:bg-white/5' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCopy}
                                className={`px-4 py-2 rounded-lg font-medium ${theme === 'dark' ? 'glass hover:bg-white/5' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                {copied ? '✓ Copied' : '📋 Copy'}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Chord Content with Syntax Highlighting */}
            <div
                ref={contentRef}
                className="h-[calc(100vh-100px)] overflow-y-auto px-4 py-8"
                style={{ scrollBehavior: isAutoScroll ? 'auto' : 'smooth' }}
            >
                <div className="max-w-4xl mx-auto">
                    {parsedLines.map((line, index) => (
                        <div key={index} className="leading-relaxed">
                            {line.isChord ? (
                                <pre
                                    className={`font-mono font-semibold ${theme === 'dark' ? 'text-accent-primary' : 'text-purple-600'}`}
                                    style={{ fontSize: `${fontSize}px` }}
                                    dangerouslySetInnerHTML={{ __html: line.highlighted || line.content }}
                                />
                            ) : (
                                <pre
                                    className={`font-mono ${theme === 'dark' ? 'text-text-primary' : 'text-gray-900'}`}
                                    style={{ fontSize: `${fontSize}px` }}
                                >
                                    {line.content}
                                </pre>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Auto-scroll Indicator */}
            <AnimatePresence>
                {isAutoScroll && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 glass px-6 py-3 rounded-full shadow-glow"
                    >
                        <div className="flex items-center gap-3">
                            <div className="animate-pulse w-2 h-2 bg-accent-primary rounded-full" />
                            <span className="text-text-primary font-medium">Auto-scrolling at {scrollSpeed}x speed</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chord Highlighting CSS */}
            <style>{`
        .chord {
          color: rgb(var(--accent-primary));
          font-weight: 600;
          background: rgba(139, 92, 246, 0.1);
          padding: 0 4px;
          border-radius: 4px;
          display: inline-block;
        }
      `}</style>
        </div>
    );
}
