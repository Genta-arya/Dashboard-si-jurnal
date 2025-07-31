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
import { GetData } from "@/Services/Auth/Management.services";
import { CreateData } from "@/Services/Auth/Management.services";
import { DeleteData } from "@/Services/Auth/Management.services";
import { UpdateData } from "@/Services/Auth/Management.services";

const Kelas = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editNamaKelas, setEditNamaKelas] = useState("");
  const [search, setSearch] = useState("");
  const [newNamaKelas, setNewNamaKelas] = useState("");

  const fetchData = async () => {
    try {
      const response = await GetData("kelas");
      const list = response.data.kelas || [];
      setData(list);
      setFiltered(list);
    } catch (error) {
      toast.error(error.message || "Gagal mengambil data kelas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id, nama_kelas) => {
    setEditId(id);
    setEditNamaKelas(nama_kelas);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditNamaKelas("");
  };

  const handleSave = async (id) => {
    setLoading(true);
    try {
      await UpdateData({ id, name: editNamaKelas, type: "kelas" });
      const updated = data.map((item) =>
        item.id === id ? { ...item, nama_kelas: editNamaKelas } : item
      );

      setData(updated);
      setFiltered(
        updated.filter((item) =>
          item.nama_kelas.toLowerCase().includes(search.toLowerCase())
        )
      );
      toast.success("kelas berhasil diperbarui");
      setEditId(null);
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui data kelas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await DeleteData({ id, type: "kelas" });
      const updated = data.filter((item) => item.id !== id);
      setData(updated);
      setFiltered(
        updated.filter((item) =>
          item.nama_kelas.toLowerCase().includes(search.toLowerCase())
        )
      );
      toast.success("Data Kelas dihapus");
    } catch (error) {
      toast.error(error.message || "Gagal menghapus data kelas");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearch(keyword);
    const filteredData = data.filter((item) =>
      item.nama_kelas.toLowerCase().includes(keyword.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const handleAdd = async () => {
    if (!newNamaKelas.trim()) {
      toast.warning("Nama tidak boleh kosong");
      return;
    }
    setLoading(true);
    try {
      const create = await CreateData({ name: newNamaKelas, type: "kelas" });
      const createdUser = create.data;
      const updated = [...data, createdUser];
      setData(updated);
      setFiltered(
        updated.filter((item) =>
          item.nama_kelas.toLowerCase().includes(search.toLowerCase())
        )
      );
      setNewNamaKelas("");
      toast.success("kelas berhasil ditambahkan");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Gagal menambah data kelas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerMenu text={"Data Kelas"}>
      <Helmet>
        <title>Data Kelas - SMKN 2 Ketapang</title>
      </Helmet>

      {!loading && (
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Cari kelas..."
            value={search}
            onChange={handleSearch}
            className="border px-3 py-2 rounded w-full md:w-1/2"
          />
          <div className="flex gap-2 w-full md:w-1/2">
            <input
              type="text"
              placeholder="Masukkan nama kelas baru"
              value={newNamaKelas}
              onChange={(e) => setNewNamaKelas(e.target.value)}
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
                <th className={thClass}>Nama Kelas</th>
                <th className={thClass}>Aksi</th>
              </tr>
            </thead>
            <tbody className={tbodyClass}>
              {filtered.map((kelas, idx) => (
                <tr key={kelas.id} className={trHoverClass}>
                  <td className={tdClass}>{idx + 1}</td>
                  <td className={tdClass}>
                    {editId === kelas.id ? (
                      <input
                        value={editNamaKelas}
                        onChange={(e) => setEditNamaKelas(e.target.value)}
                        className="border px-2 py-1 w-full rounded"
                      />
                    ) : (
                      kelas.nama_kelas
                    )}
                  </td>
                  <td className={`${tdClass} flex gap-2`}>
                    {editId === kelas.id ? (
                      <>
                        <button
                          onClick={() => handleSave(kelas.id)}
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
                          onClick={() => handleEdit(kelas.id, kelas.nama_kelas)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(kelas.id)}
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

export default Kelas;
