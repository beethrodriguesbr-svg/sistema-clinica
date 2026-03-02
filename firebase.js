// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6V7WPNBJ4SPFpQ9Edw7CLNTHAIY0G86o",
  authDomain: "sistema-clinica-5c5b5.firebaseapp.com",
  projectId: "sistema-clinica-5c5b5",
  storageBucket: "sistema-clinica-5c5b5.firebasestorage.app",
  messagingSenderId: "830320583010",
  appId: "1:830320583010:web:630f5009bd3aad85a54c3b",
  measurementId: "G-FZMNED3F84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);