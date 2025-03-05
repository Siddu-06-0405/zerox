import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState({
    file: null, // ✅ Stores a single file
    filename: "",
    copyNumber: 1,
    printType: "Single side",
    colorOption: "Black & White",
    startPage: null, // ✅ Start page number
    endPage: null,   // ✅ End page number
    totalNoOfPages: 0, // ✅ Total number of pages (default to 0)
    recordPapers: 0,
    departments: {},
    totalAmount: 0, 
    estimatedTime: 0
  });

  // Calculate total pages whenever startPage or endPage changes
  useEffect(() => {
    if (order.startPage !== null && order.endPage !== null) {
      const totalPages = Math.max(0, order.endPage - order.startPage + 1);
      const timer = totalPages*3+30
      setOrder((prevOrder) => ({
        ...prevOrder,
        totalNoOfPages: totalPages,
        estimatedTime: timer,
      }));
    }
  }, [order.startPage, order.endPage]);

  // Calculate Pricing
  useEffect(() => {
    const pricePerPage = order.colorOption === "Black & White" ? 1 : 3;
    const offlineCharge = pricePerPage * order.totalNoOfPages; // Charge per page
    const serviceCharge = offlineCharge * 0.2;
    const total = offlineCharge + serviceCharge;

    setOrder((prevOrder) => ({
      ...prevOrder,
      totalAmount: total,
    }));
  }, [order.totalNoOfPages]); // ✅ Recalculates when pages change

  const updateOrder = (updates) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      ...updates, // ✅ Merge updates
    }));
  };

  return (
    <OrderContext.Provider value={{ order, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
