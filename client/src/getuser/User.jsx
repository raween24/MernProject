import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegClipboard } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./User.css";

const User = () => {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error loading users", error);
      toast.error(t("unableToLoadUsers"));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Delete a user
  const deleteUser = async (id, userName) => {
    if (!window.confirm(`${t("deleteConfirmation")} ${userName}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:8000/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      toast.success(res.data.message);

      if (showModal && selectedUser === userName) {
        fetchLogs(userName, searchTerm);
      }
    } catch (error) {
      console.error(error);
      toast.error(t("errorDeletingUser"));
    }
  };

  // 🔹 Logout
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

      toast.success(t("loggedOutSuccessfully"));
    } catch (err) {
      console.error(err);
      toast.error(t("errorDuringLogout"));
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  // 🔹 Fetch logs
  const fetchLogs = async (userName, search = "") => {
    if (!userName) return;
    setLoadingLogs(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/api/logs/${userName}?search=${encodeURIComponent(
          search
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLogs(res.data);
      setSelectedUser(userName);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      toast.error(t("unableToLoadLogs"));
    } finally {
      setLoadingLogs(false);
    }
  };

  const formatAction = (action) => {
    const mapping = {
      login: t("login"),
      logout: t("logout"),
      update: t("update"),
      delete: t("delete"),
      register: t("register"),
    };
    return mapping[action] || action;
  };

  return (
    <div className="user-container">
      <div className="user-content">
        {/* Header */}
        <div className="user-header">
          <h1 className="user-title">{t("userManagement")}</h1>

          {/* Language Switcher */}
          <div className="language-switcher">
            <button onClick={() => i18n.changeLanguage("en")}>EN</button>
            <button onClick={() => i18n.changeLanguage("fr")}>FR</button>
          </div>

          <div className="header-buttons">
            <Link to="/add" className="add-user-btn">{t("addUser")}</Link>
            <button onClick={handleLogout} className="logout-btn">{t("logout")}</button>
          </div>
        </div>

        {/* Users Table */}
        <table className="user-table">
          <thead>
            <tr>
              <th>{t("id")}</th>
              <th>{t("name")}</th>
              <th>{t("email")}</th>
              <th>{t("actions")}</th>
              <th>{t("logs")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Link to={`/update/${user._id}`} className="btn btn-info me-2">{t("edit")}</Link>
                  <button onClick={() => deleteUser(user._id, user.name)} className="btn btn-danger">{t("delete")}</button>
                </td>
                <td>
                  <button onClick={() => fetchLogs(user.name, searchTerm)} className="log-btn">
                    <FaRegClipboard size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for Logs */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{t("logsFor")} {selectedUser}</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>

              <div className="modal-body">
                <input
                  type="text"
                  placeholder={t("searchActions")}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    fetchLogs(selectedUser, e.target.value);
                  }}
                  className="search-input"
                />

                {loadingLogs ? (
                  <p className="loading-message">{t("loadingLogs")}</p>
                ) : logs.length === 0 ? (
                  <p className="no-logs-message">{t("noLogsFound", { user: selectedUser })}</p>
                ) : (
                  <table className="logs-table">
                    <thead>
                      <tr>
                        <th>{t("action")}</th>
                        <th>{t("message")}</th>
                        <th>{t("dateTime")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log._id}>
                          <td>
                            <span className={`action-badge ${log.action_name}`}>
                              {formatAction(log.action_name)}
                            </span>
                          </td>
                          <td>{log.message}</td>
                          <td>{new Date(log.timestamp).toLocaleString('en-US')}</td>
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
