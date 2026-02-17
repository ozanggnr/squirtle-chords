/**
 * Loading Skeleton Component
 * Shimmer animation for loading states
 */

import { motion } from 'framer-motion';

interface SkeletonProps {
    type?: 'card' | 'detail' | 'hero';
}

export default function Skeleton({ type = 'card' }: SkeletonProps) {
    if (type === 'card') {
        return (
            <div className="glass rounded-xl p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 space-y-2">
                        <div className="h-6 bg-white/10 rounded shimmer w-3/4" />
                        <div className="h-4 bg-white/5 rounded shimmer w-1/2" />
                    </div>
                    <div className="h-6 w-16 bg-white/10 rounded-full shimmer ml-3" />
                </div>

                <div className="glass rounded-lg p-3 bg-bg-secondary/30 mb-4">
                    <div className="space-y-2">
                        <div className="h-3 bg-white/5 rounded shimmer w-full" />
                        <div className="h-3 bg-white/5 rounded shimmer w-5/6" />
                        <div className="h-3 bg-white/5 rounded shimmer w-4/6" />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="h-3 bg-white/5 rounded shimmer w-24" />
                    <div className="h-3 bg-white/5 rounded shimmer w-16" />
                </div>
            </div>
        );
    }

    if (type === 'detail') {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="space-y-4">
                    <div className="h-12 bg-white/10 rounded shimmer w-2/3" />
                    <div className="h-6 bg-white/5 rounded shimmer w-1/3" />
                    <div className="flex gap-3">
                        <div className="h-6 w-20 bg-white/10 rounded-full shimmer" />
                        <div className="h-6 w-20 bg-white/10 rounded-full shimmer" />
                    </div>
                </div>

                <div className="glass rounded-xl p-6 space-y-3">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="h-4 bg-white/5 rounded shimmer" style={{ width: `${Math.random() * 30 + 70}%` }} />
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'hero') {
        return (
            <div className="text-center space-y-6 mb-12">
                <div className="h-16 bg-white/10 rounded shimmer w-2/3 mx-auto" />
                <div className="h-14 bg-white/10 rounded-xl shimmer max-w-2xl mx-auto" />
            </div>
        );
    }

    return null;
}

/**
 * Grid of skeleton cards
 */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <Skeleton type="card" />
                </motion.div>
            ))}
        </div>
    );
}
