import API from "../api/axios";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const ensureRazorpayLoaded = () => {
  if (typeof window === "undefined" || typeof window.Razorpay !== "function") {
    throw new Error("Razorpay checkout is not available right now.");
  }
};

export const handlePayment = async ({ bookingId, customerName = "", customerEmail = "", customerPhone = "" }) => {
  ensureRazorpayLoaded();

  if (!RAZORPAY_KEY) {
    throw new Error("Missing Razorpay key. Set VITE_RAZORPAY_KEY_ID in the client environment.");
  }

  const { data: order } = await API.post("/payment/order", { bookingId });

  return new Promise((resolve, reject) => {
    const razor = new window.Razorpay({
      key: RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "CircuTrade",
      description: "Rental booking payment",
      order_id: order.id,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      theme: {
        color: "#1c1511",
      },
      handler: async (response) => {
        try {
          await API.post("/payment/verify", {
            ...response,
            bookingId,
          });
          resolve(response);
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment was cancelled.")),
      },
    });

    razor.on("payment.failed", (response) => {
      reject(new Error(response?.error?.description || "Payment failed."));
    });

    razor.open();
  });
};
