import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react"; // Import Loader2 for loading animation
import { useOrder } from "../context/OrderContext";
import { toast } from "sonner";
import { getFromIndexedDB, removeFromIndexedDB } from "../utils/indexedDB.js";

const PaymentSuccess = () => {
  const searchQuery = useSearchParams()[0];
  const referenceNum = searchQuery.get("reference");
  const navigate = useNavigate();
  const { updateOrder } = useOrder();
  const [isLoading, setIsLoading] = useState(true); // 🔵 Loading state

  const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

  const successfullFunc = async () => {
    const user = JSON.parse(localStorage.getItem("print-user"));
    if (!user || !user.token) {
      toast.error("User not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    let savedOrder;
    try {
      savedOrder = await getFromIndexedDB("pending-order");
      if (!savedOrder) {
        throw new Error("Order not found in IndexedDB.");
      }
    } catch (error) {
      console.error("Error fetching order from IndexedDB:", error);
      toast.error("Failed to retrieve order data.");
      setIsLoading(false);
      return;
    }

    if (!user.token || !savedOrder?.file) {
      toast.error("Order data is incomplete.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", savedOrder.file);
    formData.append("fileName", savedOrder.filename);
    formData.append(
      "order",
      JSON.stringify({
        ...savedOrder,
        otp: generateOTP(),
        razorpay_payment_id: referenceNum,
      })
    );

    try {
      const response = await fetch(
        "http://localhost:5001/api/orders/place-order",
        {
          method: "POST",
          credentials: "include",
          headers: { Authorization: `Bearer ${user.token}` },
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("Order placed successfully!");
        await removeFromIndexedDB("pending-order");
        indexedDB.deleteDatabase("PrintDB");
      } else {
        toast.error("Failed to place the order.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Network error. Try again later.");
    }

    setIsLoading(false); // 🟢 Stop loading after request
  };

  useEffect(() => {
    successfullFunc();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-4">
      <Card className="w-full max-w-md border border-gray-700 bg-gray-900">
        <CardHeader className="flex flex-col items-center">
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <CheckCircle className="w-12 h-12 text-green-500" />
          )}
          <CardTitle className="text-xl mt-2">
            {isLoading ? "Processing Order..." : "Payment Successful"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {isLoading ? (
            <p className="text-lg text-gray-300">
              Please wait, your order is being placed...
            </p>
          ) : (
            <>
              <p className="text-lg">Your order has been placed successfully!</p>
              <p className="text-sm text-gray-400 mt-2">
                Reference No:{" "}
                <span className="font-mono text-white">{referenceNum}</span>
              </p>
            </>
          )}
        </CardContent>
        {!isLoading && (
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => navigate("/")}>
              Go to Home
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/my-orders")}
            >
              View Orders
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default PaymentSuccess;