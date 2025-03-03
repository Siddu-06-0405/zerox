import React, { useState, useEffect } from "react";
import "./index.css";
import { Navigate, Routes, Route } from "react-router-dom";
import PrintOptions from "./pages/PrintOptions";
import PrintSettings from "./pages/PrintSettings";
import UploadPdf from "./pages/UploadPdf";
import SelectDepartment from "./pages/SelectDepartment";
import YourCart from "./pages/YourCart";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import { useAdminContext } from "./context/AdminLoginContext";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";

const App = () => {
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    // Fetch file data from the backend API (e.g., text file, image, etc.)
    fetch("http://localhost:5000/files/r.txt")
      .then((response) => response.text())
      .then((data) => setFileData(data));
  }, []);

  const { authUser } = useAuthContext();
  const { authAdmin } = useAdminContext();

  // Convert fileData to boolean based on "true" or "false" string
  const booleanFileData = fileData ? fileData.trim().toLowerCase() === "true" : null;

  if (fileData) {
    console.log(booleanFileData); // Will log 'true' or 'false' based on the file content
  }

  return (
    <>
      {booleanFileData === false ? (
        <Routes>
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/"
            element={authUser ? <Home messages={booleanFileData} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admindashboard"
            element={authAdmin ? <AdminDashboard /> : <Navigate to="/adminlogin" />}
          />
          <Route
            path="/adminlogin"
            element={authAdmin ? <Navigate to="/admindashboard" /> : <AdminLogin />}
          />
        </Routes>
      ) : (
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/"
            element={authUser ? <Home messages={fileData} /> : <Navigate to="/login" />}
          />

          {/* Protected Routes (Only logged-in users can access) */}
          <Route
            path="/options"
            element={authUser && booleanFileData ? <PrintOptions /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={authUser && booleanFileData ? <PrintSettings /> : <Navigate to="/login" />}
          />
          <Route
            path="/upload"
            element={authUser && booleanFileData ? <UploadPdf /> : <Navigate to="/login" />}
          />
          <Route
            path="/department"
            element={authUser && booleanFileData ? <SelectDepartment /> : <Navigate to="/login" />}
          />
          <Route
            path="/cart"
            element={authUser && booleanFileData ? <YourCart /> : <Navigate to="/login" />}
          />
          <Route
            path="/admindashboard"
            element={authAdmin ? <AdminDashboard /> : <Navigate to="/adminlogin" />}
          />
          <Route
            path="/adminlogin"
            element={authAdmin ? <Navigate to="/admindashboard" /> : <AdminLogin />}
          />
        </Routes>
      )}
      <Toaster />
    </>
  );
};

export default App;
