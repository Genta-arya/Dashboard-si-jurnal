import React, { useEffect, useRef, useState } from "react";
import ContainerMenu from "@/components/ContainerMenu";
import { GetDataWeb, UpdateDataWeb } from "@/Services/Auth/SettingWeb.services";
import { toast } from "sonner";
import { uploadGambar } from "@/Services/Auth/Auth.services";
import Loading from "@/components/Loading";

const Banner = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const fetchData = async () => {
    try {
      const response = await GetDataWeb();
      const list = response.data || [];
      setData(list);
      setFiltered(list);
    } catch (error) {
      toast.error(error.message || "Gagal mengambil data banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setSelectedBanner(item);
    setShowModal(true);
  };
  const fileInputRef = useRef(null);
 const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
  const fileExtension = file.name.split(".").pop().toLowerCase();
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

  if (!allowedExtensions.includes(fileExtension)) {
    toast.error(
      "Hanya file gambar (jpg, jpeg, png, webp, gif) yang diperbolehkan"
    );
    fileInputRef.current.value = ""; // Kosongkan input
    return;
  }

  if (file.size > maxSizeInBytes) {
    toast.error("Ukuran gambar maksimal 5MB");
    fileInputRef.current.value = ""; // Kosongkan input
    return;
  }

  setNewImage(file);
};

  const handleUpdate = async () => {
    if (!newImage) {
      toast.warning("Pilih gambar terlebih dahulu");
      return;
    }
    setLoading(true);
    setShowModal(false);
    try {
      const formData = new FormData();
      formData.append("file", newImage);

      const uploadImage = await uploadGambar(formData);
      const updatedBanner = {
        ...selectedBanner,
        Banner: uploadImage.data.file_url,
      };
      const updatedData = data.map((item) =>
        item.id === selectedBanner.id ? updatedBanner : item
      );

      await UpdateDataWeb({
        BannerUrl: uploadImage.data.file_url,
        type: "banner",
      });
      toast.success("Banner berhasil diperbarui");
      setData(updatedData);
      setFiltered(updatedData);
      setShowModal(false);
      setNewImage(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerMenu text={"Banner Form"}>
        
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 w-full">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="border p-2 rounded shadow hover:shadow-md transition"
            >
              <img
                src={item.Banner}
                alt={`Banner ${idx + 1}`}
                className="w-full  object-cover rounded"
              />
              <button
                onClick={() => handleEdit(item)}
                className="mt-2  w-full bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Ganti Banner</h2>
            <input
              type="file"
               ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded p-2 w-full"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewImage(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </ContainerMenu>
  );
};

export default Banner;
