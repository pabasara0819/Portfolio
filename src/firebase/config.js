// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmye1iccmIhhBjkwuZ0Vy2ljUZrxGMTRg",
  authDomain: "my-project-d9b6f.firebaseapp.com",
  databaseURL: "https://my-project-d9b6f-default-rtdb.firebaseio.com",
  projectId: "my-project-d9b6f",
  storageBucket: "my-project-d9b6f.firebasestorage.app",
  messagingSenderId: "892969082097",
  appId: "1:892969082097:web:4dc09f7a749a66da35dd50",
  measurementId: "G-GP1LZGYB02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, auth, db, storage, analytics };