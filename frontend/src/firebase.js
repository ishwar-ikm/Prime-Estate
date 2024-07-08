// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-project-77f1a.firebaseapp.com",
  projectId: "real-estate-project-77f1a",
  storageBucket: "real-estate-project-77f1a.appspot.com",
  messagingSenderId: "74976846253",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-YJG63L6VV2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);