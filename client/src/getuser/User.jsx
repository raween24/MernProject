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
  const [loadingLogs, setLoadingLogs] = useState(false);
  const navigate = useNavigate();

  // Charger les utilisateurs
  const fetchUsers = async () => {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // Supprimer un utilisateur
  const deleteUser = async (id, userName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ?`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:8000/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id));
      toast.success(res.data.message);

      // Si modal ouvert pour cet utilisateur, rafraîchir les logs
      if (showModal && selectedUser === userName) {
        await showLogs(selectedUser);
      }
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

  // Afficher / rafraîchir les logs d'un utilisateur
  const showLogs = async (userName) => {
    setLoadingLogs(true);
    try {
      console.log("Fetching logs for:", userName);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8000/api/logs/${userName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Logs received:", res.data);
      setLogs(res.data);
      setSelectedUser(userName);
      setShowModal(true);
    } catch (err) {
      console.error("Erreur fetch logs:", err.response?.data || err.message);
      toast.error("Impossible de charger les logs");
    } finally {
      setLoadingLogs(false);
    }
  };

  // Fonction pour formater l'action en français
  const formatAction = (action) => {
    const actions = {
      'login': 'Connexion',
      'logout': 'Déconnexion',
      'update': 'Modification',
      'delete': 'Suppression',
      'register': 'Inscription'
    };
    return actions[action] || action;
  };

  return (
    <div className="user-container">
      <div className="user-content">
        <div className="user-header">
          <h1 className="user-title">Gestion des Utilisateurs</h1>
          <div className="header-buttons">
            <Link to="/add" className="add-user-btn">
              Ajouter un Utilisateur
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Déconnexion
            </button>
          </div>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Nom</th>
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
                  <Link to={`/update/${user._id}`} className="btn btn-info me-2">
                    Modifier
                  </Link>
                  <button
                    onClick={() => deleteUser(user._id, user.name)}
                    className="btn btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
                <td className="logs-cell">
                  <button
                    onClick={() => showLogs(user.name)}
                    className="log-btn"
                    disabled={loadingLogs}
                  >
                    <FaRegClipboard size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal pour afficher les logs */}
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
                {loadingLogs ? (
                  <p className="loading-message">Chargement des logs...</p>
                ) : logs.length === 0 ? (
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
                            <span className={`action-badge ${log.action_name}`}>
                              {formatAction(log.action_name)}
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