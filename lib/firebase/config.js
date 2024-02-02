// Import the functions you need from the SDKs you need
// import firebase from "firebase/compat/app";
// import "firebase/analytics";
// import "firebase/auth";
// import "firebase/firestore";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB7oE0slChwNXlZDORUyMJmYT_U17G26zE",
    authDomain: "trail-nation.firebaseapp.com",
    projectId: "trail-nation",
    storageBucket: "trail-nation.appspot.com",
    messagingSenderId: "322539068748",
    appId: "1:322539068748:web:e308697ff88cb7e96183e9",
    measurementId: "G-33M0MS2XC7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth();
const db = getFirestore();

export {app, auth, db}