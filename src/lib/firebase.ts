import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

const isBrowser = typeof window !== "undefined";

// During build time (SSR/SSG), we might not have the correct Firebase keys.
// We only initialize if we're in the browser AND keys are actually present.
const app = (isBrowser && firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10) 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0])
  : null;

// export const auth = app ? getAuth(app) : null as any;
// export const db = app ? getDatabase(app) : null as any;

// Use lazy initialization or fallback to avoid build crashes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth = (app && isBrowser) ? getAuth(app) : ({} as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = (app) ? getDatabase(app) : ({} as any);
export default app;
