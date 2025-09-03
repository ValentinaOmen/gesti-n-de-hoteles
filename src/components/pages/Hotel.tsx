import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import apiClient from "../../api/axios";
import { Hotel } from "../../types";

const Hoteles: React.FC = () => {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Omit<Hotel, "id">>({
    nombre: "",
    direccion: "",
    ciudad: "",
    nit: "",
    numero_habitaciones_maximo: 0,
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL = "/hoteles";

  // ✅ Obtener lista de hoteles
  const fetchHoteles = async () => {
    try {
      const res = await apiClient.get<Hotel[]>(API_URL);
      setHoteles(res.data);
    } catch {
      setError("Error al cargar los hoteles.");
    }
  };

  useEffect(() => {
    fetchHoteles();
  }, []);

  // ✅ Manejo del formulario
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numero_habitaciones_maximo" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiClient.post(API_URL, formData);
      setFormData({
        nombre: "",
        direccion: "",
        ciudad: "",
        nit: "",
        numero_habitaciones_maximo: 0,
      });
      setModalOpen(false);
      fetchHoteles();
    } catch {
      setError("Error al crear el hotel. Revisa los datos.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Eliminar hotel
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este hotel?")) return;

    try {
      await apiClient.delete(`${API_URL}/${id}`);
      fetchHoteles();
    } catch {
      setError("Error al eliminar el hotel.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Hoteles</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Crear Hotel
        </button>
      </div>

      {/* ✅ Tabla de hoteles */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Nombre</th>
              <th className="border border-gray-300 p-2">Ciudad</th>
              <th className="border border-gray-300 p-2">NIT</th>
              <th className="border border-gray-300 p-2">Habitaciones</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {hoteles.map((hotel) => (
              <tr key={hotel.id}>
                <td className="border p-2">{hotel.nombre}</td>
                <td className="border p-2">{hotel.ciudad}</td>
                <td className="border p-2">{hotel.nit}</td>
                <td className="border p-2">{hotel.numero_habitaciones_maximo}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDelete(hotel.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {hoteles.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No hay hoteles registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Hotel</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del hotel"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="nit"
                placeholder="NIT"
                value={formData.nit}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="numero_habitaciones_maximo"
                placeholder="Número máximo de habitaciones"
                value={formData.numero_habitaciones_maximo}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {loading ? "Guardando..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hoteles;
