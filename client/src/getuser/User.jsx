import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegClipboard } from "react-icons/fa";
import "./User.css";

const User = () => {
  // 🔹 Main states
  const [users, setUsers] = useState([]); // all users
  const [logs, setLogs] = useState([]); // logs for selected user
  const [selectedUser, setSelectedUser] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [loadingLogs, setLoadingLogs] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate();

  // 🔹 Load all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error loading users", error);
      toast.error("Unable to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Delete a user
  const deleteUser = async (id, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;

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
      toast.error("Error deleting user");
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

      toast.success("Logged out successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error during logout");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  // 🔹 Fetch logs from backend (dynamic search)
  const fetchLogs = async (userName, search = "") => {
    if (!userName) return;
    setLoadingLogs(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/api/logs/${userName}?search=${encodeURIComponent(search)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLogs(res.data);
      setSelectedUser(userName);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load logs");
    } finally {
      setLoadingLogs(false);
    }
  };

  // 🔹 Format action for display
  const formatAction = (action) => {
    const mapping = {
      login: "Login",
      logout: "Logout",
      update: "Update",
      delete: "Delete",
      register: "Register",
    };
    return mapping[action] || action;
  };

  return (
    <div className="user-container">
      <div className="user-content">
        {/* Header */}
        <div className="user-header">
          <h1 className="user-title">User Management</h1>
          <div className="header-buttons">
            <Link to="/add" className="add-user-btn">Add User</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>

        {/* Users table */}
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
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
                  <button onClick={() => deleteUser(user._id, user.name)} className="btn btn-danger">Delete</button>
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

        {/* Modal for logs */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Logs for {selectedUser}</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>

              <div className="modal-body">
                {/* Search field */}
                <input
                  type="text"
                  placeholder="Search actions..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    fetchLogs(selectedUser, e.target.value);
                  }}
                  className="search-input"
                />

                {loadingLogs ? (
                  <p className="loading-message">Loading logs...</p>
                ) : logs.length === 0 ? (
                  <p className="no-logs-message">No logs found for {selectedUser}.</p>
                ) : (
                  <table className="logs-table">
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Message</th>
                        <th>Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log._id}>
                          <td><span className={`action-badge ${log.action_name}`}>{formatAction(log.action_name)}</span></td>
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
