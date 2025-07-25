// src/components/CustomToastContainer.jsx

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomToastContainer() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={6000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastStyle={{
        background: "rgba(30, 41, 59, 0.75)", // bg-slate-800 semi-transparent
        color: "#ffffff",
        backdropFilter: "blur(10px)",         // flou en arrière-plan
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "14px 16px",
        fontSize: "0.95rem",
        fontWeight: 500,
      }}
      bodyStyle={{
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    />
  );
}
