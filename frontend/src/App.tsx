import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes";
import { ToastContainer } from "./components/ui/Toast";
import { useToast } from "./hooks/useToast";

export function App() {
  const { toasts, dismissToast } = useToast();

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background text-text font-sans antialiased selection:bg-primary/30 selection:text-white">
          <AppRoutes />
          <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
