import React from "react";

const RoleSelector = ({ role, setRole }) => {
  return (
    <div className="mb-6">
      <p className="font-semibold mb-2">Je suis :</p>
      <div className="flex gap-4">
        <button
          type="button"
          className={`px-4 py-2 rounded ${role === "student" ? "bg-green-500 text-white" : "bg-gray-200"}`}
          onClick={() => setRole("student")}
        >
          Étudiant
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded ${role === "conducteur" ? "bg-green-500 text-white" : "bg-gray-200"}`}
          onClick={() => setRole("conducteur")}
        >
          Conducteur
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
