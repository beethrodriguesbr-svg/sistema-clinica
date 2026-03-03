import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6V7WPNBJ4SPFpQ9Edw7CLNTHAIY0G86o",
  authDomain: "sistema-clinica-5c5b5.firebaseapp.com",
  projectId: "sistema-clinica-5c5b5",
  storageBucket: "sistema-clinica-5c5b5.appspot.com",
  messagingSenderId: "830320583010",
  appId: "1:830320583010:web:630f5009bd3aad85a54c3b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);