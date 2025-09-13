import React from 'react';
import { DumbbellIcon, LogoutIcon } from './common/Icons';
import { t } from '../translations';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    return (
        <header className="bg-white/80 backdrop-blur-sm p-4 sticky top-0 z-10 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <DumbbellIcon className="w-8 h-8 text-teal-500" />
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">{t.appName}</h1>
                </div>
                <div className='flex items-center space-x-4'>
                    <button
                        onClick={onLogout}
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75"
                    >
                        <LogoutIcon className="w-5 h-5" />
                        <span>{t.logout}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;