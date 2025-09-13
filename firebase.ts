// Fix for Error: Module '"firebase/auth"' has no exported member 'getAuth'.
// Switched to Firebase v8 compatibility syntax for auth initialization.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore"

// IMPORTANT: Replace with your own Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA37L-BaV9C7IqWfyqKXfmeHaXNnVpHtMo",
  authDomain: "ai-cal-planner.firebaseapp.com",
  projectId: "ai-cal-planner",
  storageBucket: "ai-cal-planner.appspot.com",
  messagingSenderId: "961730651441",
  appId: "1:961730651441:web:dd6285a1296dc61c953c10",
  measurementId: "G-TJB9L4ZZQ6"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = firebase.auth();
export const db = firebase.firestore(); 
export default firebase;