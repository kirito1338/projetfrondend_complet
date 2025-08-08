import React from "react";
import {
  FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUserFriends
} from "react-icons/fa";

const SearchBar = ({ searchParams, setSearchParams, onSearch }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative group">
          <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="D'où partez-vous ?"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            value={searchParams.depart}
            onChange={e => setSearchParams({ ...searchParams, depart: e.target.value })}
          />
        </div>
        
        <div className="relative group">
          <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Où allez-vous ?"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            value={searchParams.arrivee}
            onChange={e => setSearchParams({ ...searchParams, arrivee: e.target.value })}
          />
        </div>
        
        <div className="relative group">
          <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            value={searchParams.date}
            onChange={e => setSearchParams({ ...searchParams, date: e.target.value })}
          />
        </div>
        
        <div className="relative group">
          <FaUserFriends className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            value={searchParams.passagers}
            onChange={e => setSearchParams({ ...searchParams, passagers: e.target.value })}
          >
            {[1, 2, 3, 4].map(n => (
              <option key={n} value={n}>
                {n} passager{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={onSearch}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <FaSearch className="text-xl" />
          <span>Rechercher</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
