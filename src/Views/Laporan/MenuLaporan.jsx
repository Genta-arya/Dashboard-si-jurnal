import { Archive, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const MenuLaporan = () => {
  const [showlaporanSubmenu, setShowlaporanSubmenu] = useState(true);

  const laporanSubmenu = [
    { name: "Rekap per kelas", href: "/laporan/kelas" },
    { name: "Rekap per guru", href: "/laporan/guru" },
    { name: "Rekap keseluruhan", href: "/laporan/keseluruhan" },

  ];

  return (
    <div className="space-y-4">
    
      <div
        onClick={() => setShowlaporanSubmenu(!showlaporanSubmenu)}
        className="cursor-pointer border-b space-x-2 p-2 rounded-lg hover:bg-gray-100 transition flex justify-between items-center"
      >
        <div className="flex items-center space-x-2">
          <p className="text-blue-600">
            <Archive />
          </p>
          <span>Pilihan Laporan</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transform transition-transform ${
            showlaporanSubmenu ? "rotate-90" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {showlaporanSubmenu && (
        <div className="ml-6 space-y-2">
          {laporanSubmenu.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              className="cursor-pointer border-b space-x-2 p-2 rounded-lg hover:bg-gray-100 transition flex justify-between items-center"
            >
              <div className="flex justify-between items-center w-full">
                <span>{item.name}</span>
                <ArrowRight />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuLaporan;
