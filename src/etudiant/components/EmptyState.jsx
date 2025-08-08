import React from "react";

const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="text-4xl text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
    </div>
  );
};

export default EmptyState;
