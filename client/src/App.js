import React from "react";
import User from "./getuser/User";
import { BrowserRouter as Router, Routes, Route , Navigate } from "react-router-dom";
import AddUser from "./adduser/adduser";
import UpdateUser from "./updateuser/updateuser";
import Login from "./login/Login"; 
function App() {
  const token = localStorage.getItem("token"); // Vérifie si l’utilisateur est connecté
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>User Management App</h1>
        </header>

        <Routes>
          {/* Login accessible sans être connecté */}
          <Route path="/login" element={<Login />} />

          {/* Si connecté → affiche User, sinon → redirige vers Login */}
          <Route path="/" element={token ? <User /> : <Navigate to="/login" />} />

          {/* Protégées par token */}
          <Route path="/add" element={token ? <AddUser /> : <Navigate to="/login" />} />
          <Route path="/update/:id" element={token ? <UpdateUser /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;