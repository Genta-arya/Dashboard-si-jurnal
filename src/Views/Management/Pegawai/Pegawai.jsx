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
import { UpdateData } from "@/Services/Auth/Management.services";
import { CreateData } from "@/Services/Auth/Management.services";
import { DeleteData } from "@/Services/Auth/Management.services";

const Pegawai = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");

  const fetchData = async () => {
    try {
      const response = await GetData("pegawai");
      const list = response.data.user || [];
      setData(list);
      setFiltered(list);
    } catch (error) {
      toast.error(error.message || "Gagal mengambil data pegawai");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id, name) => {
    setEditId(id);
    setEditName(name);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditName("");
  };

  const handleSave = async (id) => {
    setLoading(true);
    try {
      await UpdateData({ id, name: editName, type: "pegawai" });
      const updated = data.map((item) =>
        item.id === id ? { ...item, name: editName } : item
      );
      setData(updated);
      setFiltered(
        updated.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
      toast.success("Pegawai berhasil diperbarui (local)");
      setEditId(null);
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui data pegawai");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
       setLoading(true);
      await DeleteData({ id, type: "pegawai" });
      const updated = data.filter((item) => item.id !== id);
      setData(updated);
      setFiltered(
        updated.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
      toast.success("Data pegawai dihapus (local)");
    } catch (error) {
      toast.error(error.message || "Gagal menghapus data pegawai");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearch(keyword);
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const handleAdd = async () => {
    if (!newName.trim()) {
      toast.warning("Nama tidak boleh kosong");
      return;
    }
    setLoading(true);
    try {
      const create = await CreateData({ name: newName, type: "pegawai" });
      const createdUser = create.data;
      const updated = [...data, createdUser];
      setData(updated);
      setFiltered(
        updated.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
      setNewName("");
      toast.success("Pegawai berhasil ditambahkan (local)");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Gagal menambah data pegawai");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerMenu text={"Data Pegawai"}>
      <Helmet>
        <title>Data Pegawai - SMKN 2 Ketapang</title>
      </Helmet>
      {/* Search & Tambah */}
      {!loading && (
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Cari pegawai..."
            value={search}
            onChange={handleSearch}
            className="border px-3 py-2 rounded w-full md:w-1/2"
          />
          <div className="flex gap-2 w-full md:w-1/2">
            <input
              type="text"
              placeholder="Masukan Nama Pegawai Baru"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <button
              onClick={handleAdd}
              disabled={newName.length < 0}
              className="bg-blue-600 disabled:bg-gray-500 text-white px-3 py-2 rounded hover:bg-blue-700"
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
                <th className={thClass}>Nama</th>
                <th className={thClass}>Aksi</th>
              </tr>
            </thead>
            <tbody className={tbodyClass}>
              {filtered.map((pegawai, idx) => (
                <tr key={pegawai.id} className={trHoverClass}>
                  <td className={tdClass}>{idx + 1}</td>
                  <td className={tdClass}>
                    {editId === pegawai.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border px-2 py-1 w-full rounded"
                      />
                    ) : (
                      pegawai.name
                    )}
                  </td>
                  <td className={`${tdClass} flex gap-2`}>
                    {editId === pegawai.id ? (
                      <>
                        <button
                          onClick={() => handleSave(pegawai.id)}
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
                          onClick={() => handleEdit(pegawai.id, pegawai.name)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(pegawai.id)}
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

export default Pegawai;
