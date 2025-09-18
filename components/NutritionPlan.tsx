import React from 'react';
import { NutritionPlan as NutritionPlanType } from '../types';
import { PlateIcon, FireIcon, RefreshIcon } from './common/Icons';
import { useTranslation } from '../translations';

interface NutritionPlanProps {
  plan: NutritionPlanType;
  onRandomizeMeals: () => void;
  isRandomizing: boolean;
}

const MacroCard: React.FC<{ label: string; value: number; unit: string; color: string; children: React.ReactNode }> = ({ label, value, unit, color, children }) => (
    <div className={`bg-slate-50 p-4 rounded-lg flex items-center space-x-4 border-l-4 ${color}`}>
        {children}
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-xl font-bold text-slate-800">{value} <span className="text-sm font-normal">{unit}</span></p>
        </div>
    </div>
);


const NutritionPlan: React.FC<NutritionPlanProps> = ({ plan, onRandomizeMeals, isRandomizing }) => {
  const { t } = useTranslation();

  const mealTypeTranslations: { [key: string]: string } = {
      // FIX: Correctly call the translation function `t` with keys.
      breakfast: t('breakfast'),
      lunch: t('lunch'),
      dinner: t('dinner'),
      snack: t('snack'),
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
      <div className="flex items-center mb-6">
        <PlateIcon className="w-8 h-8 text-emerald-500 mr-4" />
        {/* FIX: Correctly call the translation function `t` with a key. */}
        <h2 className="text-3xl font-bold text-slate-800">{t('nutritionGuideTitle')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* FIX: Correctly call the translation function `t` with keys. */}
        <MacroCard label={t('calories')} value={plan.dailyCalories} unit={t('kcal')} color="border-yellow-400">
            <FireIcon className="w-8 h-8 text-yellow-400" />
        </MacroCard>
        {/* FIX: Correctly call the translation function `t` with a key. */}
        <MacroCard label={t('protein')} value={plan.proteinGrams} unit="g" color="border-red-400">
            {/* FIX: Correctly call the translation function `t` with a key. */}
            <div className="w-8 h-8 text-red-400 font-bold text-2xl flex items-center justify-center">{t('protein_short')}</div>
        </MacroCard>
        {/* FIX: Correctly call the translation function `t` with a key. */}
        <MacroCard label={t('carbs')} value={plan.carbsGrams} unit="g" color="border-blue-400">
            {/* FIX: Correctly call the translation function `t` with a key. */}
            <div className="w-8 h-8 text-blue-400 font-bold text-2xl flex items-center justify-center">{t('carbs_short')}</div>
        </MacroCard>
        {/* FIX: Correctly call the translation function `t` with a key. */}
        <MacroCard label={t('fat')} value={plan.fatGrams} unit="g" color="border-purple-400">
             {/* FIX: Correctly call the translation function `t` with a key. */}
             <div className="w-8 h-8 text-purple-400 font-bold text-2xl flex items-center justify-center">{t('fat_short')}</div>
        </MacroCard>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-emerald-600">{t('sampleMeals')}</h3>
            <button
                onClick={onRandomizeMeals}
                disabled={isRandomizing}
                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                <RefreshIcon className={`w-5 h-5 ${isRandomizing ? 'animate-spin' : ''}`} />
                <span>{isRandomizing ? t('randomizing') : t('randomizeMeals')}</span>
            </button>
        </div>
        <div className="space-y-4">
            {Object.entries(plan.sampleMeals).map(([mealType, description]) => (
                <div key={mealType} className="bg-slate-100 p-4 rounded-lg">
                    <p className="font-semibold capitalize text-lg text-slate-700">{mealTypeTranslations[mealType.toLowerCase()] || mealType}</p>
                    <p className="text-slate-600">{description}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionPlan;
