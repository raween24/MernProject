import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPlus } from "react-icons/fa";
import "./add.css";

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState(""); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email") setErrorMsg(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/user", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User added successfully"); 
      navigate("/users");
    } catch (error) {
      
      if (error.response?.data?.message === "User already exists") {
        setErrorMsg("This email is already registered!");
      } else {
        setErrorMsg(error.response?.data?.message || "Error adding user");
      }
    }
  };

  return (
    <div className="add-creative-container">
      {/* Background animé */}
      <div className="add-creative-background">
        <div className="add-floating-shapes">
          <div className="add-shape add-shape-1"></div>
          <div className="add-shape add-shape-2"></div>
          <div className="add-shape add-shape-3"></div>
        </div>
      </div>

      {/* Carte */}
      <div className="add-creative-card">
        <div className="add-creative-header">
          <div className="add-creative-icon"><FaPlus /></div>
          <h2 className="add-creative-title">Add User</h2>
          <p className="add-creative-subtitle">Fill the form to create a new account</p>
        </div>

        {/* Formulaire */}
        <form className="add-creative-form" onSubmit={handleSubmit}>
          <div className="add-input-group">
            <FaUser className="add-input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-input-group">
            <FaEnvelope className="add-input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {/* Message d'erreur email */}
          {errorMsg && <p className="add-error-msg">{errorMsg}</p>}

          <div className="add-input-group">
            <FaLock className="add-input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-button-group">
            <button type="submit" className="add-creative-btn">
              <FaPlus /> Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
