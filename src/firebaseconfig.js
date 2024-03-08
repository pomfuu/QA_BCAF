import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBWOZ3xwq1JeZXhKuws1bj7mYzI0WRBpY0",
    authDomain: "qa-dashboard-16bfc.firebaseapp.com",
    projectId: "qa-dashboard-16bfc",
    storageBucket: "qa-dashboard-16bfc.appspot.com",
    messagingSenderId: "732831016020",
    appId: "1:732831016020:web:7260a454e7270fdd5939c1",
    measurementId: "G-HKD236B2QS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;