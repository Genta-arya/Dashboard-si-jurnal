import ContainerMenu from "@/components/ContainerMenu";
import {
  tableBase,
  tableWrapper,
  tbodyClass,
  tdClass,
  thClass,
  theadClass,
  trHoverClass,
} from "@/Constant/TableSyles";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaTrash, FaEdit, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import Loading from "@/components/Loading";
import { Helmet } from "react-helmet-async";
import {
  GetData,
  CreateData,
  DeleteData,
  UpdateData,
} from "@/Services/Auth/Management.services";

const Kegiatan = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editNamaKegiatan, setEditNamaKegiatan] = useState("");
  const [search, setSearch] = useState("");
  const [newNamaKegiatan, setNewNamaKegiatan] = useState("");

  const fetchData = async () => {
    try {
      const response = await GetData("kegiatan");
      const list = response.data.kegiatan || [];
      setData(list);
      setFiltered(list);
    } catch (error) {
      toast.error(error.message || "Gagal mengambil data kegiatan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id, nama_kegiatan) => {
    setEditId(id);
    setEditNamaKegiatan(nama_kegiatan);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditNamaKegiatan("");
  };

  const handleSave = async (id) => {
    setLoading(true);
    try {
      await UpdateData({ id, name: editNamaKegiatan, type: "kegiatan" });
      const updated = data.map((item) =>
        item.id === id ? { ...item, nama_kegiatan: editNamaKegiatan } : item
      );
      setData(updated);
      setFiltered(
        updated.filter((item) =>
          item.nama_kegiatan.toLowerCase().includes(search.toLowerCase())
        )
      );
      toast.success("Kegiatan berhasil diperbarui (local)");
      setEditId(null);
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui data kegiatan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await DeleteData({ id, type: "kegiatan" });
      const updated = data.filter((item) => item.id !== id);
      setData(updated);
      setFiltered(
        updated.filter((item) =>
          item.nama_kegiatan.toLowerCase().includes(search.toLowerCase())
        )
      );
      toast.success("Data Kegiatan dihapus (local)");
    } catch (error) {
      toast.error(error.message || "Gagal menghapus data kegiatan");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearch(keyword);
    const filteredData = data.filter((item) =>
      item.nama_kegiatan.toLowerCase().includes(keyword.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const handleAdd = async () => {
    if (!newNamaKegiatan.trim()) {
      toast.warning("Nama tidak boleh kosong");
      return;
    }
    setLoading(true);
    try {
      const create = await CreateData({ name: newNamaKegiatan, type: "kegiatan" });
      const createdKegiatan = create.data;
      const updated = [...data, createdKegiatan];
      setData(updated);
      setFiltered(
        updated.filter((item) =>
          item.nama_kegiatan.toLowerCase().includes(search.toLowerCase())
        )
      );
      setNewNamaKegiatan("");
      toast.success("Kegiatan berhasil ditambahkan (local)");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Gagal menambah data kegiatan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerMenu text={"Data Kegiatan"}>
      <Helmet>
        <title>Data Kegiatan - SMKN 2 Ketapang</title>
      </Helmet>

      {!loading && (
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Cari kegiatan..."
            value={search}
            onChange={handleSearch}
            className="border px-3 py-2 rounded w-full md:w-1/2"
          />
          <div className="flex gap-2 w-full md:w-1/2">
            <input
              type="text"
              placeholder="Masukkan nama kegiatan baru"
              value={newNamaKegiatan}
              onChange={(e) => setNewNamaKegiatan(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          Tidak ada data ditemukan.
        </div>
      ) : (
        <div className={tableWrapper}>
          <table className={tableBase}>
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>#</th>
                <th className={thClass}>Nama Kegiatan</th>
                <th className={thClass}>Aksi</th>
              </tr>
            </thead>
            <tbody className={tbodyClass}>
              {filtered.map((kegiatan, idx) => (
                <tr key={kegiatan.id} className={trHoverClass}>
                  <td className={tdClass}>{idx + 1}</td>
                  <td className={tdClass}>
                    {editId === kegiatan.id ? (
                      <input
                        value={editNamaKegiatan}
                        onChange={(e) => setEditNamaKegiatan(e.target.value)}
                        className="border px-2 py-1 w-full rounded"
                      />
                    ) : (
                      kegiatan.nama_kegiatan
                    )}
                  </td>
                  <td className={`${tdClass} flex gap-2`}>
                    {editId === kegiatan.id ? (
                      <>
                        <button
                          onClick={() => handleSave(kegiatan.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            handleEdit(kegiatan.id, kegiatan.nama_kegiatan)
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(kegiatan.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ContainerMenu>
  );
};

export default Kegiatan;
