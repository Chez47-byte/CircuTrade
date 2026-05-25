import API from "../api/axios";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
const RAZORPAY_CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayScriptPromise;

const loadRazorpayCheckout = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay checkout is not available right now."));
  }

  if (typeof window.Razorpay === "function") {
    return Promise.resolve();
  }

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${RAZORPAY_CHECKOUT_SRC}"]`);

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener(
          "error",
          () => reject(new Error("Unable to load Razorpay checkout. Please try again.")),
          { once: true },
        );
        return;
      }

      const script = document.createElement("script");
      script.src = RAZORPAY_CHECKOUT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Unable to load Razorpay checkout. Please try again."));
      document.body.appendChild(script);
    }).then(() => {
      if (typeof window.Razorpay !== "function") {
        throw new Error("Razorpay checkout is not available right now.");
      }
    });
  }

  return razorpayScriptPromise;
};

export const handlePayment = async ({ bookingId, customerName = "", customerEmail = "", customerPhone = "" }) => {
  if (!RAZORPAY_KEY) {
    throw new Error("Missing Razorpay key. Set VITE_RAZORPAY_KEY_ID in the client environment.");
  }

  await loadRazorpayCheckout();

  const { data: order } = await API.post("/payment/order", { bookingId });

  if (!order?.id || !order?.amount || !order?.currency) {
    throw new Error("Unable to create a valid Razorpay order.");
  }

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
