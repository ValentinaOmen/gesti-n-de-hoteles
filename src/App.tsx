import { Route, Routes } from "react-router-dom";
import Login from "./components/pages/inicio";
import Layout from "./components/organismos/Layout";
import Hoteles from "./components/pages/Hotel";
import HabitacionHotel from "./components/pages/HabitacionesHotel";
import TipoAcomodacionPage from "./components/pages/TipoAcomodacion";
import TipoHabitacionPage from "./components/pages/TipoHabitacion";
import TipoHabitacionAcomodacionPage from "./components/pages/TipoHabitacionAcomodacion";

function App() {
  return (
    <Routes>
      <Route element={<Login />} path="/" />
      <Route element={<Layout />}>
        <Route element={<Hoteles />} path="/dashboard" />
        <Route element={<HabitacionHotel />} path="/habitaciones" />
        <Route element={<TipoAcomodacionPage />} path="/tipo-acomodacion" />
        <Route element={<TipoHabitacionPage />} path="/tipo-habitacion" />
        <Route element={<TipoHabitacionAcomodacionPage />} path="/tipo-habitacion-acomodacion" />
      </Route>
    </Routes>
  );
}

export default App;
