import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBpfDm8eW2HbkgAYlhg3SYYnX8at_JhWeg",
    authDomain: "poll-app-ca980.firebaseapp.com",
    databaseURL: "https://poll-app-ca980-default-rtdb.firebaseio.com",
    projectId: "poll-app-ca980",
    storageBucket: "poll-app-ca980.appspot.com",
    messagingSenderId: "625907067517",
    appId: "1:625907067517:web:78cdd1d30952eddf2c9f14",
    measurementId: "G-JNVNBZDHM8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
