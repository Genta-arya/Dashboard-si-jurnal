import React from "react";
import MenuManagement from "./MenuManagement";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Management = () => {
  return (
    <>
      <Helmet>
        <title>Management - SMKN 2 Ketapang</title>
      </Helmet>
      <MenuManagement />
    </>
  );
};

export default Management;
