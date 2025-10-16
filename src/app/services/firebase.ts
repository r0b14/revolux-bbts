import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { User } from "firebase/auth";

// Pegamos tudo do .env (Vite)
const firebaseConfigFromEnv = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
};

// Inicialização segura: se as variáveis não estiverem definidas, não inicializa o SDK
let app: FirebaseApp | null = null;
let authInst: ReturnType<typeof getAuth> | null = null;
let dbInst: ReturnType<typeof getFirestore> | null = null;

const hasEnvConfig = Boolean(
  firebaseConfigFromEnv.apiKey && firebaseConfigFromEnv.authDomain && firebaseConfigFromEnv.projectId
);

if (hasEnvConfig) {
  try {
    // garante singleton (evita “Firebase App named '[DEFAULT]' already exists” no HMR)
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfigFromEnv as any);
    authInst = getAuth(app);
    dbInst = getFirestore(app);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Firebase init failed (env):', err);
    app = null;
    authInst = null;
    dbInst = null;
  }
} else {
  // eslint-disable-next-line no-console
  console.info('Firebase env config not provided — running without Firebase (mock mode).');
}

export { app };
export const auth = authInst as any;
export const db = dbInst as any;

// util: esperar o primeiro estado de auth (útil nos guards)
export const waitForAuthInit = () =>
  new Promise<User | null>(async (resolve) => {
    if (!auth) return resolve(null);
    const { onAuthStateChanged } = await import('firebase/auth');
    const unsub = onAuthStateChanged(auth, (u) => {
      resolve(u);
      unsub();
    });
  });
