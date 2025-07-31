import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Container from "@/components/container";
import Headers from "@/components/Headers";
import useUserStore from "@/lib/AuthZustand";
import { Helmet } from "react-helmet-async";
import { DateTime } from "luxon";
import {
  tableBase,
  tableWrapper,
  tbodyClass,
  tdClass,
  thClass,
  theadClass,
  trHoverClass,
} from "../../Constant/TableSyles";
import { GetJurnalHarian } from "@/Services/Auth/Jurnal.services";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";
import { FaFileExcel } from "react-icons/fa";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useUserStore();
  const [jurnalData, setJurnalData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() =>
    DateTime.now().setZone("Asia/Jakarta").toISODate()
  );
  const [loading, setLoading] = useState(false);
  // Tambahkan useState untuk searchTerm
  const [searchTerm, setSearchTerm] = useState("");

  // Fungsi handler untuk input pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter data berdasarkan searchTerm
  const filteredData = jurnalData.filter((item) =>
    item.namaGuru.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formattedDate = selectedDate
    ? DateTime.fromISO(selectedDate)
        .setZone("Asia/Jakarta")
        .setLocale("id")
        .toLocaleString({
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
    : "";

  const fetchData = async () => {
    setLoading(true);
    try {
      const dateISO = DateTime.fromISO(selectedDate)
        .setZone("Asia/Jakarta")
        .toISODate(); // ⬅️ hanya kirim "YYYY-MM-DD"

      const response = await GetJurnalHarian({ date: dateISO });
      setJurnalData(response.data || []);
    } catch (error) {
      toast.error("Gagal mengambil data jurnal harian");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);
  const handleExportRekapJurnal = async (jurnalData, selectedDate) => {
    const dt = DateTime.fromISO(selectedDate); // selectedDate = '2025-07-28'
    const tanggalFormatted = dt.toFormat("dd-MM-yyyy");
    const hari = dt.setLocale("id").toFormat("cccc"); // e.g. "Senin"

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Rekap Jurnal");

    // Judul
    worksheet.mergeCells("A1:K1");
    worksheet.getCell("A1").value =
      "REKAP JURNAL MENGAJAR HARIAN SMKN 2 KETAPANG";
    worksheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getCell("A1").font = { bold: true, size: 14 };

    // Tanggal & Hari
    worksheet.getCell("A2").value = `Tanggal: ${tanggalFormatted}`;
    worksheet.getCell("A3").value = `Hari: ${hari}`;
    worksheet.getCell("A3").font = { bold: true };

    // Header
    const header = [
      "No",
      "Nama Guru",
      "Tanggal",
      "Mata Pelajaran",
      "Kelas",
      "Jam Ke",
      "Kegiatan",
      "Materi Pembelajaran",
      "Hadir",
      "Tidak Hadir",
      "Bukti KBM",
    ];
    worksheet.addRow(header);

    // Styling header
    const headerRow = worksheet.getRow(4);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Isi data
    for (let i = 0; i < jurnalData.length; i++) {
      const item = jurnalData[i];
      const jamKe = JSON.parse(item.jamKe).join(", ");
      const kegiatan = JSON.parse(item.kegiatan).join(", ");
      const formattedDate = DateTime.fromISO(item.tanggalMengajar).toFormat(
        "dd/MM/yyyy"
      );

      const rowIndex = worksheet.lastRow.number + 1;
      const rowValues = [
        i + 1,
        item.namaGuru,
        formattedDate,
        item.mataPelajaran,
        item.kelas,
        jamKe,
        kegiatan,
        item.materi,
        item.siswaHadir,
        item.siswaTidakHadir,
        "", // Bukti KBM
      ];

      worksheet.addRow(rowValues);

      const row = worksheet.getRow(rowIndex);
      row.height = 80;
      row.eachCell((cell) => {
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Link "Lihat" di kolom Bukti KBM
      if (item.buktiFoto) {
        const cell = worksheet.getCell(`K${rowIndex}`);
        cell.value = { text: "Lihat", hyperlink: item.buktiFoto };
        cell.font = { color: { argb: "FF0000FF" }, underline: true };
      }
    }

    // Atur lebar kolom
    worksheet.columns = [
      { width: 5 }, // No
      { width: 25 }, // Nama Guru
      { width: 15 }, // Tanggal
      { width: 20 }, // Mata Pelajaran
      { width: 15 }, // Kelas
      { width: 10 }, // Jam Ke
      { width: 30 }, // Kegiatan
      { width: 30 }, // Materi Pembelajaran
      { width: 10 }, // Hadir
      { width: 10 }, // Tidak Hadir
      { width: 15 }, // Bukti KBM
    ];

    // Export ke file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Rekap_Jurnal_Harian_${tanggalFormatted}.xlsx`);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  if (loading) return <Loading />;

  return (
    <>
      <Helmet>
        <title>SIJURNAL - SMKN 2 Ketapang</title>
      </Helmet>
      <Headers user={user} />

      <Container>
        <div className="flex flex-col mt-5 md:flex-row items-start md:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl font-bold">
            Laporan Jurnal Mengajar {formattedDate}
          </h2>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border px-3 w-full lg:w-fit md:w-fit outline-none py-1 rounded-md text-sm"
          />
        </div>

        <div className="w-full">
          <input
            type="text"
            placeholder="Cari nama guru..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border w-full mb-4 px-3 outline-none py-2 rounded-md text-sm"
          />
        </div>
        {jurnalData.length !== 0 && (
          <div className="flex flex-col justify-end sm:flex-row gap-3  mb-4">
            <button
              onClick={() => handleExportRekapJurnal(jurnalData, selectedDate)}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
            >
              <div className="flex gap-4 items-center">
                <p>Download</p>
                <FaFileExcel />
              </div>
            </button>
          </div>
        )}

        {filteredData.length === 0 ? (
          <p className="text-gray-500 text-center mt-14">
            {jurnalData.length === 0
              ? "     Tidak ada data jurnal pada tanggal ini."
              : "     Data Pencarian tidak ditemukan"}
          </p>
        ) : (
          <div className={tableWrapper}>
            <table className={tableBase}>
              <thead className={theadClass}>
                <tr>
                  <th className={thClass}>#</th>
                  <th className={thClass}>Nama Guru</th>
                  <th className={thClass}>Tanggal</th>
                  <th className={thClass}>Mata pelajaran</th>
                  <th className={thClass}>Kelas</th>
                  <th className={thClass}>Jam Ke</th>
                  <th className={thClass}>Kegiatan</th>
                  <th className={thClass}>Materi Pembelajaran</th>
                  <th className={thClass}>Hadir</th>
                  <th className={thClass}>Tidak Hadir</th>
                  <th className={thClass}>Bukti KBM</th>
                </tr>
              </thead>
              <tbody className={tbodyClass}>
                {jurnalData.map((item, index) => (
                  <tr key={item.id} className={trHoverClass}>
                    <td className={tdClass}>{index + 1}</td>
                    <td className={tdClass}>{item.namaGuru}</td>
                    <td className={tdClass}>
                      {DateTime.fromISO(item.tanggalMengajar)
                        .setZone("Asia/Jakarta")
                        .setLocale("id")
                        .toFormat("dd-MM-yyyy")}
                    </td>
                    <td className={tdClass}>{item.mataPelajaran}</td>
                    <td className={tdClass}>{item.kelas}</td>
                    <td className={tdClass}>
                      {JSON.parse(item.jamKe).join(", ")}
                    </td>
                    <td className={tdClass}>
                      {JSON.parse(item.kegiatan).join(", ")}
                    </td>
                    <td className={tdClass}>{item.materi}</td>
                    <td className={tdClass}>{item.siswaHadir}</td>
                    <td className={tdClass}>{item.siswaTidakHadir}</td>
                    <td className={tdClass}>
                      <img
                        onClick={() => window.open(item.buktiFoto)}
                        src={item.buktiFoto}
                        alt="Bukti KBM"
                        className="w-32 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
