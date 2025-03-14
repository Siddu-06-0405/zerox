import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [otpVisibility, setOtpVisibility] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("print-user"));
      if (!user || !user.token) {
        toast.error("You need to log in first!");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5001/api/orders/user-orders`,
          {
            method: "GET",
            credentials: "include",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders);
        } else {
          toast.error(data.message || "Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Network error. Try again later.");
      }
    };

    fetchOrders();
  }, []);

  const toggleOtpVisibility = (orderId) => {
    setOtpVisibility((prev) => ({
      ...prev,
      [orderId]: !prev[orderId], // Toggle only for the specific order
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <Table>
                <TableCaption>
                  List of your past and ongoing orders.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Submitted Time</TableHead>
                    <TableHead>Estimated Time</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>OTP</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{order.estimatedTime || "N/A"}</TableCell>
                      <TableCell>₹{order.totalAmount}</TableCell>
                      <TableCell>
                        <span className="text-lg font-semibold">
                          {otpVisibility[order._id] ? order.otp : "••••••"}
                        </span>
                        <button
                          onClick={() => toggleOtpVisibility(order._id)}
                          className="ml-2 p-2 bg-white rounded-full shadow"
                        >
                          {otpVisibility[order._id] ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            order.status === "Completed"
                              ? "bg-green-500"
                              : order.status === "Processing"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan="5" className="text-center">
                      {orders.length} Order(s) Found
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            ) : (
              <p className="text-center text-gray-500">No orders found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyOrders;
