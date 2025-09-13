import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, GoalType } from '../types';
import { GENDER_OPTIONS, ACTIVITY_LEVEL_OPTIONS, GOAL_TYPE_OPTIONS } from '../constants';
import { DumbbellIcon } from './common/Icons';
import { t } from '../translations';

interface ProfileFormProps {
  onSave: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: Gender.MALE,
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
    goal: {
      type: GoalType.LOSE_WEIGHT,
      details: '',
      equipment: 'Full gym access'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weight || !formData.height || !formData.age || !formData.goal?.details) {
        alert("Please fill out all fields.");
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
            <h1 className="text-4xl font-bold text-slate-800">{t.welcomeMessage}</h1>
            <p className="text-slate-500 mt-2">{t.profileFormTitle}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="weight" className={labelClass}>{t.weight}</label>
                    <input type="number" name="weight" id="weight" required className={inputClass} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="height" className={labelClass}>{t.height}</label>
                    <input type="number" name="height" id="height" required className={inputClass} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="age" className={labelClass}>{t.age}</label>
                    <input type="number" name="age" id="age" required className={inputClass} onChange={handleChange} />
                </div>
            </div>
            
            <div>
                <label htmlFor="gender" className={labelClass}>{t.gender}</label>
                <select name="gender" id="gender" className={inputClass} onChange={handleChange} value={formData.gender}>
                    {GENDER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="activityLevel" className={labelClass}>{t.activityLevel}</label>
                <select name="activityLevel" id="activityLevel" className={inputClass} onChange={handleChange} value={formData.activityLevel}>
                    {ACTIVITY_LEVEL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
            
            <div className="border-t border-slate-200 pt-6">
                <h2 className="text-2xl font-semibold mb-4 text-center text-slate-700">{t.fitnessGoalTitle}</h2>
                 <div>
                    <label htmlFor="goal.type" className={labelClass}>{t.primaryGoal}</label>
                    <select name="goal.type" id="goal.type" className={inputClass} onChange={handleChange} value={formData.goal?.type}>
                        {GOAL_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                 <div className="mt-4">
                    <label htmlFor="goal.details" className={labelClass}>{t.goalDetails}</label>
                    <input type="text" name="goal.details" id="goal.details" placeholder={t.goalDetailsPlaceholder} required className={inputClass} onChange={handleChange} />
                </div>
                <div className="mt-4">
                    <label htmlFor="goal.equipment" className={labelClass}>{t.equipment}</label>
                    <input type="text" name="goal.equipment" id="goal.equipment" placeholder={t.equipmentPlaceholder} required className={inputClass} onChange={handleChange} value={formData.goal?.equipment} />
                </div>
            </div>

            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 text-lg">
                {t.createPlan}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;