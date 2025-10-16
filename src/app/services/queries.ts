import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";

export async function listMyUploads(limitN = 20) {
  const uid = auth.currentUser?.uid!;
  const q = query(
    collection(db, "uploads"),
    where("ownerUid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(limitN)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export async function listAllUploads(limitN = 20) {
  const q = query(collection(db, "uploads"), orderBy("createdAt", "desc"), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}
