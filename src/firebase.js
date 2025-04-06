import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCS4ToALp3wSibMpFDyVL35mBXAlXfGHCI",
    authDomain: "shop-4c3fa.firebaseapp.com",
    projectId: "shop-4c3fa",
    storageBucket: "shop-4c3fa.appspot.com",
    messagingSenderId: "750266790486",
    appId: "1:750266790486:web:fa12d6e5608189394a41f7"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

export const db = getFirestore(firebaseApp);
export const provider = new GoogleAuthProvider();
export { auth };  
