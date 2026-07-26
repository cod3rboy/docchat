import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import "./style.css";
import { Theme } from "@radix-ui/themes";
import App from "./App";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Theme appearance="light" accentColor="blue">
      <App />
    </Theme>
  </React.StrictMode>,
);
