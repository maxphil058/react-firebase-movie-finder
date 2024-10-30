
import { initializeApp } from "firebase/app";
import { Firestore, collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { get } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsnmpmCzrTVY1KCk5pTv14Ezq6pbRIh84",
  authDomain: "movie-finder-20bfe.firebaseapp.com",
  projectId: "movie-finder-20bfe",
  storageBucket: "movie-finder-20bfe.appspot.com",
  messagingSenderId: "928286561129",
  appId: "1:928286561129:web:a0ed3fedece7534e6f23f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
export  const usersDbRef = collection(db,"users" )

