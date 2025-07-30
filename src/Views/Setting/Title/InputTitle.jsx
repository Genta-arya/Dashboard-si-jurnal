import ContainerMenu from "@/components/ContainerMenu";
import React, { useEffect, useState } from "react";
import { GetDataWeb, UpdateDataWeb } from "@/Services/Auth/SettingWeb.services";
import { toast } from "sonner";
import Loading from "@/components/Loading";

const InputTitle = () => {
  const [msgWelcome, setMsgWelcome] = useState("");
  const [loading, setLoading] = useState(true);
  const [recordId, setRecordId] = useState(null);

  const fetchTitle = async () => {
    try {
      const response = await GetDataWeb();
      const item = response.data?.[0];
      if (item) {
        setMsgWelcome(item.msgWelcome || "");
        setRecordId(item.id);
      }
    } catch (error) {
      toast.error("Gagal mengambil data title");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTitle();
  }, []);

  const handleSubmit = async () => {
    if (!msgWelcome.trim()) {
      toast.warning("Title tidak boleh kosong");
      return;
    }
    setLoading(true);

    try {
      await UpdateDataWeb({
        id: recordId,
        title:msgWelcome,
        type: "title",
      });
      toast.success("Title berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui title");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerMenu text={"Title Form"}>
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-4 ">
          <label className="block">
            <span className="text-gray-700 font-medium">Text Judul Sambutan</span>
            <textarea
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={msgWelcome}
              onChange={(e) => setMsgWelcome(e.target.value)}
              placeholder="Masukkan sambutan selamat datang..."
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

export default InputTitle;
