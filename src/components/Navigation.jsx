import { ArrowLeftCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Navigation = ({ text }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Jika ada riwayat sebelumnya, navigasi ke -1, kalau tidak ke "/"
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div
        className="flex items-center px-4 gap-2 cursor-pointer text-sm font-semibold hover:opacity-80"
        onClick={handleBack}
      >
        <ArrowLeftCircle />
        <p>Kembali</p>
      </div>
      <p className="font-bold text-lg uppercase cursor-default bg-blue-500 text-white px-6 py-2 rounded-md">
        {text}
      </p>
    </div>
  );
};

export default Navigation;
