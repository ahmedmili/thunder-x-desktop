import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { getAuth } from 'firebase/auth';

const apiKey = import.meta.env.VITE_ECHO_FIREBASE_APIKEY;
const authDomain = import.meta.env.VITE_ECHO_FIREBASE_AUTHDOMAIN;
const projectId = import.meta.env.VITE_ECHO_FIREBASE_PROJECTID;
const storageBucket = import.meta.env.VITE_ECHO_FIREBASE_STORAGEBUCKET;
const messagingSenderId = import.meta.env.VITE_ECHO_FIREBASE_MESSAGINGUSER;
const appId = import.meta.env.VITE_ECHO_FIREBASE_APPID;

const firebaseConfig = {
        apiKey: apiKey,
        authDomain: authDomain,
        projectId: projectId,
        storageBucket: storageBucket,
        messagingSenderId: messagingSenderId,
        appId: appId,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
