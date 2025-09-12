import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import "./updateuser.css";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    adresse: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(res.data);
      } catch (error) {
        console.log(error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8000/api/user/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Utilisateur mis à jour avec succès");
      navigate("/users");
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-creative-container">
      <div className="update-creative-background">
        <div className="update-floating-shapes">
          <div className="update-shape update-shape-1"></div>
          <div className="update-shape update-shape-2"></div>
          <div className="update-shape update-shape-3"></div>
        </div>
      </div>
      
      <div className="update-creative-card">
        <div className="update-creative-header">
          <div className="update-creative-icon">
            <i className="fas fa-user-edit"></i>
          </div>
          <h2 className="update-creative-title">Modifier l'utilisateur</h2>
          <p className="update-creative-subtitle">Mettez à jour les informations</p>
        </div>
        
        <form onSubmit={handleSubmit} className="update-creative-form">
          <div className="update-input-group">
            <div className="update-input-icon">
              <i className="fas fa-user"></i>
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom complet"
              required
              disabled={loading}
            />
          </div>
          
          <div className="update-input-group">
            <div className="update-input-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Adresse email"
              required
              disabled={loading}
            />
          </div>
          
          <div className="update-input-group">
            <div className="update-input-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="Adresse"
              disabled={loading}
            />
          </div>
          
          <div className="update-button-group">
            <button 
              type="submit" 
              className="update-creative-btn primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> 
                  Mise à jour...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  Mettre à jour
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;