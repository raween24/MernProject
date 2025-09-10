import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./User.css";

const User = () => {
  const [users, setUsers] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // récupère le token après login
      const res = await axios.get("http://localhost:8000/api/user", { // URL corrigée
        headers: {
          Authorization: `Bearer ${token}`, // ajoute le token JWT
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

  return (
    <div className="userTable">
      <Link to="/add" className="btn btn-primary mb-3">
        Add User
      </Link>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
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
  );
};

export default User;
