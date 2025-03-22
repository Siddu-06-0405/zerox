import { instance } from "../server.js"
import crypto from "crypto";
import { Payment } from "../models/payment.model.js";

export const checkout = async (req, res) => {
    const options = {
        amount: Number(req.body.amount*100),
        currency: "INR",
    };

    const razorOrder = await instance.orders.create(options);

    console.log(razorOrder);
    
    res.status(200).json({
        success:true,
        razorOrder
    });
}

export const paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");
  
    const isAuthentic = expectedSignature === razorpay_signature;
  
    if (isAuthentic) {
      // Database comes here
  
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
  
      res.redirect(
        `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
      });
    }
  };