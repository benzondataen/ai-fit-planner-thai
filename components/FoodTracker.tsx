import React, { useState } from 'react';
import { useTranslation } from '../translations';

const FoodTracker: React.FC = () => {
    const { t } = useTranslation();
    const [mealName, setMealName] = useState('');
    const [mealInput, setMealInput] = useState<string | File | null>(null);
    const [analysisResult, setAnalysisResult] = useState<{ calories: number; nutrients: any } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCalories, setEditedCalories] = useState<number | null>(null);
    const [editedNutrients, setEditedNutrients] = useState<any | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const handleManualInput = () => {
        // Placeholder for manual input logic
        console.log('Manual input:', mealName);
        // For now, let's mock an analysis result
        setAnalysisResult({ calories: 500, nutrients: { protein: 20, carbs: 50, fat: 25 } });
        setIsEditing(false);
        setImagePreviewUrl(null); // Clear image preview if switching to manual input
    };

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setMealInput(file);
            console.log('Photo uploaded:', file.name);

            // Create a URL for the image preview
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl); // Clean up previous URL
            }
            const newImageUrl = URL.createObjectURL(file);
            setImagePreviewUrl(newImageUrl);

            // For now, let's mock an analysis result
            setAnalysisResult({ calories: 600, nutrients: { protein: 30, carbs: 60, fat: 30 } });
            setIsEditing(false);
        }
    };

    const handleAnalyze = () => {
        // This will trigger the AI analysis in a later phase
        console.log('Analyzing meal...');
        // Mock analysis for now
        setAnalysisResult({ calories: 450, nutrients: { protein: 15, carbs: 40, fat: 20 } });
        setIsEditing(false);
    };

    const handleSaveMeal = () => {
        // This will save to Firestore in a later phase
        console.log('Saving meal:', { mealName, calories: editedCalories || analysisResult?.calories, nutrients: editedNutrients || analysisResult?.nutrients });
        alert('Meal saved (placeholder)!');
        // Reset state after saving
        setMealName('');
        setMealInput(null);
        setAnalysisResult(null);
        setEditedCalories(null);
        setEditedNutrients(null);
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl); // Clean up URL on save
        }
        setImagePreviewUrl(null);
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
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-300"
                    disabled={!mealName && !mealInput}
                >
                    {t('foodTracker.analyzeMeal')}
                </button>
            </div>

            {analysisResult && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-xl font-semibold text-slate-700 mb-4">{t('foodTracker.analysisResults')}</h3>
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
        </div>
    );
};

export default FoodTracker;