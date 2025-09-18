import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile, FitnessPlan, UserData } from './types';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import Login from './components/Login';
import Feedback from './components/Feedback';
import { generateFitnessPlan, generateNewSampleMeals } from './services/geminiService';
import { getUserData, saveUserData } from './services/firestoreService';
import { useAuth } from './hooks/useAuth';
import { auth } from './firebase';
import { useTranslation } from './translations';

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRandomizingMeals, setIsRandomizingMeals] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (e) {
          console.error("Failed to load data from Firestore", e);
          // FIX: Correctly call the translation function `t` with a key.
          setError(t('failedToLoadProfile'));
        }
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    };

    if (!authLoading) {
        fetchData();
    }
  }, [user, authLoading, t]);


  const handleCreatePlan = useCallback(async (newProfile: UserProfile) => {
    if (!user) {
        // FIX: Correctly call the translation function `t` with a key.
        setError(t('loginRequired'));
        return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const newPlan = await generateFitnessPlan(newProfile);
      const newUserData: UserData = { profile: newProfile, plan: newPlan };
      
      await saveUserData(user.uid, newUserData);
      
      setUserData(newUserData);
    } catch (err: any) {
      // FIX: Correctly call the translation function `t` with a key.
      setError(err.message || t('unknownError'));
    } finally {
      setIsGenerating(false);
    }
  }, [user, t]);
  
  const handleRandomizeMeals = useCallback(async () => {
    if (!user || !userData) {
      setError(t('loginRequired'));
      return;
    }
    
    setIsRandomizingMeals(true);
    setError(null);

    try {
      const newSampleMeals = await generateNewSampleMeals(userData.profile, userData.plan.nutritionPlan);
      
      const newUserData: UserData = {
        ...userData,
        plan: {
          ...userData.plan,
          nutritionPlan: {
            ...userData.plan.nutritionPlan,
            sampleMeals: newSampleMeals,
          },
        },
      };

      await saveUserData(user.uid, newUserData);
      setUserData(newUserData);

    } catch (err: any) {
      setError(err.message || t('unknownError'));
    } finally {
      setIsRandomizingMeals(false);
    }
  }, [user, userData, t]);

  const handleLogout = () => {
    auth.signOut();
  };
  
  const handleResetPlan = () => {
    setUserData(null);
  };

  const resetError = () => {
      setError(null);
  }

  const effectiveLoading = authLoading || isLoading;

  if (effectiveLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            {/* FIX: Correctly call the translation function `t` with a key. */}
            <LoadingSpinner message={t('loadingProfile')}/>
        </div>
    );
  }

  if (isGenerating) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            {/* FIX: Correctly call the translation function `t` with a key. */}
            <LoadingSpinner message={t('generatingPlan')}/>
        </div>
    );
  }
  
  if (error) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-slate-50">
              {/* FIX: Correctly call the translation function `t` with a key. */}
              <h2 className="text-2xl text-red-500 font-bold mb-4">{t('failedToGenerate')}</h2>
              <p className="text-slate-500 mb-6">{error}</p>
              <button
                  onClick={resetError}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg"
              >
                  {/* FIX: Correctly call the translation function `t` with a key. */}
                  {t('tryAgain')}
              </button>
          </div>
      )
  }

  if (!user) {
      return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {userData?.profile && userData?.plan ? (
        <>
          <Header onLogout={handleLogout} onResetPlan={handleResetPlan} />
          <main>
            <Dashboard 
              profile={userData.profile} 
              plan={userData.plan} 
              onRandomizeMeals={handleRandomizeMeals}
              isRandomizing={isRandomizingMeals}
            />
          </main>
        </>
      ) : (
        <ProfileForm onSave={handleCreatePlan} />
      )}
      <Feedback user={user} />
    </div>
  );
};

export default App;
