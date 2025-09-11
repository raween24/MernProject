import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("Tentative de connexion avec:", formData);
    const res = await axios.post(
      "http://localhost:8000/api/auth/login",
      formData,
      { timeout: 5000 } // timeout de 5 secondes
    );
    
    localStorage.setItem("token", res.data.token);
    toast.success("Login successful");
    navigate("/users"); // Redirigez vers /users au lieu de /
  } catch (error) {
    console.error("Erreur détaillée:", error);
    if (error.code === 'ECONNREFUSED') {
      toast.error("Serveur backend inaccessible. Vérifiez qu'il est démarré.");
    } else {
      toast.error(error.response?.data?.message || "Login failed");
    }
  }
};
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
