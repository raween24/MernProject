import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // 1. Importez Link
import toast from "react-hot-toast";
import "./login.css";

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
        { timeout: 5000 }
      );
      
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");
      navigate("/users");
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
  <div className="login-container">
    <div className="login-card">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <button type="submit" className="btn-primary">
          Login
        </button>
        
        <Link to="/register" className="btn-outline">
          Create Account
        </Link>
      </form>
    </div>
  </div>
);}
export default Login;