import React from 'react';
import { useTranslation } from '../translations';

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow-xl">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 mb-4"></div>
        <p className="text-xl font-semibold text-slate-700">{message}</p>
        {/* FIX: Correctly call the translation function `t` with a key. */}
        <p className="text-sm text-slate-500 mt-2">{t('aiIsCrafting')}</p>
    </div>
  );
};

export default LoadingSpinner;