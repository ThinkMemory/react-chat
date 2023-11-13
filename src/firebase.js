// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBNGe4Ezf8MalVYXBF2SuYzmU4YnH4NP9Y",
	authDomain: "chat-5315d.firebaseapp.com",
	projectId: "chat-5315d",
	storageBucket: "chat-5315d.appspot.com",
	messagingSenderId: "408505551033",
	appId: "1:408505551033:web:b813e5116e9864b4acf368",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
