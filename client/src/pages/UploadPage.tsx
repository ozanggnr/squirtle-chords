/**
 * Upload Page
 * Opens upload modal
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import UploadModal from '../components/UploadModal';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const { toasts, removeToast, success, error } = useToast();
    const navigate = useNavigate();

    const handleClose = () => {
        setIsModalOpen(false);
        navigate('/');
    };

    return (
        <>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <UploadModal
                isOpen={isModalOpen}
                onClose={handleClose}
                onSuccess={success}
                onError={error}
            />

            {!isModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-xl p-12 text-center max-w-2xl mx-auto"
                >
                    <div className="text-6xl mb-4">📤</div>
                    <h2 className="text-3xl font-bold gradient-text mb-4">Upload Your Song</h2>
                    <p className="text-text-secondary mb-6">
                        Share your favorite guitar tabs with the community
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-3 rounded-xl font-semibold shadow-glow"
                    >
                        Open Upload
                    </motion.button>
                </motion.div>
            )}
        </>
    );
}
