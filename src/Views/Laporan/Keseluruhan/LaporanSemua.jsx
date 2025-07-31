import ContainerMenu from "@/components/ContainerMenu";
import React, { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { toast } from "sonner";
import { GetJurnalTahunan } from "@/Services/Auth/Jurnal.services";
import Loading from "@/components/Loading";
import { useReactToPrint } from "react-to-print";
import Kop from "@/components/Kop";
import { Helmet } from "react-helmet-async";
const LaporanSemua = () => {
  const printRef = useRef();
  const [year, setYear] = useState(DateTime.now().year.toString());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoCetak, setInfoCetak] = useState({
    semester: "",
    tahunAjaran: "",
    namaWaka: "",
    namaKepsek: "",
    nipWaka: "",
    nipKepsek: "",
  });

  const [showModal, setShowModal] = useState(false);
  const printNow = useReactToPrint({
    content: () => printRef.current,
    onBeforePrint: () => {
      // Simpan title lama untuk dikembalikan
      window.oldTitle = document.title;
      document.title = "REKAPITULASI JURNAL MENGAJAR GURU ";
    },
    onAfterPrint: () => {
      // Kembalikan title semula
      document.title = window.oldTitle || "Document";
      setShowModal(false);
    },
    pageStyle: `
       @page {
     size: A4 landscape;
         margin: 5mm;
       }
        //  Landscape
         
    
       body {
         -webkit-print-color-adjust: exact;
         print-color-adjust: exact;
         background: white;
       }
     `,
  });

  useEffect(() => {
    const savedInfo = localStorage.getItem("infoCetakeseluruhan");
    if (savedInfo) {
      setInfoCetak(JSON.parse(savedInfo));
    }
  }, []);

  // Save info to localStorage
  useEffect(() => {
    localStorage.setItem("infoCetakkeseluruhan", JSON.stringify(infoCetak));
  }, [infoCetak]);

  const handlePrint = () => {
    if (!printRef.current) {
      toast.error("Tidak ada konten untuk dicetak");
      return;
    }
    printNow();
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await GetJurnalTahunan({ year });
      setData(response.data || []);
    } catch (error) {
      toast.error("Gagal mengambil data laporan keseluruhan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  return (
    <ContainerMenu text={"Laporan Keseluruhan"}>
      <Helmet>
        <title>Rekap Jurnal Keseluruhan - SMKN 2 Ketapang</title>
      </Helmet>
      <div className="text-center mb-4"></div>

      <label className="font-medium">Pilih Tahun:</label>
      <div className="mb-4">
        <div>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border w-full p-2 rounded "
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-blue-600 w-full mb-10 text-white rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Cetak Sekarang
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div ref={printRef} className="overflow-auto">
          <Kop />
          <h2 className="text-lg text-center mb-10 mt-10 font-bold uppercase">
            Rekapitulasi Jurnal Mengajar Guru SMK Negeri 2 Ketapang
          </h2>

          <div className="mb-6 grid gap-y-1 text-sm w-full max-w-md">
            <div className="grid grid-cols-[150px_auto]">
              <span className="font-semibold">SEMESTER</span>
              <span>: {infoCetak.semester || ".........."}</span>
            </div>
            <div className="grid grid-cols-[150px_auto]">
              <span className="font-semibold">TAHUN AJARAN</span>
              <span>: {infoCetak.tahunAjaran || ".........."}</span>
            </div>
          </div>
          <table className="w-full border border-black text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th className="border border-black px-2 py-1" rowSpan={2}>
                  No
                </th>
                <th className="border border-black px-2 py-1" rowSpan={2}>
                  Tanggal Mengajar
                </th>
                <th className="border border-black px-2 py-1" rowSpan={2}>
                  Nama Guru
                </th>
                <th className="border border-black px-2 py-1" rowSpan={2}>
                  Mata Pelajaran
                </th>
                <th className="border border-black px-2 py-1" rowSpan={2}>
                  Kelas
                </th>
                <th className="border border-black px-2 py-1" rowSpan={2}>
                  Jam Ke-
                </th>
                <th className="border border-black px-2 py-1" rowSpan={2}>
                  Status Kehadiran
                </th>
                <th className="border border-black px-2 py-1" rowSpan={2}>
                  Materi Pembelajaran
                </th>
                <th className="border border-black px-2 py-1" rowSpan={2}>
                  Kegiatan Guru
                </th>
                <th className="border border-black px-2 py-1" colSpan={2}>
                  Kehadiran Siswa
                </th>
                <th className="border border-black px-2 py-1" rowSpan={2}>
                  Ket
                </th>
              </tr>
              <tr className="bg-gray-200 text-center">
                <th className="border border-black px-2 py-1">Hadir</th>
                <th className="border border-black px-2 py-1">Tidak Hadir</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={item.id} className="break-inside-avoid">
                  <td className="border border-black px-2 py-1 text-center">
                    {index + 1}
                  </td>
                  <td className="border w-20 text-center border-black px-2 py-1">
                    {DateTime.fromISO(item.tanggalMengajar).toFormat(
                      "dd-MM-yyyy"
                    )}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {item.namaGuru}
                  </td>
                  <td className="border w-20 border-black px-2 py-1">
                    {item.mataPelajaran}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {item.kelas}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {(() => {
                      try {
                        const parsed = JSON.parse(item.jamKe);
                        return Array.isArray(parsed)
                          ? parsed.join(", ")
                          : item.jamKe;
                      } catch {
                        return item.jamKe;
                      }
                    })()}
                  </td>

                  <td className="border border-black px-2 py-1 text-center">
                    {item.statusKehadiran}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {(() => {
                      try {
                        const parsed = JSON.parse(item.materi);
                        return Array.isArray(parsed) ? (
                          <ol className="list-decimal pl-4">
                            {parsed.map((m, i) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ol>
                        ) : (
                          item.materi
                        );
                      } catch {
                        return item.materi;
                      }
                    })()}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {(() => {
                      try {
                        const parsed = JSON.parse(item.kegiatan);
                        return Array.isArray(parsed) ? (
                          <ol className="list-decimal pl-4">
                            {parsed.map((k, i) => (
                              <li key={i}>{k}</li>
                            ))}
                          </ol>
                        ) : (
                          item.kegiatan
                        );
                      } catch {
                        return item.kegiatan;
                      }
                    })()}
                  </td>
                  <td className="border border-black px-2 py-1 text-center">
                    {item.siswaHadir}
                  </td>
                  <td className="border border-black px-2 py-1 text-center">
                    {item.siswaTidakHadir}
                  </td>
                  <td className="border w-32 text-center border-black px-2 py-1"></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-20 text-sm">
            <div className="flex justify-between">
              <div>
                <p>Mengetahui,</p>
                <p>Waka. Bidang Kurikulum</p>
                <div className="mt-16">
                  <p className="underline font-bold pt-10">
                    {infoCetak.namaWaka || "......................"}
                  </p>
                  <p>
                    NIP. {infoCetak.nipWaka || ".........................."}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p>Ketapang,</p>
                <p>Plt. Kepala Sekolah</p>
                <div className="mt-16">
                  <p className="underline pt-10">
                    {infoCetak.namaKepsek || "......................"}
                  </p>
                  <p>
                    NIP. {infoCetak.nipKepsek || ".........................."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded lg:w-[70%] md:w-[70%] w-[90%]  space-y-3 shadow-lg">
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
              placeholder="Nama Kepala Sekolah"
              className="w-full border p-2"
              value={infoCetak.namaKepsek}
              onChange={(e) =>
                setInfoCetak({
                  ...infoCetak,
                  namaKepsek: e.target.value,
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
              placeholder="NIP Kepala Sekolah"
              className="w-full border p-2"
              value={infoCetak.nipKepsek}
              onChange={(e) =>
                setInfoCetak({
                  ...infoCetak,
                  nipKepsek: e.target.value,
                })
              }
            />
            <div className="flex justify-between lg:flex-row md:flex-row flex-col gap-2 mt-4">
              <div className="flex g:flex-row md:flex-row flex-col gap-2">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  className="bg-red-400 text-white px-4 py-2 rounded"
                  onClick={() => {
                    localStorage.removeItem("infocetakkeseluruhan"),
                      setInfoCetak({
                        namaWaka: "",
                        nipWaka: "",
                        semester: "",
                        tahunAjaran: "",
                        nipKepsek: "",

                        namaKepsek: "",
                      });
                  }}
                >
                  Reset
                </button>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handlePrint}
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

export default LaporanSemua;
