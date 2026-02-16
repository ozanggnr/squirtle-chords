'use client';

import { Heart } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export default function FavoritesPage() {
    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white mb-2">Favorites</h1>
            <p className="text-gray-400 mb-8">Your saved songs</p>

            <EmptyState
                icon={<Heart size={64} />}
                title="No favorites yet"
                description="Songs you favorite will appear here for quick access"
            />
        </div>
    );
}
