import { useState } from "react";
import axios from "axios";

const useOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const placeOrder = async (orderData) => {
        setLoading(true);
        try {
            const res = await axios.post("/api/orders/place-order", orderData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || "Failed to place order");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { placeOrder, loading, error };
};

export default useOrder;
