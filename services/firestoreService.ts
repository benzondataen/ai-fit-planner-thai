import { UserData, MealEntry } from '../types';
import { db } from '../firebase';
import { t } from '../translations';
import firebase from 'firebase/compat/app';

const USERS_COLLECTION = 'users';
const FEEDBACK_COLLECTION = 'feedback';
const MEALS_SUBCOLLECTION = 'meals';

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

export const saveMealEntry = async (userId: string, meal: MealEntry): Promise<void> => {
    try {
        const userMealsCollectionRef = db.collection(USERS_COLLECTION).doc(userId).collection(MEALS_SUBCOLLECTION);
        await userMealsCollectionRef.add({
            ...meal,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        console.error("Error saving meal entry to Firestore: ", error);
        throw new Error(t('foodTracker.saveMealError') || 'Failed to save meal.');
    }
};

export const getDailyMealEntries = async (userId: string, date: string): Promise<MealEntry[]> => {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const userMealsCollectionRef = db.collection(USERS_COLLECTION).doc(userId).collection(MEALS_SUBCOLLECTION);
        const snapshot = await userMealsCollectionRef
            .where('timestamp', '>=', startOfDay)
            .where('timestamp', '<=', endOfDay)
            .orderBy('timestamp', 'asc')
            .get();

        const meals: MealEntry[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            meals.push({
                id: doc.id,
                userId: data.userId,
                mealName: data.mealName,
                calories: data.calories,
                protein: data.protein,
                carbs: data.carbs,
                fat: data.fat,
                description: data.description,
                imageUrl: data.imageUrl,
                timestamp: data.timestamp.toDate(), // Convert Firestore Timestamp to Date
            });
        });
        return meals;
    } catch (error) {
        console.error("Error fetching daily meal entries from Firestore: ", error);
        throw new Error(t('foodTracker.fetchMealsError') || 'Failed to fetch daily meals.');
    }
};