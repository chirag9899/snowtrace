// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8ysM4auAbHHf5fUa8pkMyqkOJLrNjhs8",
  authDomain: "tracker-a68c9.firebaseapp.com",
  projectId: "tracker-a68c9",
  storageBucket: "tracker-a68c9.appspot.com",
  messagingSenderId: "465944626726",
  appId: "1:465944626726:web:b15155a8e7271aa31508e7"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export default app;
