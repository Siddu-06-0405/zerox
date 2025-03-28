import React, { useEffect, useState } from "react";
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
import axios from "axios";


const YourCart = () => {
  const { order, updateOrder } = useOrder();
  const navigate = useNavigate();

  useEffect(() => {
    if (!order) return;
    saveOrderToDB(order);
  }, [order]);

  if (!order) return <p>Loading order details...</p>;

  const pricePerPage = order.colorOption === "Black & White" ? 2 : 3;
  const offlineCharge = order.copyNumber * pricePerPage * order.totalNoOfPages;
  const serviceCharge =
    Math.ceil(offlineCharge / 5) === 1
      ? 2
      : Math.ceil(offlineCharge / 5) * 1.5 + 0.5;

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const saveToDB = async (storeName, key, data) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("PrintDB", 2);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, "readwrite");
  
        transaction.onerror = () => {
          console.error("Transaction error:", transaction.error);
          reject(transaction.error);
        };
  
        const store = transaction.objectStore(storeName);
        const putRequest = store.put({ id: key, ...data });
  
        putRequest.onsuccess = () => {
          console.log(`Order successfully saved: ${key}`);
          resolve();
        };
  
        putRequest.onerror = () => {
          console.error("Error inserting into IndexedDB:", putRequest.error);
          reject(putRequest.error);
        };
      };
  
      request.onerror = () => {
        console.error("Failed to open IndexedDB:", request.error);
        reject(request.error);
      };
    });
  };
  

  const getFromDB = async (storeName, key) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("PrintDB", 2);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
  
        // 🚨 Check if object store exists
        if (!db.objectStoreNames.contains(storeName)) {
          console.error(`Object store "${storeName}" not found.`);
          reject(new Error(`Object store "${storeName}" does not exist.`));
          return;
        }
  
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const getRequest = store.get(key);
  
        getRequest.onsuccess = () => resolve(getRequest.result || null);
        getRequest.onerror = (error) => reject(error);
      };
  
      request.onerror = () => reject(request.error);
    });
  };
  

  const saveOrderToDB = async (order) => {
    try {
      console.log("Saving order:", order);
  
      // Directly save the file as a Blob (without converting to base64)
      const orderData = { ...order, file: order.file };
  
      await saveToDB("orders", "pending-order", orderData);
      console.log("Order saved successfully.");
    } catch (error) {
      console.error("Error saving order to IndexedDB:", error);
    }
  };
  
  

  const handleSubmitOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("print-user"));
      if (!user || !user.token) {
        toast.error("You need to log in first!");
        return;
      }
  
      const storedOrder = await getFromDB("orders", "pending-order");

      if (!storedOrder) {
        toast.error("Order data missing!");
        return;
      }
  
      const userId = user._id;
      const { data: { key } } = await axios.get(`http://localhost:5001/api/getkey`);
      const { data: { razorOrder } } = await axios.post(`http://localhost:5001/api/payment/checkout`, {
        amount: order.totalAmount,
      });
  
      const options = {
        key,
        amount: razorOrder.amount,
        currency: "INR",
        name: "ZEROX",
        description: "Test Transaction",
        order_id: razorOrder.id,
        callback_url: `http://localhost:5001/api/payment/payment-verification?userId=${userId}`,
        prefill: {
          name: user.name,
          email: user.email || "test@gmail.com",
          contact: user.phone || "9999999999",
        },
        theme: { color: "#050505" },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("Failed to process the order.");
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
                  <TableCell>File Name</TableCell>
                  <TableCell>{order.file.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Copy Number</TableCell>
                  <TableCell>{order.copyNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Page Selection</TableCell>
                  <TableCell>{order.pageSelection}</TableCell>
                </TableRow>
                {order.pageSelection === "range" && (
                  <>
                    <TableRow>
                      <TableCell>Start Page</TableCell>
                      <TableCell>{order.startPage}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>End Page</TableCell>
                      <TableCell>{order.endPage}</TableCell>
                    </TableRow>
                  </>
                )}
                {order.pageSelection === "custom" && (
                  <>
                    <TableRow>
                      <TableCell>Custom Pages</TableCell>
                      <TableCell>{order.customPages}</TableCell>
                    </TableRow>
                  </>
                )}
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
                  <TableCell>
                    {Object.keys(order.departments).join(", ") || "None"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Offline Charge</TableCell>
                  <TableCell>₹{order.offlineCharge}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Service Charge</TableCell>
                  <TableCell>₹{order.serviceCharge.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="font-bold">Total Amount</TableCell>
                  <TableCell className="font-bold">
                    ₹{order.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <Button onClick={handleSubmitOrder} className="w-full">
              Proceed to Pay
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default YourCart;