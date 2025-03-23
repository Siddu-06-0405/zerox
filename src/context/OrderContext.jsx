import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState({
    file: null,
    filename: "",
    copyNumber: 1,
    printType: "Single side",
    colorOption: "Black & White",
    startPage: null,
    endPage: null,
    maxPage: 0,
    totalNoOfPages: 0,
    pageSelection: "all", // ✅ Store page selection
    customPages: "", // ✅ For custom input pages
    recordPapers: 0,
    departments: {},
    totalAmount: 0,
    estimatedTime: 0,
    requiredBefore: "",
    otp: 0,
  });

  // ✅ Update total pages based on pageSelection
  useEffect(() => {
    let totalPages = 0;

    if (order.pageSelection === "all") {
      totalPages = order.maxPage; // ✅ Use full document pages
    } else if (order.pageSelection === "odd") {
      totalPages = Math.ceil(order.maxPage / 2); // ✅ Approximate odd pages
    } else if (order.pageSelection === "even") {
      totalPages = Math.floor(order.maxPage / 2); // ✅ Approximate even pages
    } else if (order.pageSelection === "custom") {
      // ✅ Count custom pages (comma-separated values like "1,2,5")
      totalPages = order.customPages
        ? order.customPages.split(",").length
        : 0;
    } else if (order.pageSelection === "range") {
      if (order.startPage !== null && order.endPage !== null) {
        totalPages = Math.max(0, order.endPage - order.startPage + 1);
      }
    }

    const estimatedTime = totalPages * 3 + 60;

    setOrder((prevOrder) => ({
      ...prevOrder,
      totalNoOfPages: totalPages,
      estimatedTime,
    }));
  }, [order.pageSelection, order.startPage, order.endPage, order.customPages, order.maxPage]);

  // ✅ Update Pricing when pages, color, or copies change
  useEffect(() => {
    const pricePerPage = order.colorOption === "Black & White" ? 2 : 3;
    const offlineCharge = order.copyNumber * pricePerPage * order.totalNoOfPages;
    let serviceCharge= Math.ceil(offlineCharge*0.15);
    // const serviceCharge = Math.ceil(offlineCharge/5)===1?2:Math.ceil(offlineCharge/5)*1.5+0.5;
    if(serviceCharge<1){
      serviceCharge = 1;
    }else if(1<serviceCharge<10){
      serviceCharge= serviceCharge;
    }else{
      serviceCharge=10;
    }
    const total = offlineCharge + serviceCharge;

    setOrder((prevOrder) => ({
      ...prevOrder,
      totalAmount: total,
    }));
  }, [order.totalNoOfPages, order.colorOption, order.copyNumber]);

  const updateOrder = (updates) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      ...updates,
    }));
  };

  return (
    <OrderContext.Provider value={{ order, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
