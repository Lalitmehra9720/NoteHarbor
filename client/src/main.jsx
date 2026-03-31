import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import {Toaster} from "react-hot-toast";
import ScrollToTop from "./utils/ScrollToTop";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <App />
        <Toaster position="top-right"/>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);