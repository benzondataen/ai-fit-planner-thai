import React from 'react';
import { UserProfile, FitnessPlan } from '../types';
import { calculateTDEE } from '../services/tdeeService';
import WorkoutPlan from './WorkoutPlan';
import NutritionPlan from './NutritionPlan';
import { UserIcon, FireIcon } from './common/Icons';
import { useTranslation } from '../translations';

interface DashboardProps {
  profile: UserProfile;
  plan: FitnessPlan;
  onRandomizeMeals: () => void;
  isRandomizing: boolean;
}

const StatCard: React.FC<{ title: string; value: string; children: React.ReactNode }> = ({ title, value, children }) => (
    <div className="bg-white p-4 rounded-lg flex items-center shadow-sm border border-slate-200">
        <div className="p-3 rounded-full bg-slate-100 mr-4">
            {children}
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-xl font-semibold text-slate-800">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ profile, plan, onRandomizeMeals, isRandomizing }) => {
  const { t } = useTranslation();
  const tdee = calculateTDEE(profile);
  const goal = t(`goal_${profile.goal.type.toLowerCase()}` as any);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div>
        {/* FIX: Correctly call the translation function `t` with a key. */}
        <h1 className="text-4xl font-bold mb-2 text-slate-800">{t('dashboardTitle')}</h1>
        {/* FIX: Correctly call the translation function `t` with a key. */}
        <p className="text-lg text-slate-500">{t('dashboardSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* FIX: Correctly call the translation function `t` with a key. */}
        <StatCard title={t('currentWeight')} value={`${profile.weight} kg`}>
            <UserIcon className="w-6 h-6 text-teal-500"/>
        </StatCard>
         {/* FIX: Correctly call the translation function `t` with a key. */}
         <StatCard title={t('height')} value={`${profile.height} cm`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </StatCard>
        {/* FIX: Correctly call the translation function `t` with a key. */}
        <StatCard title={t('goal')} value={goal}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
        </StatCard>
        {/* FIX: Correctly call the translation function `t` with keys. */}
        <StatCard title={t('maintenance')} value={`${tdee} ${t('kcalDay')}`}>
            <FireIcon className="w-6 h-6 text-yellow-500"/>
        </StatCard>
      </div>
      
      <WorkoutPlan plan={plan.workoutPlan} />
      <NutritionPlan plan={plan.nutritionPlan} onRandomizeMeals={onRandomizeMeals} isRandomizing={isRandomizing} />

    </div>
  );
};

export default Dashboard;
