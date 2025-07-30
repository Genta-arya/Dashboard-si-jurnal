import React from "react";
import { Helmet } from "react-helmet-async";
import MenuLaporan from "./MenuLaporan";
import ContainerMenu from "@/components/ContainerMenu";

const Laporan = () => {
  return (
    <>
      <Helmet>
        <title>Laporan - SMKN 2 Ketapang</title>
      </Helmet>

      <MenuLaporan />
    </>
  );
};

export default Laporan;
