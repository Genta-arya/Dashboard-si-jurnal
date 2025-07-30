import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, FileText } from "lucide-react"; // pastikan sudah install lucide-react

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Beranda", icon: <Home size={20} />, path: "/" },
    { label: "Rekap", icon: <FileText size={20} />, path: "/laporan" },
  ];

  if (location.pathname.startsWith("/laporan/")) return null
  
  ;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-md z-50">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center text-xs ${
            location.pathname === item.path ? "text-blue-600" : "text-gray-500"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation;
