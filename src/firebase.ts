// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyCWujG3vHNlVwclBFnMg0_Z3RKH7jYtICU",

  authDomain: "historyguesser-edd0f.firebaseapp.com",

  projectId: "historyguesser-edd0f",

  storageBucket: "historyguesser-edd0f.firebasestorage.app",

  messagingSenderId: "419696764002",

  appId: "1:419696764002:web:964b23281fae257381dd3b"

};


import { getFirestore } from "firebase/firestore";

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);