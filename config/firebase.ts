// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyh8NZ1J2NCNOwSTlS4vKZSxcTbVPPKmc",
  authDomain: "chatapp-b68df.firebaseapp.com",
  projectId: "chatapp-b68df",
  storageBucket: "chatapp-b68df.appspot.com",
  messagingSenderId: "797303957366",
  appId: "1:797303957366:web:0e23b946cd08dff38dbc57"
};

// Initialize Firebase
const app = getApps().length ? getApp(): initializeApp(firebaseConfig);
const db= getFirestore(app)
// authenticate
const auth= getAuth(app)
// provider from Firebase
const provider = new GoogleAuthProvider()

// export toan bo
export {db, auth, provider} 