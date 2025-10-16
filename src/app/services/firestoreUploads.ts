import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

export async function createUploadMeta(file: File) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado");
  const ref = await addDoc(collection(db, "uploads"), {
    ownerUid: uid,
    fileName: file.name,
    fileSize: file.size,
    status: "pending",
    createdAt: serverTimestamp(),
    processedAt: null,
    insights: null,
    metrics: null,
    storagePath: null,
    errorMessage: null,
  });
  return ref.id;
}

export async function attachStoragePath(uploadId: string, storagePath: string) {
  await updateDoc(doc(db, "uploads", uploadId), { storagePath });
}

export async function finalizeUpload(uploadId: string, metrics: any, insights?: string) {
  await updateDoc(doc(db, "uploads", uploadId), {
    status: "processed",
    processedAt: serverTimestamp(),
    metrics,
    insights: insights ?? null,
  });
}

export async function failUpload(uploadId: string, msg: string) {
  await updateDoc(doc(db, "uploads", uploadId), {
    status: "error",
    processedAt: serverTimestamp(),
    errorMessage: msg,
  });
}
