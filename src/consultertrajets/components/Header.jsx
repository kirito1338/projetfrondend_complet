import React from "react";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 relative z-10">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Trip Management System
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Find and manage your business travel efficiently
          </p>
        </div>
      </div>
    </div>
  );
}
