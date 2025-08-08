import React from 'react';

export default function SidebarItem({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded transition-all w-full ${
        active ? "bg-blue-600 shadow-lg" : "hover:bg-blue-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
