import React from "react";
import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  const { order } = useOrder();
  const navigate = useNavigate();

  if (!order) return <p>Loading order details...</p>;

  // Calculate Pricing
  const offlineCharge = 5 * order.pdfCount;
  const serviceCharge = offlineCharge * 0.2;
  const totalAmount = offlineCharge + serviceCharge;

  // Send Order to Backend
  const handleSubmitOrder = async () => {
    const user = JSON.parse(localStorage.getItem("print-user")); // Get user info

    if (!user || !user.token) {
      toast.error("You need to log in first!");
      return;
    }

    if (!order.files || order.files.length === 0) {
      toast.error("No files selected. Please upload your PDFs first.");
      return;
    }

    const formData = new FormData();
    // Append files to formData
    order.files.forEach((file) => formData.append("files", file));

    // Prepare order data as a JSON string
    const orderData = {
      copyNumber: order.copyNumber,
      pdfCount: order.pdfCount,
      recordPapers: order.recordPapers,
      noOfPagesToPrint: order.noOfPagesToPrint,
      printType: order.printType,
      colorOption: order.colorOption,
      departments: order.departments,
      totalAmount: totalAmount.toFixed(2),
    };

    console.log("Sending order data:", orderData);
    formData.append("order", JSON.stringify(orderData));

    try {
      console.log("Sending request with token:", user.token);
      const response = await fetch(`${API_URL}/api/orders/place-order`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Order placed successfully!");
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
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className>Your Cart</CardTitle>
            <CardDescription >
              Please review your order details below before proceeding to payment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Your Order Summary</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>PDFs</TableCell>
                  <TableCell>{order.pdfCount}</TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell>Record Papers</TableCell>
                  <TableCell>{order.recordPapers}</TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell>No. of Pages to Print</TableCell>
                  <TableCell>{order.noOfPagesToPrint}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Print Type</TableCell>
                  <TableCell>{order.printType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Color Option</TableCell>
                  <TableCell>{order.colorOption}</TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell>Selected Departments</TableCell>
                  <TableCell>
                    {Object.entries(order.departments)
                      .filter(([dept, count]) => count > 0)
                      .map(([dept, count]) => `${dept} (${count})`)
                      .join(", ")}
                  </TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell>Offline Charges</TableCell>
                  <TableCell>₹{offlineCharge}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Service Charge</TableCell>
                  <TableCell>₹{serviceCharge.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>

                  <TableCell >Total Amount</TableCell>
                  <TableCell >₹{totalAmount.toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-6">
            <Button onClick={handleSubmitOrder} className="w-full">
              Proceed to Pay
            </Button>
            <p className="text-xs text-gray-500">
              Double-check your order details. If you need to modify any settings, please go back and update them.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default YourCart;
