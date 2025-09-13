import { useState, useEffect } from 'react';
import { auth } from '../firebase';
// Fix: Import firebase to get access to the User type for the v8 SDK.
import firebase from 'firebase/app';
import 'firebase/auth';
// Fix: Module '"firebase/auth"' has no exported member 'onAuthStateChanged' or 'User'.
// import { onAuthStateChanged, User } from 'firebase/auth';

export const useAuth = () => {
    // Fix: Use firebase.User type from v8 API
    const [user, setUser] = useState<firebase.User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fix: use v8 namespaced onAuthStateChanged
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
};
