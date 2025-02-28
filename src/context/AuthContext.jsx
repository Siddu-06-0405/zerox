import { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const useAuthContext =()=>{
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("print-user")) || null;
        }
        return null;
    });

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};
