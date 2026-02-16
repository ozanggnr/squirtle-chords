'use client';

import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400 mb-8">Manage your account preferences</p>

            <div className="space-y-6">
                <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <SettingsIcon size={20} />
                        Account Settings
                    </h2>
                    <p className="text-gray-400">Settings coming soon...</p>
                </div>
            </div>
        </div>
    );
}
