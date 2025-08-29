import React from 'react';
import { MascotIcon, BellIcon, UserIcon } from './icons';

interface HeaderProps {
    onProfileClick: () => void;
    notificationCount: number;
    onBellClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick, notificationCount, onBellClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-gray-900/60 backdrop-blur-lg border-b border-white/10 py-4 px-4 md:px-8">
      <div className="flex items-center justify-between">
        {/* Left Side: Logo and Title */}
        <div className="flex items-center space-x-3">
          <MascotIcon className="w-12 h-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              Money Buddy
            </h1>
            <p className="text-sm text-lime-300/80 font-mono">Geo Safe</p>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button onClick={onBellClick} className="p-2 rounded-full hover:bg-white/10 transition-colors relative">
            <BellIcon className="w-6 h-6 text-white"/>
            {notificationCount > 0 && (
                 <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-900"></span>
            )}
          </button>
          <button onClick={onProfileClick} className="p-2 rounded-full hover:bg-white/10 transition-colors">
             <UserIcon className="w-7 h-7 text-white"/>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
