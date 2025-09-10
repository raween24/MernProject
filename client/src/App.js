import React from "react";
import User from "./getuser/User";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from "./adduser/adduser";
import UpdateUser from "./updateuser/updateuser";
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1></h1>
        </header>

        <Routes>
          <Route path="/" element={<User />} />
           <Route path="/add" element={<AddUser />} />
          <Route path="/update/:id" element={<UpdateUser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
