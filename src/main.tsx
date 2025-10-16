
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./app/context/AuthContext";
import { AppRouter } from "./AppRouter";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);
  