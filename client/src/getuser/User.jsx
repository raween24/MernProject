import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegClipboard } from "react-icons/fa"; 
import "./User.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Charger les utilisateurs
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
        toast.error("Impossible de charger les utilisateurs");
      }
    };
    fetchData();
  }, []);

  // Supprimer un utilisateur
  const deleteUser = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/user/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Déconnexion + log du logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");

      if (userName) {
        await axios.post(
          "http://localhost:8000/api/logs/logout",
          { userName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success("Déconnexion réussie");
    } catch (err) {
      console.error("Erreur logout:", err.response?.data || err.message);
      toast.error("Erreur lors de la déconnexion");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  // Afficher les logs d'un utilisateur
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
      console.error("Erreur fetch logs:", err.response?.data || err.message);
      toast.error("Impossible de charger les logs");
    }
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
              <th>Logs</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td> {/* ⚠️ Si en DB c'est userName, change en user.userName */}
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
                <td className="logs-cell">
                  <button
                    onClick={() => showLogs(user.name)} 
                    className="log-btn"
                  >
                    <FaRegClipboard size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal pour afficher les logs avec table */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Logs de {selectedUser}</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                {logs.length === 0 ? (
                  <p className="no-logs-message">Aucun log trouvé pour {selectedUser}.</p>
                ) : (
                  <table className="logs-table">
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Message</th>
                        <th>Date & Heure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log._id}>
                          <td className="action-cell">
                            <span className="action-badge">
                              {log.action_name}
                            </span>
                          </td>
                          <td className="message-cell">{log.message}</td>
                          <td className="timestamp-cell">
                            {new Date(log.timestamp).toLocaleString('fr-FR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;