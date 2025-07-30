import ContainerMenu from "@/components/ContainerMenu";
import React, { useEffect, useState } from "react";
import { GetDataWeb, UpdateDataWeb } from "@/Services/Auth/SettingWeb.services";
import { toast } from "sonner";
import Loading from "@/components/Loading";

const InputTahunAjaran = () => {
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [loading, setLoading] = useState(true);
  const [recordId, setRecordId] = useState(null);

  // Ambil data dari API
  const fetchTahunAjaran = async () => {
    try {
      const response = await GetDataWeb();
      const item = response.data?.[0];
      if (item) {
        setTahunAjaran(item.tahun_ajaran || "");
        setRecordId(item.id); // untuk update nanti
      }
    } catch (error) {
      toast.error("Gagal mengambil data tahun ajaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTahunAjaran();
  }, []);

  const handleSubmit = async () => {
    if (!tahunAjaran.trim()) {
      toast.warning("Tahun ajaran tidak boleh kosong");
      return;
    }
 setLoading(true);
    try {
      await UpdateDataWeb({
        id: recordId,
        tahun_ajaran: tahunAjaran,
        type: "tahun_ajaran",
      });
      toast.success("Tahun ajaran berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui tahun ajaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerMenu text={"Tahun Ajaran Form"}>
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-4 ">
          <label className="block">
            <span className="text-gray-700 font-medium">Text Tahun Ajaran</span>
            <input
              type="text"
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tahunAjaran}
              onChange={(e) => setTahunAjaran(e.target.value)}
              placeholder="Contoh: Semester Genap Tahun Pelajaran 2025/2026"
            />
          </label>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 w-full bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      )}
    </ContainerMenu>
  );
};

export default InputTahunAjaran;
