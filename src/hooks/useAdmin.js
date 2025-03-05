import { useState } from "react";
import toast from "react-hot-toast";

const useAdmin = () => {
  const admin = async (orderId, status) => {
    try {
      const user = JSON.parse(localStorage.getItem("Empty")); // Get user info

      if (!user || !user.token) {
        console.error("You need to log in first!");
        return;
      }

      // Make sure to avoid repeating the `headers` definition
      const res = await fetch(`http://localhost:5001/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        credentials: "include",
        body: JSON.stringify({ status }), // Send status in the request body
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // You might want to add any success message or logic after successfully updating
      toast.success("Order status updated successfully!");
      setTimeout(()=>window.location.reload(),2000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return { admin };
};

export default useAdmin;
