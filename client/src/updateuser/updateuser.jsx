import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // CORRECTION ICI : Utiliser 'adresse' et non 'addresse'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    adresse: "", // <--- CHANGÉ ICI (un seul 'd')
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/user/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Maintenant il envoie 'adresse', ce que le backend comprend
      await axios.put(`http://localhost:8000/api/user/${id}`, formData);
      toast.success("User updated successfully");
      navigate("/users");
    } catch (error) {
      console.log(error);
      toast.error("Error updating user");
    }
  };

  return (
    <div className="container mt-3">
      <h2>Update User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control mb-2"
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control mb-2"
          placeholder="Email"
        />
        {/* CORRECTION ICI AUSSI : Utiliser 'adresse' partout */}
        <input
          type="text"
          name="adresse" // <--- CHANGÉ ICI (un seul 'd')
          value={formData.adresse} // <--- CHANGÉ ICI (un seul 'd')
          onChange={handleChange}
          className="form-control mb-2"
          placeholder="Address (adresse)"
        />
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;