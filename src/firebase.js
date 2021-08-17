import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCS4ToALp3wSibMpFDyVL35mBXAlXfGHCI",
    authDomain: "shop-4c3fa.firebaseapp.com",
    projectId: "shop-4c3fa",
    storageBucket: "shop-4c3fa.appspot.com",
    messagingSenderId: "750266790486",
    appId: "1:750266790486:web:fa12d6e5608189394a41f7"
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const auth = firebaseApp.auth();
  export const db = firebaseApp.firestore();
  export const provider = new firebase.auth.GoogleAuthProvider();
  export default auth;

               