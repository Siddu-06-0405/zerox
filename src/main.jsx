import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { AdminContextProvider } from "./context/AdminLoginContext";
import { OrderProvider } from "./context/OrderContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      <OrderProvider>
        <AdminContextProvider>
          <App />
        </AdminContextProvider>
      </OrderProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
