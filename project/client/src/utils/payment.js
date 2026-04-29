import API from "../api/axios";

// Access the key directly inside the function to ensure it's fresh
const getRzpKey = () => import.meta.env.VITE_RAZORPAY_KEY_ID;

const ensureRazorpayLoaded = () => {
  if (typeof window === "undefined" || !window.Razorpay) {
    throw new Error("Razorpay SDK not loaded. Please check your internet or ad-blocker.");
  }
};

export const handlePayment = async ({ bookingId, customerName = "", customerEmail = "", customerPhone = "" }) => {
  ensureRazorpayLoaded();
  
  const RAZORPAY_KEY = getRzpKey();

  if (!RAZORPAY_KEY) {
    console.error("Environment variables found:", import.meta.env);
    throw new Error("Missing Razorpay key in environment.");
  }

  // Create the order on your Render backend
  const { data: order } = await API.post("/payment/order", { bookingId });

  return new Promise((resolve, reject) => {
    const options = {
      key: RAZORPAY_KEY.trim(), // Added .trim() to prevent invisible space errors
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
      theme: { color: "#1c1511" },
      handler: async (response) => {
        try {
          await API.post("/payment/verify", { ...response, bookingId });
          resolve(response);
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment was cancelled.")),
      },
    };

    try {
      const razor = new window.Razorpay(options);
      
      razor.on("payment.failed", (err) => {
        reject(new Error(err.error.description || "Payment failed."));
      });

      // Use a tiny timeout to ensure the browser has finished any pending redirects/renders
      setTimeout(() => {
        razor.open();
      }, 100);
      
    } catch (error) {
      reject(new Error("Could not initialize Razorpay: " + error.message));
    }
  });
};
