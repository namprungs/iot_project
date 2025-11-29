import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyA3Fcsadw_xx637HBqNxlfWpl0XWMc46I8",
  authDomain: "iot-project-cae37.firebaseapp.com",
  projectId: "iot-project-cae37",
  storageBucket: "iot-project-cae37.firebasestorage.app",
  messagingSenderId: "810885132322",
  appId: "1:810885132322:web:a91586075518ed3fcd9a7b",
  measurementId: "G-HTFC2F5XHG",
  // RTDB needs the regional databaseURL otherwise writes fall back to US and never reach your instance.
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ??
    "https://iot-project-cae37-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
