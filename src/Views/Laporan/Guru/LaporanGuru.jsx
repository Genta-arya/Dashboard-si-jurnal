import React, { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import { toast } from "sonner";
import { GetData } from "@/Services/Auth/Management.services";
import { GetJurnalById } from "@/Services/Auth/Jurnal.services";
import { DateTime } from "luxon";
import { useReactToPrint } from "react-to-print";
import Loading from "@/components/Loading";
import Kop from "@/components/Kop";
import ContainerMenu from "@/components/ContainerMenu";
import { Helmet } from "react-helmet-async";

const LaporanGuru = () => {
  const [loading, setLoading] = useState(true);
  const [dataPegawai, setDataPegawai] = useState([]);
  const [selectedPegawai, setSelectedPegawai] = useState(null);
  const [jurnalGuru, setJurnalGuru] = useState([]);
  const [filteredMapel, setFilteredMapel] = useState([]);
  const [selectedMapel, setSelectedMapel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [infoCetak, setInfoCetak] = useState({
    semester: "",
    tahunAjaran: "",
    tanggalCetak: "",
    namaWaka: "",
    nipWaka: "",
    nipGuru: "",
  });
  const [year, setYear] = useState(DateTime.now().year.toString());
  const printRef = useRef();

  const fetchDataGuru = async () => {
    try {
      const response = await GetData("pegawai");
      const originalData = response.data.user || [];

      // Repeat x10

      setDataPegawai(originalData);
    } catch (error) {
      toast.error("Gagal mengambil data pegawai");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataGuru();
  }, []);

  const handleSelectChange = async (selected) => {
    setSelectedPegawai(selected);
    setSelectedMapel(null); // reset mapel saat ganti guru
    if (!selected?.value) return;

    try {
      setLoading(true);
      const response = await GetJurnalById(selected.value, year);
      const allJurnal = response.data?.data || [];

      setJurnalGuru(allJurnal);

      const mapelList = Array.from(
        new Set(allJurnal.map((j) => j.mataPelajaran))
      ).map((m) => ({ value: m, label: m }));

      setFilteredMapel(mapelList);
    } catch (error) {
      console.log(error);
      toast.error("Gagal mengambil jurnal guru");
    } finally {
      setLoading(false);
    }
  };

  const options = dataPegawai.map((p) => ({
    value: p.id,
    label: p.name,
  }));
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
      document.title = "Rekap_jurnal_guru";
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

  useEffect(() => {
    const savedInfo = localStorage.getItem("infoCetak");
    if (savedInfo) {
      setInfoCetak(JSON.parse(savedInfo));
    }
  }, []);

  // Save info to localStorage
  useEffect(() => {
    localStorage.setItem("infoCetak", JSON.stringify(infoCetak));
  }, [infoCetak]);

  const handlePrint = () => {
    if (!printRef.current) {
      toast.error("Tidak ada konten untuk dicetak");
      return;
    }
    printNow();
  };

  useEffect(() => {
    const fetchJurnalOnYearChange = async () => {
      if (!selectedPegawai?.value) return;

      try {
        setLoading(true);
        const response = await GetJurnalById(selectedPegawai.value, year);
        const allJurnal = response.data || [];

        setJurnalGuru(allJurnal);

        const mapelList = Array.from(
          new Set(allJurnal.map((j) => j.mataPelajaran))
        ).map((m) => ({ value: m, label: m }));

        setFilteredMapel(mapelList);
        setSelectedMapel(null); // reset mapel saat ganti tahun
      } catch (error) {
        console.log(error);
        toast.error("Gagal mengambil jurnal guru");
      } finally {
        setLoading(false);
      }
    };

    fetchJurnalOnYearChange();
  }, [year, selectedPegawai]);

  if (loading) return <Loading />;

  return (
    <ContainerMenu text={"Rekap Jurnal Guru"}>
      <Helmet>
        <title>Rekap Jurnal Guru - SMKN 2 Ketapang</title>
      </Helmet>
      <div className="p-4 text-sm">
        <div className="mb-4 w-full">
          <p className="mb-2">Nama Guru</p>
          <Select
            options={options}
            value={selectedPegawai}
            onChange={handleSelectChange}
            placeholder="Pilih Guru"
            isClearable
          />
          {!selectedPegawai && (
            <p className="mt-2 text-red-500 font-semibold">
              Silahkan pilih Guru terlebih dahulu
            </p>
          )}
        </div>

        {selectedPegawai && (
          <>
            <div className="mt-2">
              <p>Tahun Ajaran</p>

              <Select
                className="mt-2"
                options={tahunAjaranOptions}
                value={tahunAjaranOptions.find((opt) => opt.value === year)}
                onChange={(val) => {
                  setYear(val?.value || "");
                }}
                placeholder="Pilih Tahun Ajaran"
              />
              <div className="mb-4 w-full mt-6">
                <p className="mb-2">Mata Pelajaran</p>
                <Select
                  options={filteredMapel}
                  value={selectedMapel}
                  onChange={(e) => setSelectedMapel(e)}
                  placeholder="Pilih Mata Pelajaran"
                  isDisabled={filteredMapel.length === 0}
                />

                {!selectedMapel && filteredMapel.length !== 0 && (
                  <p className="mt-2 text-red-500">
                    Silahkan pilih Mata pelajaran terlebih dahulu
                  </p>
                )}
              </div>
              {filteredMapel.length === 0 && (
                <p className="mt-16 text-base font-bold text-red-500 text-center">
                  Jurnal {selectedPegawai.label} Tahun {year} tidak ditemukan
                </p>
              )}
            </div>

            {selectedMapel && (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 w-full text-white px-4 py-2 rounded"
                  >
                    Cetak
                  </button>
                </div>

                {showModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-[70%]  space-y-3 shadow-lg">
                      <h2 className="font-bold text-center text-lg">
                        Informasi Cetak
                      </h2>

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
                              localStorage.removeItem("infoCetak"),
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
                          onClick={handlePrint}
                        >
                          Cetak Sekarang
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={printRef} className="p-4 text-xs">
                  <Kop />
                  <h2 className="text-xl font-bold text-center mb-4 uppercase mt-4">
                    Rekapitulasi Jurnal Mengajar Guru <br /> SMK Negeri 2
                    Ketapang
                  </h2>

                  <div className="mb-6 grid gap-y-1 text-sm w-full max-w-md">
                    <div className="grid grid-cols-[150px_auto]">
                      <span className="font-semibold">NAMA GURU</span>
                      <span>: {selectedPegawai.label || ".........."}</span>
                    </div>
                    <div className="grid grid-cols-[150px_auto]">
                      <span className="font-semibold">MATA PELAJARAN</span>
                      <span>: {selectedMapel.label || ".........."}</span>
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

                  <table className="table-auto w-full border border-black border-collapse">
                    <thead>
                      <tr className="bg-gray-200 text-center">
                        <th
                          className="border border-black px-2 py-1"
                          rowSpan="2"
                        >
                          NO
                        </th>
                        <th
                          className="border border-black px-2 py-1"
                          rowSpan="2"
                        >
                          TANGGAL MENGAJAR
                        </th>
                        <th
                          className="border border-black px-2 py-1"
                          rowSpan="2"
                        >
                          KELAS
                        </th>
                        <th
                          className="border border-black px-2 py-1"
                          rowSpan="2"
                        >
                          JAM KE
                        </th>
                        <th
                          className="border border-black px-2 py-1"
                          rowSpan="2"
                        >
                          MATERI PEMBELAJARAN
                        </th>
                        <th
                          className="border border-black px-2 py-1"
                          rowSpan="2"
                        >
                          KEGIATAN GURU
                        </th>
                        <th
                          className="border border-black px-2 py-1"
                          colSpan="2"
                        >
                          KEHADIRAN SISWA
                        </th>
                        <th
                          className="border border-black px-2 py-1"
                          rowSpan="2"
                        >
                          KET
                        </th>
                      </tr>
                      <tr className="bg-gray-200 text-center">
                        <th className="border border-black px-2 py-1">HADIR</th>
                        <th className="border border-black px-2 py-1">
                          TIDAK HADIR
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jurnalGuru
                        .filter(
                          (jurnal) =>
                            jurnal.mataPelajaran === selectedMapel?.value
                        )
                        .map((jurnal, index) => (
                          <tr key={jurnal.id} className="text-center">
                            <td className="border border-black p-1">
                              {index + 1}
                            </td>
                            <td className="border border-black p-1 w-24">
                              {DateTime.fromISO(
                                jurnal.tanggalMengajar
                              ).toFormat("dd-MM-yyyy")}
                            </td>
                            <td className="border border-black p-1">
                              {jurnal.kelas}
                            </td>
                            <td className="border border-black p-1">
                              {JSON.parse(jurnal.jamKe).join(", ")}
                            </td>
                            <td className="border border-black p-1">
                              {jurnal.materi}
                            </td>
                            <td className="border border-black w-52 p-1">
                              {JSON.parse(jurnal.kegiatan).join(", ")}
                            </td>
                            <td className="border border-black p-1">
                              {jurnal.siswaHadir}
                            </td>
                            <td className="border border-black p-1">
                              {jurnal.siswaTidakHadir}
                            </td>
                            <td className="border border-black w-72 p-1"></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  <div className="grid grid-cols-2 mt-7 text-sm">
                    <div className="text-left ">
                      <p>Mengetahui,</p>
                      <p>Waka. Bidang Kurikulum</p>
                      <div className="">
                        <p className="font-bold pt-20">
                          {infoCetak.namaWaka ||
                            ".............................."}
                        </p>
                        <p>
                          NIP.{" "}
                          {infoCetak.nipWaka || ".........................."}
                        </p>
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
                      <p>Guru Mata Pelajaran</p>
                      <div className="">
                        <p className="underline pt-20">
                          {selectedPegawai.label || "......................"}
                        </p>
                        <p>
                          NIP.{" "}
                          {infoCetak.nipGuru || ".........................."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </ContainerMenu>
  );
};

export default LaporanGuru;
