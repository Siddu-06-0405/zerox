import { useState } from "react"
import { useAdminContext } from "../context/AdminLoginContext";
import {toast} from "sonner";

const useAdminLogout = () => {
  const [loading,setLoading] = useState(false);
  const {setAuthAdmin} = useAdminContext();

  const Adminlogout = async () => {
    setLoading(true);
    try {
        const res = await fetch("http://localhost:5001/api/admin/logout",{
            method: "POST",
            headers: {"Content-Type": "application/json"}
        });
        const data = await res.json();
        if(data.error){
            throw new Error(data.error);
        }

        localStorage.removeItem("Empty");
        setAuthAdmin(null);
    } catch (error) {
        toast.error(error.message);
    }finally{
        setLoading(false);
    }
  };

  return {loading, Adminlogout};
}

export default useAdminLogout;