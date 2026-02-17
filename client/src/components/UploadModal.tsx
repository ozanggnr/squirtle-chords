/**
 * Upload Modal Component
 * Drag & drop file upload with glassmorphism
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { songAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export default function UploadModal({ isOpen, onClose, onSuccess, onError }: UploadModalProps) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type.includes('word'))) {
            setFile(droppedFile);
        } else {
            onError('Please upload a PDF or Word document');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !artist || !file) {
            onError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setUploadProgress(0);

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const song = await songAPI.uploadFile(title, artist, file);

            clearInterval(progressInterval);
            setUploadProgress(100);

            onSuccess('Song uploaded successfully!');
            setTimeout(() => {
                navigate(`/song/${song.id}`);
            }, 500);
        } catch (err: any) {
            onError(err.response?.data?.error || err.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-bold gradient-text">Upload Song</h2>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="text-text-muted hover:text-text-primary transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title & Artist */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Song Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full glass px-4 py-3 rounded-lg focus:ring-2 focus:ring-accent-primary outline-none text-text-primary"
                                            placeholder="Enter song title"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Artist *
                                        </label>
                                        <input
                                            type="text"
                                            value={artist}
                                            onChange={(e) => setArtist(e.target.value)}
                                            className="w-full glass px-4 py-3 rounded-lg focus:ring-2 focus:ring-accent-primary outline-none text-text-primary"
                                            placeholder="Enter artist name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Drag & Drop Zone */}
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        File Upload *
                                    </label>

                                    <motion.div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        animate={{
                                            borderColor: isDragging ? 'rgb(139, 92, 246)' : 'rgba(255, 255, 255, 0.1)',
                                            boxShadow: isDragging ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none',
                                        }}
                                        className="glass border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-accent-primary/50 transition-all"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.docx"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />

                                        {file ? (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="space-y-3"
                                            >
                                                <div className="text-5xl">📄</div>
                                                <p className="text-text-primary font-medium">{file.name}</p>
                                                <p className="text-sm text-text-muted">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFile(null);
                                                    }}
                                                    className="text-error hover:underline text-sm"
                                                >
                                                    Remove
                                                </motion.button>
                                            </motion.div>
                                        ) : (
                                            <div className="space-y-3">
                                                <motion.div
                                                    animate={{ y: [0, -10, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="text-6xl"
                                                >
                                                    📁
                                                </motion.div>
                                                <p className="text-text-primary font-medium">
                                                    {isDragging ? 'Drop file here' : 'Drag & drop or click to upload'}
                                                </p>
                                                <p className="text-sm text-text-muted">
                                                    Supported: PDF, DOCX (Max 10MB)
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Progress Bar */}
                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-2"
                                    >
                                        <div className="flex justify-between text-sm text-text-secondary">
                                            <span>Uploading...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="h-2 glass rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                                className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-4 rounded-xl font-semibold shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Uploading...' : 'Upload Song'}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={onClose}
                                        disabled={loading}
                                        className="glass px-8 py-4 rounded-xl font-semibold hover:bg-white/5 disabled:opacity-50"
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
