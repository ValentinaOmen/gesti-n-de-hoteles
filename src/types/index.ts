export interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  numero_habitaciones_maximo: number;
}

export interface TipoAcomodacion {
  id: number;
  nombre: string;
}

export interface TipoHabitacion {
  id: number;
  nombre: string;
}

export interface TipoHabitacionAcomodacion {
  id: number;
  tipo_habitacion_id: number;
  tipo_acomodacion_id: number;
}

export interface HabitacionHotelData {
  id: number;
  hotel_id: number;
  tipo_habitacion_id: number;
  tipo_acomodacion_id: number;
  cantidad: number;
}

export interface HabitacionHotelFormData {
  hotel_id: string;
  tipo_habitacion_id: string;
  tipo_acomodacion_id: string;
  cantidad: string;
}
