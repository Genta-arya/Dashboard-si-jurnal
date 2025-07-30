import React from "react";
import { Helmet } from "react-helmet-async";
import MenuSetting from "./MenuSetting";

const Setting = () => {
  return (
    <>
      <Helmet>
        <title>Setting - SMKN 2 Ketapang</title>
      </Helmet>
      <MenuSetting />

      <div className="border rounded-lg overflow-hidden shadow mt-8">
        <p className="text-center font-bold border-8">
            Preview Formulir
        </p>
        <iframe
          src="https://formt-jurnal-mengajar.vercel.app/"
          title="Preview Form Setting"
          width="100%"
          height="600px"
          className="w-full border-none"
        ></iframe>
      </div>
    </>
  );
};

export default Setting;
