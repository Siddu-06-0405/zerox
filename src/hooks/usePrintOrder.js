import { useContext } from "react";
import { PrintOrderContext } from "../context/PrintOrderContext"; // Ensure correct path

export const usePrintOrder = () => {
  const context = useContext(PrintOrderContext);
  if (!context) {
    throw new Error("usePrintOrder must be used within a PrintOrderProvider");
  }
  return context;
};
