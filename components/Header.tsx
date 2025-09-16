import React from 'react';
import { DumbbellIcon, LogoutIcon, PlusIcon } from './common/Icons';
import { useTranslation } from '../translations';

interface HeaderProps {
    onLogout: () => void;
    onResetPlan: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onResetPlan }) => {
    const { t, language, setLanguage } = useTranslation();

    return (
        <header className="bg-white/80 backdrop-blur-sm p-4 sticky top-0 z-10 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <DumbbellIcon className="w-8 h-8 text-teal-500" />
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">{t('appName')}</h1>
                </div>
                <div className='flex items-center space-x-4'>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setLanguage('th')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${language === 'th' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                            ไทย
                        </button>
                        <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${language === 'en' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                            EN
                        </button>
                    </div>
                    <button
                        onClick={onResetPlan}
                        className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
                    >
                        <PlusIcon className="w-5 h-5" />
                        {/* FIX: Correctly call the translation function `t` with a key. */}
                        <span>{t('resetPlan')}</span>
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75"
                    >
                        <LogoutIcon className="w-5 h-5" />
                        {/* FIX: Correctly call the translation function `t` with a key. */}
                        <span>{t('logout')}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;