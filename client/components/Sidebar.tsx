import Link from 'next/link';
import { Home, Music, Globe, Settings, Upload } from 'lucide-react';
import Mascot from './Mascot';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 border-r border-gray-800 h-screen sticky top-0 flex flex-col shadow-2xl">
            {/* Logo/Brand with glow */}
            <div className="relative p-6 border-b border-gray-800">
                <div className="absolute inset-0 bg-blue-500/5 blur-xl"></div>
                <div className="relative flex items-center gap-3">
                    <Mascot size={50} showAnimation={false} />
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
                            Squirtle Chords
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">Free Tabs & Chords</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-800/50 text-gray-300 hover:text-white transition-all group">
                    <Home size={20} className="group-hover:scale-110 transition-transform" />
                    Home
                </Link>

                <Link href="/?language=Turkish" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-800/50 text-gray-300 hover:text-white transition-all group">
                    <Music size={20} className="group-hover:scale-110 transition-transform" />
                    Turkish Songs
                </Link>

                <Link href="/?language=English" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-800/50 text-gray-300 hover:text-white transition-all group">
                    <Globe size={20} className="group-hover:scale-110 transition-transform" />
                    English Songs
                </Link>

                <Link href="/favorites" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-800/50 text-gray-300 hover:text-white transition-all group">
                    <Music size={20} className="group-hover:scale-110 transition-transform" />
                    My Favorites
                </Link>

                <Link href="/upload" className="relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white transition-all shadow-lg shadow-blue-900/50 group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Upload size={20} className="relative group-hover:scale-110 transition-transform" />
                    <span className="relative">Upload Song</span>
                </Link>
            </nav>

            {/* Settings */}
            <div className="p-4 border-t border-gray-800">
                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-800/50 text-gray-300 hover:text-white transition-all group">
                    <Settings size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    Settings
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
