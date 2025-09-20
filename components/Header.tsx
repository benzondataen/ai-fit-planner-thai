import React, { useState } from 'react';
import { DumbbellIcon, LogoutIcon, PlusIcon } from './common/Icons';
import { useTranslation } from '../translations';

interface HeaderProps {
    onLogout: () => void;
    onResetPlan: () => void;
    onNavigate: (view: 'dashboard' | 'foodTracker') => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onResetPlan, onNavigate }) => {
    const { t, language, setLanguage } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white/80 backdrop-blur-sm p-4 sticky top-0 z-10 shadow-md">
            <div className="container mx-auto flex justify-between items-center relative">
                <div className="flex items-center space-x-3">
                    <DumbbellIcon className="w-8 h-8 text-teal-500" />
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">{t('appName')}</h1>
                </div>
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-800 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h4"></path>
                        </svg>
                    </button>
                </div>
                <nav className={`md:flex flex-col md:flex-row md:items-center md:space-x-4 ${isMobileMenuOpen ? 'flex absolute top-full left-0 w-full bg-white/90 backdrop-blur-sm shadow-md py-2 px-4' : 'hidden'}`}>
                    <div className="flex flex-row items-center space-x-2 mt-2 md:mt-0">
                        <button onClick={() => { setLanguage('th'); setIsMobileMenuOpen(false); }} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${language === 'th' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                            ไทย
                        </button>
                        <button onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${language === 'en' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                            EN
                        </button>
                    </div>
                    <button
                        onClick={() => { onNavigate('dashboard'); setIsMobileMenuOpen(false); }}
                        className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 mt-2 md:mt-0"
                    >
                        <span>{t('dashboard')}</span>
                    </button>
                    <button
                        onClick={() => { onNavigate('foodTracker'); setIsMobileMenuOpen(false); }}
                        className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 mt-2 md:mt-0"
                    >
                        <span>{t('foodTracker.title')}</span>
                    </button>
                    <button
                        onClick={() => { onResetPlan(); setIsMobileMenuOpen(false); }}
                        className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 mt-2 md:mt-0"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>{t('resetPlan')}</span>
                    </button>
                    <button
                        onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 mt-2 md:mt-0"
                    >
                        <LogoutIcon className="w-5 h-5" />
                        <span>{t('logout')}</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;