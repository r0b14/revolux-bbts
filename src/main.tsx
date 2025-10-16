
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./app/context/AuthContext";
import { AppRouter } from "./AppRouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ThemeProvider>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </ThemeProvider>
  </AuthProvider>
);
  