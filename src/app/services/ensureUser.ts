import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

export async function ensureUserDoc(u: User) {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: u.email ?? "",
      name: u.displayName ?? "",
      role: "operador",
      createdAt: serverTimestamp(),
    });
  }
}
