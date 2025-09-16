import { UserData } from '../types';
import { db } from '../firebase';
import { t } from '../translations';
import firebase from 'firebase/compat/app';

const USERS_COLLECTION = 'users';
const FEEDBACK_COLLECTION = 'feedback';

export const saveUserData = async (uid: string, data: UserData): Promise<void> => {
    try {
        const userDocRef = db.collection(USERS_COLLECTION).doc(uid);
        await userDocRef.set(data);
    } catch (error) {
        console.error("Error saving user data to Firestore: ", error);
        throw new Error(t('saveError'));
    }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
    try {
        const docRef = db.collection(USERS_COLLECTION).doc(uid);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            return docSnap.data() as UserData;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data from Firestore: ", error);
        throw new Error(t('fetchError'));
    }
};

export const saveFeedback = async (uid: string, email: string, feedback: string): Promise<void> => {
    try {
        await db.collection(FEEDBACK_COLLECTION).add({
            uid,
            email,
            feedback,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error("Error saving feedback to Firestore: ", error);
        throw new Error(t('feedbackError'));
    }
};