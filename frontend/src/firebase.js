// filepath: frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAde5kWDVyvqJjY1CWD09vI6VFYhhzb8RI",
  authDomain: "prepmate-x.firebaseapp.com",
  databaseURL: "https://prepmate-x-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "prepmate-x",
  storageBucket: "prepmate-x.firebasestorage.app",
  messagingSenderId: "870510693297",
  appId: "1:870510693297:web:d1f18753c6f2c798da0b90",
  measurementId: "G-M4DC6KRLT2"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app); // 2. Initialize Firestore
const storage = getStorage(app); // <-- 2. Initialize Storage

export { auth, db, storage };
