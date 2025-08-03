'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "prositeai-8rmio",
  appId: "1:191837223701:web:9f67baac141b2f40bec71c",
  storageBucket: "prositeai-8rmio.firebasestorage.app",
  apiKey: "AIzaSyAqnnjGvxoA1sfcrW7fDZQWq4wk2ck-UC4",
  authDomain: "prositeai-8rmio.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "191837223701"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export { app };
