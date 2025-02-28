import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { PrintOrderProvider } from "./context/PrintOrderContext";
import { OrderProvider } from "./context/OrderContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      <PrintOrderProvider> {/* Ensure correct provider name */}
        <OrderProvider><App /></OrderProvider>
      </PrintOrderProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
