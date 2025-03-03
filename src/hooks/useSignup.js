
import { useState } from "react";
import { toast } from "sonner";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const {setAuthUser} = useAuthContext();

  const signup = async({fullName,username,password,confirmPassword,gender}) => {
    const success = handleInputErrors({fullName,username,password,confirmPassword,gender})
    if(!success) return;

    try {
      const res = await fetch("http://localhost:5001/api/auth/signup",{
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ fullName, username, password, confirmPassword, gender })
      })

      const data = await res.json();
      if(data.error){
        throw new Error(data.error);
      }
      // console.log(data);

      //local storage
      localStorage.setItem("print-user", JSON.stringify(data));
      //context
      setAuthUser(data);

    } catch (error) {
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  }

  return {loading,signup};
}

export default useSignup;

function handleInputErrors({fullName,username,password,confirmPassword,gender}){
  if(!fullName || !username || !password || !confirmPassword || !gender){
    toast.error("Please fill in all fields");
    return false;
  }

  if(password !== confirmPassword){
    toast.error("Passwords do not match");
    return false;
  }

  if(password.length < 8){
    toast.error("Password must be at least 8 characters");
    return false;
  }

  return true;

}