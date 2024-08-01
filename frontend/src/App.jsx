import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import StallsList from "./components/Stalls/StallsList"; // Example stalls component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stalls" element={<StallsList />} />
      </Routes>
    </Router>
  );
};

export default App;
