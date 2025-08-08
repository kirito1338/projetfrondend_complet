import React from "react";

const AuthBackground = ({ children }) => {
  return (
    <section
      className="relative w-screen h-screen flex items-center justify-center px-4 overflow-hidden"
      style={{ 
        backgroundImage: "url('/femme.jpg')", 
        backgroundSize: "cover", 
        backgroundPosition: "center" 
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 p-6 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </section>
  );
};

export default AuthBackground;
