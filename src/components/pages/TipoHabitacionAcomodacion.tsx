import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { TipoHabitacionAcomodacion, TipoHabitacion, TipoAcomodacion } from "../../types";

interface EnrichedTipoHabitacionAcomodacion extends TipoHabitacionAcomodacion {
  tipo_habitacion_nombre: string;
  tipo_acomodacion_nombre: string;
}

const TipoHabitacionAcomodacionPage: React.FC = () => {
  const [data, setData] = useState<EnrichedTipoHabitacionAcomodacion[]>([]);
  const [tiposHabitacion, setTiposHabitacion] = useState<TipoHabitacion[]>([]);
  const [tiposAcomodacion, setTiposAcomodacion] = useState<TipoAcomodacion[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    tipo_habitacion_id: "",
    tipo_acomodacion_id: ""
  });

  const API_URL = "/tipos-habitacion-acomodacion";

  // Cargar registros
  const fetchData = async () => {
    try {
      const [res, tiposHabitacionRes, tiposAcomodacionRes] = await Promise.all([
        apiClient.get(API_URL),
        apiClient.get("/tipos-habitacion"),
        apiClient.get("/tipos-acomodacion"),
      ]);

      const tiposHabitacionMap = new Map(tiposHabitacionRes.data.map((th: TipoHabitacion) => [th.id, th.nombre]));
      const tiposAcomodacionMap = new Map(tiposAcomodacionRes.data.map((ta: TipoAcomodacion) => [ta.id, ta.nombre]));

      const enrichedData = res.data.map((item: TipoHabitacionAcomodacion) => ({
        ...item,
        tipo_habitacion_nombre: tiposHabitacionMap.get(item.tipo_habitacion_id) || 'Desconocido',
        tipo_acomodacion_nombre: tiposAcomodacionMap.get(item.tipo_acomodacion_id) || 'Desconocido',
      }));

      setData(enrichedData);
      setTiposHabitacion(tiposHabitacionRes.data);
      setTiposAcomodacion(tiposAcomodacionRes.data);
    } catch (error) {
      console.error("Error al obtener datos", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manejo del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await apiClient.post(API_URL, form);
      fetchData();
      setShowModal(false);
      setForm({ tipo_habitacion_id: "", tipo_acomodacion_id: "" });
    } catch (error) {
      console.error("Error al crear registro", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este registro?")) return;
    try {
      await apiClient.delete(`${API_URL}/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error al eliminar registro", error);
    }
  };

  return (
    <div className="p-6">
      {/* Botón para crear */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tipos de Habitación y Acomodación</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Crear
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Tipo Habitación</th>
              <th className="p-3">Tipo Acomodación</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.tipo_habitacion_nombre}</td>
                <td className="p-3">{item.tipo_acomodacion_nombre}</td>
                <td className="p-3">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para crear */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Crear Registro</h2>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Tipo Habitación</label>
              <select
                name="tipo_habitacion_id"
                value={form.tipo_habitacion_id}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Seleccione un tipo</option>
                {tiposHabitacion.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Tipo Acomodación</label>
              <select
                name="tipo_acomodacion_id"
                value={form.tipo_acomodacion_id}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Seleccione un tipo</option>
                {tiposAcomodacion.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleCreate}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TipoHabitacionAcomodacionPage;
