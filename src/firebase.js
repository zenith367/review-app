import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDVdW9fvwaCV2dbGlWvf8BN8XcivMdMGrc",
    authDomain: "reviewapp-775bb.firebaseapp.com",
    projectId: "reviewapp-775bb",
    storageBucket: "reviewapp-775bb.firebasestorage.app",
    messagingSenderId: "121913172895",
    appId: "1:121913172895:web:13802a23842fe9553b93aa"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
