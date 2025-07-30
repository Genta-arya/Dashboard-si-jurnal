import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentikasi from "./Views/Authentikasi/Authentikasi";
import Dashboard from "./Views/Dashboard/Dashboard";

import HalamanNotFound from "./components/HalamanNotFound";
import Layout from "./Layout";

import Management from "./Views/Management/Management";
import Pegawai from "./Views/Management/Pegawai/Pegawai";
import Kelas from "./Views/Management/Kelas/Kelas";
import { Toaster } from "sonner";
import Kegiatan from "./Views/Management/Kegiatan/Kegiatan";
import Mapel from "./Views/Management/Mapel/Mapel";
import Setting from "./Views/Setting/Setting";
import InputTitle from "./Views/Setting/Title/InputTitle";
import InputTahunAjaran from "./Views/Setting/TahunAjaran/InputTahunAjaran";
import Banner from "./Views/Setting/Banner/Banner";
import Laporan from "./Views/Laporan/Laporan";
import LaporanGuru from "./Views/Laporan/Guru/LaporanGuru";
import LaporanKelas from "./Views/Laporan/Kelas/LaporanKelas";

const RouteApp = () => {
  return (
    <Router>
      <Routes>
        {/* Route tanpa Layout */}
        <Route path="/login" element={<Authentikasi />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/management" element={<Management />} />
          <Route path="/management/pegawai" element={<Pegawai />} />
          <Route path="/management/kegiatan-guru" element={<Kegiatan />} />
          <Route path="/management/mapel" element={<Mapel />} />
          <Route path="/management/kelas" element={<Kelas />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/setting/title" element={<InputTitle />} />
          <Route path="/setting/tahun-ajaran" element={<InputTahunAjaran />} />
          <Route path="/setting/banner" element={<Banner />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/laporan/guru" element={<LaporanGuru />} />
          <Route path="/laporan/kelas" element={<LaporanKelas />} />
        </Route>
        <Route path="*" element={<HalamanNotFound />} />
      </Routes>
      <Toaster
        position="bottom-center"
        richColors
        closeButton
        duration={3000}
      />
    </Router>
  );
};

export default RouteApp;
