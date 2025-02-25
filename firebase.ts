// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKGY8g-OwJw9AMnZX8e3dcRYiRJjnT0GQ",
  authDomain: "adfluence-1b286.firebaseapp.com",
  projectId: "adfluence-1b286",
  storageBucket: "adfluence-1b286.firebasestorage.app",
  messagingSenderId: "354444115211",
  appId: "1:354444115211:web:1098bdd3819758a915360e",
  measurementId: "G-FESC8BS7ZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);