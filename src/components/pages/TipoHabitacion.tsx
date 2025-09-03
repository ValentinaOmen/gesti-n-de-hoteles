import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { TipoHabitacion } from "../../types";

const TipoHabitacionPage: React.FC = () => {
  const [tipos, setTipos] = useState<TipoHabitacion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // Cargar datos al montar
  useEffect(() => {
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    const res = await apiClient.get("/tipos-habitacion");
    setTipos(res.data);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await apiClient.put(`/tipos-habitacion/${editId}`, { nombre });
    } else {
      await apiClient.post("/tipos-habitacion", { nombre });
    }
    setNombre("");
    setEditId(null);
    setIsModalOpen(false);
    fetchTipos();
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
      await apiClient.delete(`/tipos-habitacion/${id}`);
      fetchTipos();
    }
  };

  const openModalForEdit = (tipo: TipoHabitacion) => {
    setNombre(tipo.nombre);
    setEditId(tipo.id);
    setIsModalOpen(true);
  };

  const openModalForCreate = () => {
    setNombre("");
    setEditId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tipos de Habitación</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={openModalForCreate}
        >
          Crear
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Nombre</th>
              <th className="border px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((tipo) => (
              <tr key={tipo.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{tipo.nombre}</td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => openModalForEdit(tipo)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Editar Tipo de Habitación" : "Crear Tipo de Habitación"}
            </h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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

export default TipoHabitacionPage;
