import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import toast from "react-hot-toast";
import { FaHistory } from "react-icons/fa"; // icône logs
import "./User.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users", error);
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
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/logs/logout",
        { userName: "Rawen" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Erreur logout:", err);
    }

    localStorage.removeItem("token");
    toast.success("Déconnexion réussie");
    navigate("/login"); 
  };

  const showLogs = async (userName) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8000/api/logs/${userName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
      setSelectedUser(userName);
      setShowModal(true);
    } catch (err) {
      console.error("Erreur fetch logs:", err);
    }
  };

  return (
    <div className="user-container">
      <div className="user-content">
        <div className="user-header">
          <h1 className="user-title">Users Management</h1>
          <div className="header-buttons">
            <Link to="/add" className="add-user-btn">Add User</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
              <th>Logs</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Link to={`/update/${user._id}`} className="btn btn-info me-2">Edit</Link>
                  <button onClick={() => deleteUser(user._id)} className="btn btn-danger">Delete</button>
                </td>
                <td className="logs-cell">
                  <button onClick={() => showLogs(user.name)} className="log-btn">
                    <FaHistory size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Logs de {selectedUser}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
              <ul>
                {logs.map((log) => (
                  <li key={log._id}>
                    {log.action_name} - {log.message} - {new Date(log.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
