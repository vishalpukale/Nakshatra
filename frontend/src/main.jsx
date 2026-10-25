/**
 * --------------------------------------------------------
 * File        : main.jsx
 * Description : Entry point for the React application.
 *               Mounts the root component and initializes global tools like toast notifications.
 * Authors     : Developer team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Uses React 18's createRoot API.
 * - Loads global styles and initializes ToastContainer.
 * - Wraps the entire app in React.StrictMode for highlighting potential issues.
 */


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "./style/index.css";
import "./style/icons.css";
import "./style/icomoon-icons.css";
import "./style/ui-controls.css";
import "./style/responsive.css";
import "@fontsource/instrument-sans"; // Weight 400 by default
import "@fontsource/instrument-sans/700.css"; // Optional weights
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer hideProgressBar={true} position="bottom-right" />
    <App />
  </StrictMode>,
);
