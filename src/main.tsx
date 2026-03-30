import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { makeServer } from "./mock/server";
import App from "./App";
import "./index.css";

if (import.meta.env.DEV) {
  makeServer();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
