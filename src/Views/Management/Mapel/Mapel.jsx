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

const Mapel = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editNamaMapel, setEditNamaMapel] = useState("");
  const [search, setSearch] = useState("");
  const [newNamaMapel, setNewNamaMapel] = useState("");

  const fetchData = async () => {
    try {
      const response = await GetData("mapel");
      const list = response.data.mapel || [];
      setData(list);
      setFiltered(list);
    } catch (error) {
      toast.error(error.message || "Gagal mengambil data mapel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id, nama_mapel) => {
    setEditId(id);
    setEditNamaMapel(nama_mapel);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditNamaMapel("");
  };

  const handleSave = async (id) => {
    setLoading(true);
    try {
      await UpdateData({ id, name: editNamaMapel, type: "mapel" });
      const updated = data.map((item) =>
        item.id === id ? { ...item, nama_mapel: editNamaMapel } : item
      );
      setData(updated);
      setFiltered(
        updated.filter((item) =>
          item.nama_mapel.toLowerCase().includes(search.toLowerCase())
        )
      );
      toast.success("Mapel berhasil diperbarui");
      setEditId(null);
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui data mapel");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await DeleteData({ id, type: "mapel" });
      const updated = data.filter((item) => item.id !== id);
      setData(updated);
      setFiltered(
        updated.filter((item) =>
          item.nama_mapel.toLowerCase().includes(search.toLowerCase())
        )
      );
      toast.success("Data Mapel dihapus");
    } catch (error) {
      toast.error(error.message || "Gagal menghapus data mapel");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearch(keyword);
    const filteredData = data.filter((item) =>
      item.nama_mapel.toLowerCase().includes(keyword.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const handleAdd = async () => {
    if (!newNamaMapel.trim()) {
      toast.warning("Nama tidak boleh kosong");
      return;
    }
    setLoading(true);
    try {
      const create = await CreateData({ name: newNamaMapel, type: "mapel" });
      const createdMapel = create.data;
      const updated = [...data, createdMapel];
      setData(updated);
      setFiltered(
        updated.filter((item) =>
          item.nama_mapel.toLowerCase().includes(search.toLowerCase())
        )
      );
      setNewNamaMapel("");
      toast.success("Mapel berhasil ditambahkan");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Gagal menambah data mapel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerMenu text={"Data Mapel"}>
      <Helmet>
        <title>Data Mapel - SMKN 2 Ketapang</title>
      </Helmet>

      {!loading && (
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Cari mapel..."
            value={search}
            onChange={handleSearch}
            className="border px-3 py-2 rounded w-full md:w-1/2"
          />
          <div className="flex gap-2 w-full md:w-1/2">
            <input
              type="text"
              placeholder="Masukkan nama mapel baru"
              value={newNamaMapel}
              onChange={(e) => setNewNamaMapel(e.target.value)}
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
                <th className={thClass}>Nama Mapel</th>
                <th className={thClass}>Aksi</th>
              </tr>
            </thead>
            <tbody className={tbodyClass}>
              {filtered.map((mapel, idx) => (
                <tr key={mapel.id} className={trHoverClass}>
                  <td className={tdClass}>{idx + 1}</td>
                  <td className={tdClass}>
                    {editId === mapel.id ? (
                      <input
                        value={editNamaMapel}
                        onChange={(e) => setEditNamaMapel(e.target.value)}
                        className="border px-2 py-1 w-full rounded"
                      />
                    ) : (
                      mapel.nama_mapel
                    )}
                  </td>
                  <td className={`${tdClass} flex gap-2`}>
                    {editId === mapel.id ? (
                      <>
                        <button
                          onClick={() => handleSave(mapel.id)}
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
                          onClick={() => handleEdit(mapel.id, mapel.nama_mapel)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(mapel.id)}
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

export default Mapel;
