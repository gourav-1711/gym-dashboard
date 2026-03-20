import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Configuration...
// (Using a helper to ensure it's not re-initialized too much)
const app = (typeof window !== "undefined" && firebaseConfig.apiKey)
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

// These will be valid in the browser if keys are present
// Otherwise they are null, which call sites must handle or use optional chaining
export const auth = app ? getAuth(app) : null as unknown as Auth;
export const db = app ? getDatabase(app) : null as unknown as Database;

export default app;