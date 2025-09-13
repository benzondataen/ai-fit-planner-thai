import React from 'react';
import firebase, { auth } from '../firebase';
// Fix: Module '"firebase/auth"' has no exported member 'signInWithPopup'. Switched to v8 syntax.
// import { signInWithPopup } from 'firebase/auth';
import { DumbbellIcon, GoogleIcon } from './common/Icons';
import { t } from '../translations';

const Login: React.FC = () => {

    const handleLogin = async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await auth.signInWithPopup(provider);
        } catch (error) {
            console.error("Authentication error:", error);
            alert(t.loginFailed);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 border border-slate-200 text-center">
                <DumbbellIcon className="w-20 h-20 text-teal-500 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-slate-800">{t.welcomeMessage}</h1>
                <p className="text-slate-500 mt-2 mb-8">{t.welcomeSubtitle}</p>
                <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center space-x-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-lg transition duration-300 text-lg"
                >
                    <GoogleIcon className="w-6 h-6" />
                    <span>{t.loginWithGoogle}</span>
                </button>
            </div>
        </div>
    );
};

export default Login;