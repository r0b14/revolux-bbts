import { createContext, useContext, useEffect, useState } from "react";
import { auth, waitForAuthInit, db } from "../services/firebase";
import { signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { Role, getUserRoleMock } from "../services/roles";

type AuthState = {
  user: User | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Role | null>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthState>({} as any);

/** Garante que exista um documento do usuário em Firestore após login */
async function ensureUserDoc(user: User) {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      name: user.displayName || "Usuário",
      role: "operador", // role padrão; admin pode alterar depois
      createdAt: serverTimestamp(),
      ownerUid: user.uid,
    });
    return { role: 'operador' } as any;
  }
  return snap.data();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    waitForAuthInit().then(async (u) => {
      // Force fresh login on app start: if there's a persisted firebase user, sign out immediately
      try {
        if (u && auth) {
          // sign out to avoid using previous session
          await signOut(auth);
          setUser(null);
          setRole(getUserRoleMock(null));
          setLoading(false);
          return;
        }
      } catch (e) {
        // ignore and continue to safe defaults
      }

      setUser(u);
      if (u && db) {
        try {
          const ref = doc(db, 'users', u.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data: any = snap.data();
            setRole((data.role as any) ?? getUserRoleMock(u?.email ?? null));
          } else {
            setRole(getUserRoleMock(u?.email ?? null));
          }
        } catch (e) {
          setRole(getUserRoleMock(u?.email ?? null));
        }
      } else {
        setRole(getUserRoleMock(u?.email ?? null));
      }
      setLoading(false);
    });
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);
    if (!auth) {
      // fallback mock login when firebase not configured
      setUser({ email: email as any } as any);
      const r = getUserRoleMock(email);
      setRole(r);
      setLoading(false);
      return r;
    }
    try {
      // explicit logs to help debug runtime redirect issues
      // eslint-disable-next-line no-console
      console.info('AuthContext: attempting signInWithEmailAndPassword for', email);
      await signInWithEmailAndPassword(auth, email, password);
      const u = auth.currentUser!;
      // ensure user doc exists and read role
      const data = await ensureUserDoc(u);
      setUser(u);
      const finalRole = (data?.role as any) ?? getUserRoleMock(u?.email ?? null);
      setRole(finalRole);
      // eslint-disable-next-line no-console
      console.info('AuthContext: login successful, role=', finalRole, 'uid=', u?.uid);
      setLoading(false);
      return finalRole;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('AuthContext: login error', err);
      setLoading(false);
      return null;
    }
  }

  async function logout() {
    if (auth) await signOut(auth);
    setUser(null);
    setRole(null);
  }

  return (
    <Ctx.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
