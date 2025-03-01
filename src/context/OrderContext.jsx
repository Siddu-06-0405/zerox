import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState({
    files: [],
    copyNumber: 1,
    printType: "Single side",
    colorOption: "Black & White",
    noOfPagesToPrint: "",
    pdfCount: 0,
    recordPapers: 0,
    departments: {},
    totalAmount: 0, // ✅ Added totalAmount to state
  });

  // Calculate Pricing
  useEffect(() => {
    const offlineCharge = 5 * order.pdfCount;
    const serviceCharge = offlineCharge * 0.2;
    const total = offlineCharge + serviceCharge;

    setOrder((prevOrder) => ({
      ...prevOrder,
      totalAmount: total, // ✅ Update total amount automatically
    }));
  }, [order.pdfCount]); // Recalculate when `pdfCount` changes

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
