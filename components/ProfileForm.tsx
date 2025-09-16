import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, GoalType } from '../types';
import { GENDER_OPTIONS, ACTIVITY_LEVEL_OPTIONS, GOAL_TYPE_OPTIONS } from '../constants';
import { DumbbellIcon } from './common/Icons';
import { useTranslation } from '../translations';

interface ProfileFormProps {
  onSave: (profile: UserProfile) => void;
}

const WEEK_DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

const ProfileForm: React.FC<ProfileFormProps> = ({ onSave }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: Gender.MALE,
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
    workoutDays: ['จันทร์', 'พุธ', 'ศุกร์'], // Default workout days
    goal: {
      type: GoalType.LOSE_WEIGHT,
      details: '',
      // FIX: Correctly call the translation function `t` with a key.
      equipment: t('defaultEquipment'),
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('goal.')) {
        const goalField = name.split('.')[1] as keyof UserProfile['goal'];
        setFormData(prev => ({
            ...prev,
            goal: {
                ...prev.goal!,
                [goalField]: value
            }
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDayChange = (day: string) => {
    setFormData(prev => {
        const currentDays = prev.workoutDays || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];
        return { ...prev, workoutDays: newDays };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weight || !formData.height || !formData.age || !formData.goal?.details || !formData.workoutDays || formData.workoutDays.length === 0) {
        // FIX: Correctly call the translation function `t` with a key.
        alert(t('fillAllFields'));
        return;
    }
    onSave(formData as UserProfile);
  };
  
  const inputClass = "w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-slate-800";
  const labelClass = "block mb-2 text-sm font-medium text-slate-600";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <div className="text-center mb-8">
            <DumbbellIcon className="w-16 h-16 text-teal-500 mx-auto mb-4" />
            {/* FIX: Correctly call the translation function `t` with a key. */}
            <h1 className="text-4xl font-bold text-slate-800">{t('welcomeMessage')}</h1>
            {/* FIX: Correctly call the translation function `t` with a key. */}
            <p className="text-slate-500 mt-2">{t('profileFormTitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <label htmlFor="weight" className={labelClass}>{t('weight')}</label>
                    <input type="number" name="weight" id="weight" required className={inputClass} onChange={handleChange} />
                </div>
                <div>
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <label htmlFor="height" className={labelClass}>{t('height')}</label>
                    <input type="number" name="height" id="height" required className={inputClass} onChange={handleChange} />
                </div>
                <div>
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <label htmlFor="age" className={labelClass}>{t('age')}</label>
                    <input type="number" name="age" id="age" required className={inputClass} onChange={handleChange} />
                </div>
            </div>
            
            <div>
                {/* FIX: Correctly call the translation function `t` with a key. */}
                <label htmlFor="gender" className={labelClass}>{t('gender')}</label>
                <select name="gender" id="gender" className={inputClass} onChange={handleChange} value={formData.gender}>
                    {GENDER_OPTIONS.map(opt => <option key={opt} value={opt}>{t(`gender_${opt.toLowerCase()}` as any)}</option>)}
                </select>
            </div>

            <div>
                {/* FIX: Correctly call the translation function `t` with a key. */}
                <label htmlFor="activityLevel" className={labelClass}>{t('activityLevel')}</label>
                <select name="activityLevel" id="activityLevel" className={inputClass} onChange={handleChange} value={formData.activityLevel}>
                    {ACTIVITY_LEVEL_OPTIONS.map(opt => <option key={opt} value={opt}>{t(`activity_${opt.toLowerCase()}` as any)}</option>)}
                </select>
            </div>
            
            <div className="border-t border-slate-200 pt-6">
                {/* FIX: Correctly call the translation function `t` with a key. */}
                <h2 className="text-2xl font-semibold mb-4 text-center text-slate-700">{t('fitnessGoalTitle')}</h2>
                 <div>
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <label htmlFor="goal.type" className={labelClass}>{t('primaryGoal')}</label>
                    <select name="goal.type" id="goal.type" className={inputClass} onChange={handleChange} value={formData.goal?.type}>
                        {GOAL_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{t(`goal_${opt.toLowerCase()}` as any)}</option>)}
                    </select>
                </div>
                 <div className="mt-4">
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <label htmlFor="goal.details" className={labelClass}>{t('goalDetails')}</label>
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <input type="text" name="goal.details" id="goal.details" placeholder={t('goalDetailsPlaceholder')} required className={inputClass} onChange={handleChange} />
                </div>
                <div className="mt-4">
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <label htmlFor="goal.equipment" className={labelClass}>{t('equipment')}</label>
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <input type="text" name="goal.equipment" id="goal.equipment" placeholder={t('equipmentPlaceholder')} required className={inputClass} onChange={handleChange} value={formData.goal?.equipment} />
                </div>
                 <div className="mt-4">
                    {/* FIX: Correctly call the translation function `t` with a key. */}
                    <label className={labelClass}>{t('workoutDays')}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {WEEK_DAYS.map(day => (
                            <label key={day} className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition ${formData.workoutDays?.includes(day) ? 'bg-teal-100 border-teal-500 text-teal-800' : 'bg-slate-100 border-slate-300'}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.workoutDays?.includes(day)}
                                    onChange={() => handleDayChange(day)}
                                    className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-teal-500"
                                />
                                <span>{day}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 text-lg">
                {/* FIX: Correctly call the translation function `t` with a key. */}
                {t('createPlan')}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;