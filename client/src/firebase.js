// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4Hu9NxQ7Xz4hfeiuChic2n33YLC5nXn4",
  authDomain: "socmed-db.firebaseapp.com",
  projectId: "socmed-db",
  storageBucket: "socmed-db.appspot.com",
  messagingSenderId: "1041863045617",
  appId: "1:1041863045617:web:c6ac7115f13daed0bf9450",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;