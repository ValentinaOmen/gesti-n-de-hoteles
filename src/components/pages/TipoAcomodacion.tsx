import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { TipoAcomodacion } from "../../types";

const TipoAcomodacionPage: React.FC = () => {
  const [tipos, setTipos] = useState<TipoAcomodacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [nombre, setNombre] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);

  const API_URL = "/tipos-acomodacion";

  // ✅ Cargar datos
  const fetchTipos = async () => {
    try {
      const res = await apiClient.get<TipoAcomodacion[]>(API_URL);
      setTipos(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  // ✅ Abrir modal para crear o editar
  const openModal = (tipo?: TipoAcomodacion) => {
    if (tipo) {
      setEditId(tipo.id);
      setNombre(tipo.nombre);
    } else {
      setEditId(null);
      setNombre("");
    }
    setShowModal(true);
  };

  // ✅ Guardar (crear o editar)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiClient.put(`${API_URL}/${editId}`, { nombre });
      } else {
        await apiClient.post(API_URL, { nombre });
      }
      setShowModal(false);
      fetchTipos();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // ✅ Eliminar
  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este tipo?")) {
      try {
        await apiClient.delete(`${API_URL}/${id}`);
        fetchTipos();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tipos de Acomodación</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Crear
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((tipo) => (
              <tr key={tipo.id} className="border-b">
                <td className="py-2 px-4">{tipo.nombre}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => openModal(tipo)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(tipo.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Editar Tipo" : "Crear Tipo"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNombre(e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editId ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TipoAcomodacionPage;
