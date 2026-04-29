import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { installGlobalErrorListeners, __runDevSanityCheck } from "./lib/error-reporter";

installGlobalErrorListeners();

if (import.meta.env.DEV && import.meta.env.VITE_ERROR_REPORTER_SANITY_CHECK === "true") {
  __runDevSanityCheck();
}

createRoot(document.getElementById("root")!).render(<App />);
