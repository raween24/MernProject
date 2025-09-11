import React from "react";
import User from "./getuser/User";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AddUser from "./adduser/adduser";
import UpdateUser from "./updateuser/updateuser";
import Login from "./login/Login"; 
import Register from "./register/register";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Page login - Accessible à tous */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} /> {/* ⬅️ AJOUTEZ CETTE LIGNE */}
          
          {/* Page register - Accessible à tous */}
          <Route path="/register" element={<Register />} />

          {/* Routes protégées */}
          <Route
            path="/users"
            element={token ? <User /> : <Navigate to="/" />}
          />
          <Route
            path="/add"
            element={token ? <AddUser /> : <Navigate to="/" />}
          />
          <Route
            path="/update/:id"
            element={token ? <UpdateUser /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;