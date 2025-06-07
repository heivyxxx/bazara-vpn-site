// Заменить на свои значения из консоли Firebase
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAouTEXN2lQapElxCEtmebO21t19i2WYns",
  authDomain: "bazara-vpn-admin.firebaseapp.com",
  projectId: "bazara-vpn-admin",
  storageBucket: "bazara-vpn-admin.appspot.com",
  messagingSenderId: "856281360473",
  appId: "1:856281360473:web:1b01584e7830672dcb2948",
  // measurementId: "G-D161JYJ186" // не обязательно
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app); 