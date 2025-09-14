import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import toast from "react-hot-toast";
import "./User.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (error) {
        console.log("Error fetching users", error);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/user/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    toast.success("Déconnexion réussie");
    navigate("/login"); 
  };

  return (
    <div className="user-container">
      <div className="user-content">
        <div className="user-header">
          <h1 className="user-title">Users Management</h1>
          <div className="header-buttons">
            <Link to="/add" className="add-user-btn">
              Add User
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
        
        <table className="user-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Link to={`/update/${user._id}`} className="btn btn-info me-2">
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;