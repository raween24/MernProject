import React from "react";
import User from "./getuser/User";
import { BrowserRouter as Router, Routes, Route , Navigate } from "react-router-dom";
import AddUser from "./adduser/adduser";
import UpdateUser from "./updateuser/updateuser";
import Login from "./login/Login"; 
function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* page login */}
          <Route path="/" element={<Login />} />

          {/* route users (tableau) */}
          <Route
            path="/users"
            element={token ? <User /> : <Navigate to="/users" />}
          />

          <Route
            path="/add"
            element={token ? <AddUser /> : <Navigate to="/users" />}
          />
          <Route
            path="/update/:id"
            element={token ? <UpdateUser /> : <Navigate to="/users" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;