import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import "./style.css";
import App from "./App";
import { ThemeProvider } from "./providers/ThemeProvider";
import { BuildInfoProvider } from "./providers/BuildInfoProvider";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <BuildInfoProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BuildInfoProvider>
  </React.StrictMode>,
);
