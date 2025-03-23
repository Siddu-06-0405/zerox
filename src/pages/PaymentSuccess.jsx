import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useOrder } from "../context/OrderContext";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const searchQuery = useSearchParams()[0];
  const referenceNum = searchQuery.get("reference");
  const navigate = useNavigate();
  const { updateOrder } = useOrder();

  const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

  const successfullFunc = async () => {
    const user = JSON.parse(localStorage.getItem("print-user"));
    const savedOrder = JSON.parse(localStorage.getItem("pending-order"));
    const fileData = localStorage.getItem("pending-file");

    console.log("User:", user);
    console.log("Token:", user?.token);
    console.log("Saved Order:", savedOrder);
    console.log("File Data:", fileData);

    if (!user || !user.token || !savedOrder || !fileData) {
      toast.error("Order details missing. Please try again.");
      return;
    }

    const base64ToFile = (base64String, fileName, fileType) => {
      const byteCharacters = atob(base64String.split(",")[1]); // Remove base64 prefix
      const byteArrays = [];

      for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }

      const fileBlob = new Blob(byteArrays, { type: fileType });
      return new File([fileBlob], fileName, { type: fileType });
    };

    const file = base64ToFile(
      fileData,
      savedOrder.fileName,
      savedOrder.fileType
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", savedOrder.fileName);

    const orderData = {
      ...savedOrder,
      otp: generateOTP(),
    };
    formData.append("order", JSON.stringify(orderData));

    try {
      const response = await fetch(
        `http://localhost:5001/api/orders/place-order`,
        {
          method: "POST",
          credentials: "include",
          headers: { Authorization: `Bearer ${user.token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Order placed successfully!");
        localStorage.removeItem("pending-order");
        localStorage.removeItem("pending-file");
      } else {
        toast.error(data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Network error. Try again later.");
    }
  };
  useEffect(() => {
    successfullFunc();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-4">
      <Card className="w-full max-w-md border border-gray-700 bg-gray-900">
        <CardHeader className="flex flex-col items-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <CardTitle className="text-xl mt-2">Payment Successful</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg">Your order has been placed successfully!</p>
          <p className="text-sm text-gray-400 mt-2">
            Reference No:{" "}
            <span className="font-mono text-white">{referenceNum}</span>
          </p>
        </CardContent>
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
      </Card>
    </div>
  );
};

export default PaymentSuccess;
