import React from "react";
import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = "http://localhost:5001";

const YourCart = () => {
  const { order, updateOrder } = useOrder();
  const navigate = useNavigate();

  if (!order) return <p>Loading order details...</p>;
  if (!order.file) {
    toast.error("No file selected.");
    return;
  }
  
  // Pricing Calculation
  const pricePerPage = order.colorOption === "Black & White" ? 1 : 3;
  const offlineCharge = pricePerPage * order.totalNoOfPages;
  const serviceCharge = offlineCharge * 0.2;
  const totalAmount = offlineCharge + serviceCharge;

  const handleSubmitOrder = async () => {
    const user = JSON.parse(localStorage.getItem("print-user"));
    if (!user || !user.token) {
      toast.error("You need to log in first!");
      return;
    }
    if (!order.file) {
      toast.error("No file selected. Please upload your PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", order.file);
    formData.append("fileName", order.file.name);

    const orderData = {
      copyNumber: order.copyNumber,
      startPage: order.startPage,
      endPage: order.endPage,
      totalNoOfPages: order.totalNoOfPages,
      recordPapers: order.recordPapers,
      printType: order.printType,
      colorOption: order.colorOption,
      departments: order.departments,
      totalAmount: totalAmount.toFixed(2),
      estimatedTime: order.estimatedTime
    };

    formData.append("order", JSON.stringify(orderData));

    try {
      const response = await fetch(`${API_URL}/api/orders/place-order`, {
        method: "POST",
        credentials: "include",
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Order placed successfully!");
        setTimeout(() => {
          updateOrder({
            file: null,
            copyNumber: 1,
            startPage: null,
            endPage: null,
            totalNoOfPages: 0,
            printType: "Single side",
            colorOption: "Black & White",
            recordPapers: 0,
            departments: {},
            totalAmount: 0,
          });
          navigate("/");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Network error. Try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Your Cart</CardTitle>
            <CardDescription>Review your order details before proceeding.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Order Summary</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              <TableRow>
                  <TableCell>file name</TableCell>
                  <TableCell>{order.file.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Copy Number</TableCell>
                  <TableCell>{order.copyNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Start Page</TableCell>
                  <TableCell>{order.startPage || "All Pages"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>End Page</TableCell>
                  <TableCell>{order.endPage || "All Pages"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total No. of Pages</TableCell>
                  <TableCell>{order.totalNoOfPages}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Print Type</TableCell>
                  <TableCell>{order.printType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Color Option</TableCell>
                  <TableCell>{order.colorOption}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Record Papers</TableCell>
                  <TableCell>{order.recordPapers}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Departments</TableCell>
                  <TableCell>{Object.keys(order.departments).join(", ") || "None"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Offline Charge</TableCell>
                  <TableCell>₹{offlineCharge}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Service Charge</TableCell>
                  <TableCell>₹{serviceCharge.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="font-bold">Total Amount</TableCell>
                  <TableCell className="font-bold">₹{totalAmount.toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <Button onClick={handleSubmitOrder} className="w-full">
              Proceed to Pay
            </Button>
            <p className="text-xs text-gray-500">
              If you need to modify your order, go back and update the details.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default YourCart;
