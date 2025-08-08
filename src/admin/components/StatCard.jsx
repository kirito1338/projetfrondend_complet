import React from 'react';

export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center flex flex-col items-center">
      <div className="mb-2 text-2xl text-blue-600">{icon}</div>
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
