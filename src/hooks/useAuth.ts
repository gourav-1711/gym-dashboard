import { useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuthStore } from "../store/authStore";

export function useAuthInit() {
  const { setUser, setLoading } = useAuthStore();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsub;
  }, [setUser, setLoading]);
}

export function useLogin() {
  return async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
}

export function useLogout() {
  return async () => signOut(auth);
}
