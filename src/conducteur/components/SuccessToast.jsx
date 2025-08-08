import React from "react";

export default function SuccessToast({ successToast }) {
  if (!successToast) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl animate-fade-in-out z-[9999]">
      <p className="font-semibold">{successToast}</p>
    </div>
  );
}
