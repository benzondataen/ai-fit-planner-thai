import React, { useState, useEffect } from 'react';
import { useTranslation } from '../translations';
import { analyzeFoodItem } from '../services/geminiService';
import { saveMealEntry, getDailyMealEntries } from '../services/firestoreService';
import { useAuth } from '../hooks/useAuth';
import { RefreshIcon } from './common/Icons';
import { MealEntry, NutrientData } from '../types';

const FoodTracker: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [mealName, setMealName] = useState('');
    const [mealInput, setMealInput] = useState<string | File | null>(null);
    const [analysisResult, setAnalysisResult] = useState<{ mealTitle: string; calories: number; nutrients: NutrientData; description?: string } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCalories, setEditedCalories] = useState<number | null>(null);
    const [editedNutrients, setEditedNutrients] = useState<NutrientData | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [dailyMeals, setDailyMeals] = useState<MealEntry[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const handleManualInput = () => {
        setMealInput(mealName);
        setAnalysisResult(null);
        setIsEditing(false);
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setImagePreviewUrl(null);
    };

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setMealInput(file);
            setMealName(''); // Clear meal name if photo is uploaded
            setAnalysisResult(null);
            setIsEditing(false);

            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            const newImageUrl = URL.createObjectURL(file);
            setImagePreviewUrl(newImageUrl);
        }
    };

    const handleAnalyze = async () => {
        if (!mealName && !mealInput) {
            alert(t('foodTracker.noInputError'));
            return;
        }

        setIsAnalyzing(true);
        setAnalysisResult(null);
        setEditedCalories(null);
        setEditedNutrients(null);

        try {
            const result = await analyzeFoodItem(mealInput || mealName);
            setAnalysisResult({
                mealTitle: result.mealTitle,
                calories: result.calories,
                nutrients: { protein: result.protein, carbs: result.carbs, fat: result.fat },
                description: result.description
            });
            setEditedCalories(result.calories);
            setEditedNutrients({ protein: result.protein, carbs: result.carbs, fat: result.fat });

            // If mealName is empty and a mealTitle is provided, use it as the meal name
            if (!mealName && result.mealTitle) {
                setMealName(result.mealTitle);
            }
        } catch (error) {
            console.error("Error during food analysis:", error);
            alert(t('foodTracker.analysisError'));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const fetchDailyMeals = async () => {
        if (user) {
            const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
            try {
                const meals = await getDailyMealEntries(user.uid, formattedDate);
                setDailyMeals(meals);
            } catch (error) {
                console.error("Error fetching daily meals:", error);
                alert(t('foodTracker.fetchMealsError'));
            }
        }
    };

    useEffect(() => {
        fetchDailyMeals();
    }, [user, currentDate]); // Re-fetch when user or date changes

    const handleSaveMeal = async () => {
        if (!user) {
            alert(t('loginRequired'));
            return;
        }
        if (!analysisResult || !editedCalories || !editedNutrients) {
            alert(t('foodTracker.noAnalysisResult'));
            return;
        }

        const mealToSave: MealEntry = {
            userId: user.uid,
            mealName: mealName || t('foodTracker.unnamedMeal'),
            calories: editedCalories,
            protein: editedNutrients?.protein || 0,
            carbs: editedNutrients?.carbs || 0,
            fat: editedNutrients?.fat || 0,
            description: analysisResult.description,
            imageUrl: imagePreviewUrl || null,
            timestamp: new Date(),
        };

        try {
            await saveMealEntry(user.uid, mealToSave);
            alert(t('foodTracker.savedSuccessfully'));
            // Reset state after saving
            setMealName('');
            setMealInput(null);
            setAnalysisResult(null);
            setEditedCalories(null);
            setEditedNutrients(null);
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            setImagePreviewUrl(null);
            fetchDailyMeals(); // Refresh the list of daily meals
        } catch (error) {
            console.error("Error saving meal:", error);
            alert(t('foodTracker.saveMealError'));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">{t('foodTracker.title')}</h2>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold text-slate-700 mb-4">{t('foodTracker.addMeal')}</h3>
                <div className="mb-4">
                    <label htmlFor="mealName" className="block text-sm font-medium text-slate-600 mb-2">{t('foodTracker.mealName')}</label>
                    <input
                        type="text"
                        id="mealName"
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                        value={mealName}
                        onChange={(e) => setMealName(e.target.value)}
                        placeholder={t('foodTracker.mealNamePlaceholder')}
                    />
                </div>

                <div className="flex items-center space-x-4 mb-4">
                    <button
                        onClick={handleManualInput}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition duration-300"
                    >
                        {t('foodTracker.enterManually')}
                    </button>
                    <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 cursor-pointer">
                        {t('foodTracker.uploadPhoto')}
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                </div>

                {mealInput && typeof mealInput === 'object' && (
                    <p className="text-sm text-slate-500 mb-4">{t('foodTracker.selectedFile')}: {mealInput.name}</p>
                )}

                {imagePreviewUrl && (
                    <div className="mb-4">
                        <img src={imagePreviewUrl} alt="Meal Preview" className="max-w-full h-auto rounded-lg shadow-md" />
                    </div>
                )}

                <button
                    onClick={handleAnalyze}
                    className={`w-full px-4 py-2 text-white font-semibold rounded-lg transition duration-300 flex items-center justify-center space-x-2 ${isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    disabled={isAnalyzing || (!mealName && !mealInput)}
                >
                    {isAnalyzing && <RefreshIcon className={`w-5 h-5 animate-spin`} />}
                    <span>{isAnalyzing ? t('foodTracker.analyzing') : t('foodTracker.analyzeMeal')}</span>
                </button>
            </div>

            {analysisResult && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-xl font-semibold text-slate-700 mb-4">{t('foodTracker.analysisResults')}</h3>
                    {analysisResult.description && (
                        <div className="mb-4">
                            <p className="text-sm text-slate-700"><strong>{t('foodTracker.description')}:</strong> {analysisResult.description}</p>
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="calories" className="block text-sm font-medium text-slate-600 mb-2">{t('foodTracker.calories')}</label>
                        <input
                            type="number"
                            id="calories"
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            value={isEditing ? editedCalories || '' : analysisResult.calories}
                            onChange={(e) => { setIsEditing(true); setEditedCalories(Number(e.target.value)); }}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="nutrients" className="block text-sm font-medium text-slate-600 mb-2">{t('foodTracker.nutrients')}</label>
                        <textarea
                            id="nutrients"
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            rows={4}
                            value={isEditing ? JSON.stringify(editedNutrients || {}, null, 2) : JSON.stringify(analysisResult.nutrients, null, 2)}
                            onChange={(e) => { setIsEditing(true); setEditedNutrients(JSON.parse(e.target.value)); }}
                        ></textarea>
                    </div>
                    <button
                        onClick={handleSaveMeal}
                        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-300"
                    >
                        {t('foodTracker.saveMeal')}
                    </button>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-slate-700 mb-4">{t('foodTracker.dailySummary')} ({currentDate.toLocaleDateString()})</h3>
                
                {dailyMeals.length === 0 ? (
                    <p className="text-slate-500">{t('foodTracker.noMealsRecorded')}</p>
                ) : (
                    <div className="space-y-4">
                        {(Object.entries(dailyMeals.reduce((acc, meal) => {
                            const mealType = meal.mealName.toLowerCase().includes('breakfast') ? 'breakfast' :
                                             meal.mealName.toLowerCase().includes('lunch') ? 'lunch' :
                                             meal.mealName.toLowerCase().includes('dinner') ? 'dinner' :
                                             meal.mealName.toLowerCase().includes('snack') ? 'snack' :
                                             'other';
                            if (!acc[mealType]) acc[mealType] = [];
                            acc[mealType].push(meal);
                            return acc;
                        }, {} as Record<string, MealEntry[]>)) as [string, MealEntry[]][]).map(([mealType, meals]) => (
                            <div key={mealType} className="border-b pb-2 last:border-b-0">
                                <h4 className="font-semibold text-slate-600 capitalize mb-2">{t(`foodTracker.mealType.${mealType}`)}</h4>
                                {meals.map(meal => (
                                    <div key={meal.id} className="flex justify-between items-center text-sm text-slate-700 mb-1">
                                        <span>{meal.mealName}</span>
                                        <span>{meal.calories} {t('kcal')}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div className="font-bold text-lg text-slate-800 pt-4 border-t mt-4">
                            {t('foodTracker.totalCalories')}: {dailyMeals.reduce((sum, meal) => sum + meal.calories, 0)} {t('kcal')}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodTracker;