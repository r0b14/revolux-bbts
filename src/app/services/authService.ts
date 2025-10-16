import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import type { Role } from "./roles";

export async function createAccount(email: string, password: string, name?: string, role: Role = "operador") {
  if (!auth || !db) {
    throw new Error("Firebase não está configurado no ambiente. Configure as variáveis de ambiente do Firebase antes de criar contas.");
  }
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  // atualiza displayName no profile se tiver name
  if (name) {
    await updateProfile(user, { displayName: name });
  }
  // garante documento do usuário
  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
    email: user.email ?? "",
    name: name ?? user.displayName ?? "",
    role,
    createdAt: serverTimestamp(),
    ownerUid: user.uid,
  });
  return user;
}
