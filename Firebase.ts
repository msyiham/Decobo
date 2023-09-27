// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzJIiDPGgIt8QOSSZj9DY7b_qoAI6eMmA",
  authDomain: "decobo-2023.firebaseapp.com",
  projectId: "decobo-2023",
  storageBucket: "decobo-2023.appspot.com",
  messagingSenderId: "974921621634",
  appId: "1:974921621634:web:bd2d0caad0aac374f3549b"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);