import React, { useState } from 'react';
import { WorkoutPlan as WorkoutPlanType } from '../types';
import { DumbbellIcon } from './common/Icons';
import { useTranslation } from '../translations';

interface WorkoutPlanProps {
  plan: WorkoutPlanType;
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ plan }) => {
  const { t, language } = useTranslation();
  const [activeDay, setActiveDay] = useState(plan.weeklySchedule[0]?.day || '');
  
  const todayLocaleDateString = new Date().toLocaleString(language === 'th' ? 'th-TH' : 'en-US', { weekday: 'long' });
  const today = todayLocaleDateString.charAt(0).toUpperCase() + todayLocaleDateString.slice(1);

  React.useEffect(() => {
     const todaySchedule = plan.weeklySchedule.find(d => d.day === today);
     if(todaySchedule) {
         setActiveDay(today);
     } else if (plan.weeklySchedule.length > 0) {
        // Fallback to the first available day if today is not a workout day
        setActiveDay(plan.weeklySchedule.filter(d => d.exercises.length > 0)[0]?.day || plan.weeklySchedule[0]?.day);
     }
  }, [plan, today]);

  const activeSchedule = plan.weeklySchedule.find(d => d.day === activeDay);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
      <div className="flex items-center mb-6">
        <DumbbellIcon className="w-8 h-8 text-teal-500 mr-4" />
        {/* FIX: Correctly call the translation function `t` with a key. */}
        <h2 className="text-3xl font-bold text-slate-800">{t('workoutPlanTitle')}</h2>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {plan.weeklySchedule.map(({ day }) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition whitespace-nowrap ${
              activeDay === day ? 'bg-teal-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            {/* FIX: Correctly call the translation function `t` with a key. */}
            {day} {day === today ? `(${t('today')})` : ''}
          </button>
        ))}
      </div>

      {activeSchedule && (
        <div className="bg-slate-50 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold text-teal-700 mb-4">{activeSchedule.focus}</h3>
          {activeSchedule.exercises.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-200">
                  <tr>
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <th className="px-4 py-3">{t('exercise')}</th>
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <th className="px-4 py-3 text-center">{t('sets')}</th>
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <th className="px-4 py-3 text-center">{t('reps')}</th>
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <th className="px-4 py-3 text-center">{t('rest')}</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSchedule.exercises.map((ex, index) => (
                    <tr key={index} className="border-b border-slate-200 hover:bg-slate-100">
                      <td className="px-4 py-4 font-medium text-slate-800">{ex.name}</td>
                      <td className="px-4 py-4 text-center text-slate-600">{ex.sets}</td>
                      <td className="px-4 py-4 text-center text-slate-600">{ex.reps}</td>
                      <td className="px-4 py-4 text-center text-slate-600">{ex.rest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // FIX: Correctly call the translation function `t` with a key.
            <p className="text-center text-slate-500 py-8 text-lg">{t('restDayMessage')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;