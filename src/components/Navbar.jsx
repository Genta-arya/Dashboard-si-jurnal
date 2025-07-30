import React, { useState } from "react";
import { LogOut } from "lucide-react"; // Import ikon LogOut dari lucide-react
import { responseHandler } from "@/lib/utils";
import { ServiceLogout } from "@/Services/Auth/Auth.services";

import { BeatLoader, ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/lib/AuthZustand";

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    setLoading(true);
    try {
      await ServiceLogout(localStorage.getItem("token"));
      setUser(null);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.log(error);
      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full px-4 pt-4 pb-2 border-b-2 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/Icon.png" alt="Logo" className="w-14" />
          <div>
            <h1 className="text-lg font-bold text-blue-600">Dashboard</h1>
            <p className="text-sm font-semibold">SIJURNAL - SMKN 2 KETAPANG</p>
          </div>
        </div>

        <button
          title="Logout"
          disabled={loading}
          className="p-2 rounded-md hover:bg-gray-100 transition-all duration-300"
          onClick={handleLogout}
        >
          {loading ? (
            <BeatLoader size={10} color="red" />
          ) : (
            <LogOut size={24} className="text-red-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
