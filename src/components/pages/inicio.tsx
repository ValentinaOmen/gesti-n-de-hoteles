import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

interface LoginResponse {
    access_token: string;
    [key: string]: any;
}

interface LoginEvent extends React.FormEvent<HTMLFormElement> {}

const handleSubmit = async (e: LoginEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const response = await axios.post<LoginResponse>("http://127.0.0.1:8000/api/login", {
            email,
            password,
        });

        localStorage.setItem("token", response.data.access_token);

        alert("¡Inicio de sesión exitoso!");
        window.location.href = "/dashboard";
    } catch (err) {
        setError("Credenciales incorrectas. Intenta de nuevo.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-green-500 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
