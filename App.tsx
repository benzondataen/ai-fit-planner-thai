import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile, FitnessPlan, UserData } from './types';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import Login from './components/Login';
import { generateFitnessPlan } from './services/geminiService';
import { getUserData, saveUserData } from './services/firestoreService';
import { useAuth } from './hooks/useAuth';
import { auth } from './firebase';
// Fix: Module '"firebase/auth"' has no exported member 'signOut'. Switched to v8 syntax.
// import { signOut } from 'firebase/auth';
import { t } from './translations';

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (e) {
          console.error("Failed to load data from Firestore", e);
          setError(t.failedToLoadProfile);
        }
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    };

    if (!authLoading) {
        fetchData();
    }
  }, [user, authLoading]);


  const handleCreatePlan = useCallback(async (newProfile: UserProfile) => {
    if (!user) {
        setError(t.loginRequired);
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
      setError(err.message || t.unknownError);
    } finally {
      setIsGenerating(false);
    }
  }, [user]);
  
  const handleLogout = () => {
    // Fix: Use v8 namespaced API for signOut
    auth.signOut();
  };
  
  const resetError = () => {
      setError(null);
      // We don't need to call handleReset equivalent because logging out and in will refetch data
  }

  const effectiveLoading = authLoading || isLoading;

  if (effectiveLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <LoadingSpinner message={t.loadingProfile}/>
        </div>
    );
  }

  if (isGenerating) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <LoadingSpinner message={t.generatingPlan}/>
        </div>
    );
  }
  
  if (error) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-slate-50">
              <h2 className="text-2xl text-red-500 font-bold mb-4">{t.failedToGenerate}</h2>
              <p className="text-slate-500 mb-6">{error}</p>
              <button
                  onClick={resetError}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg"
              >
                  {t.tryAgain}
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
          <Header onLogout={handleLogout} />
          <main>
            <Dashboard profile={userData.profile} plan={userData.plan} />
          </main>
        </>
      ) : (
        <ProfileForm onSave={handleCreatePlan} />
      )}
    </div>
  );
};

export default App;