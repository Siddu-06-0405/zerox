import React from "react";
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
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const App = () => {
  const { authUser } = useAuthContext();

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />

        {/* Protected Routes (Only logged-in users can access) */}
        <Route path="/" element={authUser ? <PrintOptions /> : <Navigate to="/login" />} />
        <Route path="/settings" element={authUser ? <PrintSettings /> : <Navigate to="/login" />} />
        <Route path="/upload" element={authUser ? <UploadPdf /> : <Navigate to="/login" />} />
        <Route path="/department" element={authUser ? <SelectDepartment /> : <Navigate to="/login" />} />
        <Route path="/cart" element={authUser ? <YourCart /> : <Navigate to="/login" />} />
        <Route path="/admin" element={authUser ? <AdminDashboard /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
