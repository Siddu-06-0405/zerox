import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState({
    files: [],
    copyNumber: 1,
    printType: "Single side",
    colorOption: "Black & White",
    requiredBefore: "",
    pdfCount: 0,
    recordPapers: 0,
    frontPapers: false,
    graphs: false,
  });

  const updateOrder = (updates) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      ...updates, // Merge new updates
    }));
  };

  return (
    <OrderContext.Provider value={{ order, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
