
import { useState } from "react";
import { toast } from "sonner";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const {setAuthUser} = useAuthContext();

  const signup = async ({ fullName, username, email, phoneNumber, password, confirmPassword, gender }) => {
    const success = handleInputErrors({ fullName, username, email, phoneNumber, password, confirmPassword, gender });
    if (!success) return;
  
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, phoneNumber, password, confirmPassword, gender }),
        credentials: "include",
      });
  
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
      localStorage.setItem("print-user", JSON.stringify(data));
      setAuthUser(data);
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  function handleInputErrors({ fullName, username, email, phoneNumber, password, confirmPassword, gender }) {
    if (!fullName || !username || !email || !phoneNumber || !password || !confirmPassword || !gender) {
      toast.error("Please fill in all fields");
      return false;
    }
  
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
  
    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Phone number must be 10 digits");
      return false;
    }
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
  
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
  
    return true;
  }  

  return {loading,signup};
}

export default useSignup;

function handleInputErrors({ fullName, username, email, phoneNumber, password, confirmPassword, gender }) {
  if (!fullName || !username || !email || !phoneNumber || !password || !confirmPassword || !gender) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    toast.error("Invalid email format");
    return false;
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    toast.error("Phone number must be 10 digits");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 8) {
    toast.error("Password must be at least 8 characters");
    return false;
  }

  return true;
}