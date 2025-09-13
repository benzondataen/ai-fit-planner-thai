import { UserData } from '../types';
import { db } from '../firebase';
import { t } from '../translations';
// Fix: Remove v9 Firestore imports as they are not needed with the v8 API.
// import { doc, setDoc, getDoc } from 'firebase/firestore';

const USERS_COLLECTION = 'users';

export const saveUserData = async (uid: string, data: UserData): Promise<void> => {
    try {
        // Fix: use v8 firestore syntax
        const userDocRef = db.collection(USERS_COLLECTION).doc(uid);
        await userDocRef.set(data);
    } catch (error) {
        console.error("Error saving user data to Firestore: ", error);
        throw new Error(t.saveError);
    }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
    try {
        // Fix: use v8 firestore syntax
        const docRef = db.collection(USERS_COLLECTION).doc(uid);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            return docSnap.data() as UserData;
        } else {
            return null; // No profile exists for this user yet
        }
    } catch (error) {
        console.error("Error fetching user data from Firestore: ", error);
        throw new Error(t.fetchError);
    }
};