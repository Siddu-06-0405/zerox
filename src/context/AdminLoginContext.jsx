import { createContext, useState, useContext } from "react";

export const AdminContext = createContext();

export const useAdminContext =()=>{
    return useContext(AdminContext);
}

export const AdminContextProvider = ({ children }) => {
    const [authAdmin, setAuthAdmin] = useState(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("Empty")) || null;
        }
        return null;
    });

    return (
        <AdminContext.Provider value={{ authAdmin, setAuthAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};
