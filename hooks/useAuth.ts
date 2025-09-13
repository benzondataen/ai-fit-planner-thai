import { useState, useEffect } from 'react';
// Fix: Corrected firebase import to get User type and be consistent with other components.
// This resolves the error where firebase.User was not found.
import firebase, { auth } from '../firebase';
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
