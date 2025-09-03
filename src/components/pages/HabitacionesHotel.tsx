import { useState, useEffect, ChangeEvent } from "react";
import apiClient from "../../api/axios";
import { HabitacionHotelData, HabitacionHotelFormData, Hotel, TipoHabitacion, TipoAcomodacion } from "../../types";

interface EnrichedHabitacionHotelData extends HabitacionHotelData {
  hotel_nombre: string;
  tipo_habitacion_nombre: string;
  tipo_acomodacion_nombre: string;
}

export default function HabitacionHotel() {
  const [habitaciones, setHabitaciones] = useState<EnrichedHabitacionHotelData[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [tiposHabitacion, setTiposHabitacion] = useState<TipoHabitacion[]>([]);
  const [tiposAcomodacion, setTiposAcomodacion] = useState<TipoAcomodacion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<HabitacionHotelFormData>({
    hotel_id: "",
    tipo_habitacion_id: "",
    tipo_acomodacion_id: "",
    cantidad: "",
  });

  const API_URL = "/habitaciones-hotel";

  // ✅ Cargar datos
  const fetchData = async () => {
    try {
      const [res, hotelesRes, tiposHabitacionRes, tiposAcomodacionRes] = await Promise.all([
        apiClient.get<HabitacionHotelData[]>(API_URL),
        apiClient.get<Hotel[]>("/hoteles"),
        apiClient.get<TipoHabitacion[]>("/tipos-habitacion"),
        apiClient.get<TipoAcomodacion[]>("/tipos-acomodacion"),
      ]);

      const hotelesMap = new Map(hotelesRes.data.map((h: Hotel) => [h.id, h.nombre]));
      const tiposHabitacionMap = new Map(tiposHabitacionRes.data.map((th: TipoHabitacion) => [th.id, th.nombre]));
      const tiposAcomodacionMap = new Map(tiposAcomodacionRes.data.map((ta: TipoAcomodacion) => [ta.id, ta.nombre]));

      const enrichedData = res.data.map((habitacion) => ({
        ...habitacion,
        hotel_nombre: hotelesMap.get(habitacion.hotel_id) || 'Desconocido',
        tipo_habitacion_nombre: tiposHabitacionMap.get(habitacion.tipo_habitacion_id) || 'Desconocido',
        tipo_acomodacion_nombre: tiposAcomodacionMap.get(habitacion.tipo_acomodacion_id) || 'Desconocido',
      }));

      setHabitaciones(enrichedData);
      setHoteles(hotelesRes.data);
      setTiposHabitacion(tiposHabitacionRes.data);
      setTiposAcomodacion(tiposAcomodacionRes.data);

    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Manejo del formulario
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Crear nueva habitación
  const handleCreate = async () => {
    try {
      await apiClient.post<HabitacionHotelData>(API_URL, formData);
      fetchData();
      setIsModalOpen(false);
      setFormData({ hotel_id: "", tipo_habitacion_id: "", tipo_acomodacion_id: "", cantidad: "" });
    } catch (error) {
      console.error("Error al crear:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Habitaciones de Hotel</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Crear
        </button>
      </div>

      {/* ✅ Tabla */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
              <th className="py-3 px-4 text-left">Hotel</th>
              <th className="py-3 px-4 text-left">Tipo Habitación</th>
              <th className="py-3 px-4 text-left">Tipo Acomodación</th>
              <th className="py-3 px-4 text-left">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((habitacion) => (
              <tr key={habitacion.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{habitacion.hotel_nombre}</td>
                <td className="py-2 px-4">{habitacion.tipo_habitacion_nombre}</td>
                <td className="py-2 px-4">{habitacion.tipo_acomodacion_nombre}</td>
                <td className="py-2 px-4">{habitacion.cantidad}</td>
              </tr>
            ))}
            {habitaciones.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No hay habitaciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Crear Habitación-Hotel</h2>
            <div className="space-y-3">
              <select
                name="hotel_id"
                value={formData.hotel_id}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Seleccione un hotel</option>
                {hoteles.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>{hotel.nombre}</option>
                ))}
              </select>
              <select
                name="tipo_habitacion_id"
                value={formData.tipo_habitacion_id}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Seleccione un tipo de habitación</option>
                {tiposHabitacion.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
              <select
                name="tipo_acomodacion_id"
                value={formData.tipo_acomodacion_id}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Seleccione un tipo de acomodación</option>
                {tiposAcomodacion.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
              <input
                type="number"
                name="cantidad"
                placeholder="Cantidad"
                value={formData.cantidad}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
