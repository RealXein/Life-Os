import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { applyInitialTheme } from "./lib/themes";

applyInitialTheme();

createRoot(document.getElementById("root")!).render(<App />);
