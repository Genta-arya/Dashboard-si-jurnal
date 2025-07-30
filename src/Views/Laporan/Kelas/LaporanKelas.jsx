import React, { useEffect, useState, useRef, useMemo } from "react";
import ContainerMenu from "@/components/ContainerMenu";
import { GetData } from "@/Services/Auth/Management.services";
import Select from "react-select";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import { GetJurnalByname } from "@/Services/Auth/Jurnal.services";
import { DateTime } from "luxon";
import Kop from "@/components/Kop";
import Loading from "@/components/Loading";
import { data } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const LaporanKelas = () => {
  const [kelasList, setKelasList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [dataRekap, setDataRekap] = useState([]);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [year, setYear] = useState(DateTime.now().year.toString());

  const [infoCetak, setInfoCetak] = useState({
    semester: "",
    tahunAjaran: "",
    tanggalCetak: "",
    namaWaka: "",
    namaGuru: "",
    nipWaka: "",
    nipGuru: "",
  });
  const fetchKelas = async () => {
    try {
      const response = await GetData("kelas");
      const options = response.data?.kelas?.map((k) => ({
        value: k.nama_kelas,
        label: k.nama_kelas,
      }));
      setKelasList(options || []);
    } catch (error) {
      toast.error("Gagal mengambil data kelas");
    }
  };

  const fetchRekap = async (namaKelas) => {
    try {
      setLoading(true);
      const response = await GetJurnalByname(namaKelas, year);
      setDataRekap(response.data || []);
    } catch (error) {
      toast.error("Gagal mengambil data rekap");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKelas();
  }, []);
  useEffect(() => {
    const savedInfo = localStorage.getItem("infoCetakKelas");
    if (savedInfo) {
      setInfoCetak(JSON.parse(savedInfo));
    }
  }, []);

  // Save info to localStorage
  useEffect(() => {
    localStorage.setItem("infoCetakKelas", JSON.stringify(infoCetak));
  }, [infoCetak]);

  useEffect(() => {
    if (selectedKelas) {
      fetchRekap(selectedKelas.value);
    }
  }, [selectedKelas, year]);
  const tahunAjaranOptions = useMemo(() => {
    const currentYear = DateTime.now().year;
    const startYear = 1900;
    const endYear = currentYear + 50;

    return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
      const year = startYear + i;
      return {
        label: `${year}`,
        value: `${year}`,
      };
    });
  }, []);

  const printNow = useReactToPrint({
    content: () => printRef.current,
    onBeforePrint: () => {
      // Simpan title lama untuk dikembalikan
      window.oldTitle = document.title;
      document.title = "REKAPITULASI JURNAL MENGAJAR GURU PER KELAS";
    },
    onAfterPrint: () => {
      // Kembalikan title semula
      document.title = window.oldTitle || "Document";
      setShowModal(false);
    },
    pageStyle: `
     @page {
       size: A4;
       margin: 5mm;
     }
     body {
       -webkit-print-color-adjust: exact;
       print-color-adjust: exact;
       background: white;
     }
   `,
  });

  if (loading) return <Loading />;

  return (
    <ContainerMenu text={"Rekapitulasi Jurnal Mengajar Guru per Kelas"}>
      <Helmet>
        <title>Rekap Jurnal Kelas - SMKN 2 Ketapang</title>
      </Helmet>
      <div className="mb-4">
        <div className="flex flex-col gap-2">
          <p className="mb-2">Kelas</p>
          <Select
            options={kelasList}
            value={selectedKelas}
            onChange={(val) => setSelectedKelas(val)}
            placeholder="Pilih Kelas"
            isClearable
          />

          {selectedKelas && (
            <>
              <p className="">Tahun Ajaran</p>
              <Select
                options={tahunAjaranOptions}
                value={tahunAjaranOptions.find((opt) => opt.value === year)}
                onChange={(val) => {
                  setYear(val?.value || "");
                }}
                placeholder="Pilih Tahun Ajaran"
              />
            </>
          )}
        </div>

        {selectedKelas && (
          <button
            onClick={() => setShowModal(true)}
            disabled={dataRekap.length === 0}
            className="mt-4 px-4 disabled:bg-gray-500 py-2 w-full bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Cetak Rekap
          </button>
        )}
      </div>

      {dataRekap.length > 0 && selectedKelas && (
        <div ref={printRef} className="bg-white text-black p-4">
          <Kop />
          <h2 className="text-center font-bold uppercase text-base mb-1">
            REKAPITULASI JURNAL MENGAJAR GURU PADA TIAP KELAS
          </h2>
          <h3 className="text-center font-bold uppercase text-base mb-4">
            SMK NEGERI 2 KETAPANG
          </h3>

          <div className="mb-6 grid gap-y-1 text-sm w-full max-w-md">
            <div className="grid grid-cols-[150px_auto]">
              <span className="font-semibold">KELAS / KK</span>
              <span>: {selectedKelas.label || ".........."}</span>
            </div>

            <div className="grid grid-cols-[150px_auto]">
              <span className="font-semibold">SEMESTER</span>
              <span>: {infoCetak.semester || ".........."}</span>
            </div>
            <div className="grid grid-cols-[150px_auto]">
              <span className="font-semibold">TAHUN AJARAN</span>
              <span>: {infoCetak.tahunAjaran || ".........."}</span>
            </div>
          </div>

          <table className="w-full border border-black text-sm">
            <thead>
              <tr className="text-center font-bold">
                <th className="border border-black p-1" rowSpan={2}>
                  NO
                </th>
                <th className="border border-black p-1" rowSpan={2}>
                  MATA PELAJARAN
                </th>
                <th className="border border-black p-1" rowSpan={2}>
                  NAMA GURU
                </th>
                <th className="border border-black p-1" colSpan={4}>
                  JUMLAH STATUS KEHADIRAN
                </th>
              </tr>
              <tr className="text-center font-bold">
                <th className="border border-black p-1">HADIR</th>
                <th className="border border-black p-1">SAKIT</th>
                <th className="border border-black p-1">IZIN</th>
                <th className="border border-black p-1">DINAS LUAR</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center border p-2">
                    Memuat data...
                  </td>
                </tr>
              ) : dataRekap.length > 0 ? (
                dataRekap.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-black p-1">{index + 1}</td>
                    <td className="border border-black p-1">
                      {item.mataPelajaran}
                    </td>
                    <td className="border border-black p-1">{item.namaGuru}</td>
                    <td className="border border-black p-1">
                      {item["Hadir"] || 0}
                    </td>
                    <td className="border border-black p-1">
                      {item["Sakit"] || 0}
                    </td>
                    <td className="border border-black p-1">
                      {item["Izin"] || 0}
                    </td>
                    <td className="border border-black p-1">
                      {item["Dinas Luar"] || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {selectedKelas && (
                    <td colSpan={7} className="text-center border p-2">
                      Data belum tersedia.
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>

          <div className="grid grid-cols-2 mt-7 text-sm">
            <div className="text-left ">
              <p>Mengetahui,</p>
              <p>Waka. Bidang Kurikulum</p>
              <div className="">
                <p className="font-bold pt-20">
                  {infoCetak.namaWaka || ".............................."}
                </p>
                <p>NIP. {infoCetak.nipWaka || ".........................."}</p>
              </div>
            </div>
            <div className="text-right ">
              <p>
                Ketapang,{" "}
                {infoCetak.tanggalCetak
                  ? DateTime.fromISO(infoCetak.tanggalCetak).toFormat(
                      "dd LLLL yyyy"
                    )
                  : "...................."}
              </p>
              <p>Wali kelas</p>
              <div className="">
                <p className="underline pt-20">
                  {infoCetak.namaGuru || "......................"}
                </p>
                <p>NIP. {infoCetak.nipGuru || ".........................."}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedKelas && dataRekap.length < 1 && (
        <div className="text-center text-sm mt-10 text-red-500 font-bold">
          Rekap data tidak tersedia.
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-[70%]  space-y-3 shadow-lg">
            <h2 className="font-bold text-center text-lg">Informasi Cetak</h2>

            <input
              type="text"
              placeholder="Semester"
              className="w-full border p-2"
              value={infoCetak.semester}
              onChange={(e) =>
                setInfoCetak({
                  ...infoCetak,
                  semester: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Tahun Ajaran"
              className="w-full border p-2"
              value={infoCetak.tahunAjaran}
              onChange={(e) =>
                setInfoCetak({
                  ...infoCetak,
                  tahunAjaran: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="w-full border p-2"
              value={infoCetak.tanggalCetak}
              onChange={(e) =>
                setInfoCetak({
                  ...infoCetak,
                  tanggalCetak: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Nama Waka Kurikulum"
              className="w-full border p-2"
              value={infoCetak.namaWaka}
              onChange={(e) =>
                setInfoCetak({
                  ...infoCetak,
                  namaWaka: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="NIP Waka Kurikulum"
              className="w-full border p-2"
              value={infoCetak.nipWaka}
              onChange={(e) =>
                setInfoCetak({
                  ...infoCetak,
                  nipWaka: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Nama Wali kelas"
              className="w-full border p-2"
              value={infoCetak.namaGuru}
              onChange={(e) =>
                setInfoCetak({
                  ...infoCetak,
                  namaGuru: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="NIP Guru Mata Pelajaran"
              className="w-full border p-2"
              value={infoCetak.nipGuru}
              onChange={(e) =>
                setInfoCetak({
                  ...infoCetak,
                  nipGuru: e.target.value,
                })
              }
            />
            <div className="flex justify-between mt-4">
              <div className="flex gap-2">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  className="bg-red-400 text-white px-4 py-2 rounded"
                  onClick={() => {
                    localStorage.removeItem("infoCetakKelas"),
                      setInfoCetak({
                        namaWaka: "",
                        nipWaka: "",
                        semester: "",
                        tahunAjaran: "",
                        tanggalCetak: "",
                        nipGuru: "",
                      });
                  }}
                >
                  Reset
                </button>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  printNow();
                  setShowModal(false);
                }}
              >
                Cetak Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </ContainerMenu>
  );
};

export default LaporanKelas;
