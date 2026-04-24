import { useEffect, useState } from "react";
import { Bell, CheckCircle, XCircle, CalendarClock, MessageSquare, IndianRupee } from "lucide-react";
import API from "../api/axios";
import { getErrorMessage } from "../utils/apiError";
import { handlePayment } from "../utils/payment";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [responseForms, setResponseForms] = useState({});
  const [payingBookingId, setPayingBookingId] = useState("");

  const loadNotifications = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await API.get("/notifications");
      setNotifications(data);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load notifications."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const handleFormChange = (bookingId, field, value) => {
    setResponseForms((c) => ({
      ...c,
      [bookingId]: { ...c[bookingId], [field]: value },
    }));
  };

  const handleRespond = async (bookingId, action) => {
    const form = responseForms[bookingId] || {};
    try {
      setError("");
      setSuccess("");
      await API.patch(`/bookings/${bookingId}/respond`, {
        action,
        ownerMessage:       form.ownerMessage || "",
        alternateStartDate: form.alternateStartDate || "",
        alternateEndDate:   form.alternateEndDate || "",
      });
      loadNotifications();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to respond to booking."));
    }
  };

  const handlePayNow = async (notification) => {
    const bookingId = notification.metadata?.bookingId;
    if (!bookingId) {
      setError("Booking reference is missing for this payment.");
      return;
    }

    setPayingBookingId(bookingId);
    setError("");
    setSuccess("");

    try {
      await handlePayment({
        bookingId,
        customerName: notification.metadata?.customerName || "",
        customerPhone: notification.metadata?.customerPhone || "",
      });
      await loadNotifications();
      setSuccess("Payment completed successfully. Your booking now shows as paid.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to complete payment right now."));
    } finally {
      setPayingBookingId("");
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">

        {/* ── Header ── */}
        <section className="ink-panel px-8 py-12 md:px-12">
          <span className="section-kicker" style={{ color: "rgba(200,164,106,0.7)" }}>
            Notifications
          </span>
          <h1
            className="max-w-2xl text-[42px] font-medium text-white leading-[1.08]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.02em" }}
          >
            Booking updates, payment cues, and owner responses.
          </h1>
          <p className="mt-4 max-w-xl text-[14px] leading-[1.75]" style={{ color: "rgba(210,190,165,0.65)" }}>
            Manage rental request responses, review order details, and share alternate dates when needed.
          </p>
        </section>

        {/* ── Error ── */}
        {error && (
          <div
            className="mt-6 rounded-[16px] px-5 py-4 text-[13.5px]"
            style={{
              background: "rgba(200,70,60,0.07)",
              border: "1px solid rgba(200,70,60,0.18)",
              color: "#8a2a24",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="mt-6 rounded-[16px] px-5 py-4 text-[13.5px]"
            style={{
              background: "rgba(80,160,100,0.08)",
              border: "1px solid rgba(80,160,100,0.2)",
              color: "#2d6b40",
            }}
          >
            {success}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="mt-8 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="loading-shimmer rounded-[28px]"
                style={{ height: "140px", animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        )}

        {/* ── Notification list ── */}
        {!loading && (
          <div className="mt-8 space-y-5">
            {notifications.length === 0 && (
              <div className="editorial-empty-state">
                <Bell
                  size={28}
                  style={{ margin: "0 auto 12px", color: "rgba(160,144,128,0.5)" }}
                />
                <p
                  className="text-[20px] font-medium text-stone-800 mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  No notifications yet.
                </p>
                <p className="text-[13.5px]" style={{ color: "#9a8a7e" }}>
                  Booking updates and payment cues will appear here.
                </p>
              </div>
            )}

            {notifications.map((notification) => {
              const bookingId    = notification.metadata?.bookingId;
              const form         = responseForms[bookingId] || {};
              const isOwnerAction = notification.metadata?.actionRequired;
              const isApproved   = notification.type === "booking_approved";
              const isPaid = notification.metadata?.status === "paid";

              return (
                <div key={notification._id} className="notification-card">

                  {/* Card header bar */}
                  <div
                    className="flex items-start justify-between gap-4 px-6 py-5"
                    style={{ borderBottom: "1px solid rgba(16,13,10,0.07)" }}
                  >
                    <div className="flex gap-4">
                      <div
                        className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: isApproved
                            ? "rgba(80,160,100,0.1)"
                            : isOwnerAction
                            ? "rgba(200,164,106,0.12)"
                            : "rgba(60,140,200,0.1)",
                          color: isApproved ? "#2d6b40" : isOwnerAction ? "var(--warm)" : "#1a5a7e",
                        }}
                      >
                        {isApproved ? (
                          <CheckCircle size={16} />
                        ) : isOwnerAction ? (
                          <Bell size={16} />
                        ) : (
                          <MessageSquare size={16} />
                        )}
                      </div>
                      <div>
                        <h2
                          className="text-[20px] font-medium text-stone-900 leading-tight"
                          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                        >
                          {notification.title}
                        </h2>
                        <p className="mt-1 text-[13px] leading-[1.6]" style={{ color: "#7a6a60" }}>
                          {notification.message}
                        </p>
                      </div>
                    </div>

                    {isOwnerAction && (
                      <span
                        className="flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold"
                        style={{
                          background: "rgba(200,164,106,0.12)",
                          border: "1px solid rgba(200,164,106,0.25)",
                          color: "#8a6c1a",
                        }}
                      >
                        Action needed
                      </span>
                    )}
                  </div>

                  <div className="px-6 py-5 space-y-4">
                    {/* Booking meta */}
                    {notification.metadata?.totalDays && (
                      <div className="grid gap-2 sm:grid-cols-3 text-[13px]">
                        {[
                          { label: "Total days",    value: notification.metadata.totalDays },
                          { label: "Per day price", value: `₹${notification.metadata.perDayPrice}` },
                          { label: "Total amount",  value: `₹${notification.metadata.totalAmount}` },
                        ].map(({ label, value }) => (
                          <div key={label} className="booking-cell">
                            <p className="eyebrow mb-1.5" style={{ color: "#a09080" }}>{label}</p>
                            <p className="text-[15px] font-semibold text-stone-900">{value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Owner message */}
                    {notification.metadata?.ownerMessage && (
                      <div
                        className="rounded-[14px] px-4 py-3 text-[13px]"
                        style={{
                          background: "rgba(200,164,106,0.08)",
                          border: "1px solid rgba(200,164,106,0.18)",
                        }}
                      >
                        <p className="eyebrow mb-1" style={{ color: "var(--warm)" }}>Owner message</p>
                        <p style={{ color: "var(--ink-soft)" }}>{notification.metadata.ownerMessage}</p>
                      </div>
                    )}

                    {/* Payment details (approved) */}
                    {isApproved && !isPaid && (
                      <div
                        className="rounded-[14px] px-4 py-4"
                        style={{
                          background: "rgba(80,160,100,0.07)",
                          border: "1px solid rgba(80,160,100,0.18)",
                        }}
                      >
                        <p className="eyebrow mb-3" style={{ color: "#2d6b40" }}>Secure payment</p>
                        <p className="text-[13.5px] leading-[1.65] text-stone-700">
                          Your booking has been approved. Complete the payment through Razorpay to confirm it as paid.
                        </p>
                        {notification.metadata?.bookingId && (
                          <div className="mt-4 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handlePayNow(notification)}
                              disabled={payingBookingId === notification.metadata.bookingId}
                              className="vintage-btn-primary gap-2 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <IndianRupee size={13} />
                              {payingBookingId === notification.metadata.bookingId
                                ? "Opening payment..."
                                : "Pay Now"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {isPaid && (
                      <div
                        className="rounded-[14px] px-4 py-4"
                        style={{
                          background: "rgba(80,160,100,0.08)",
                          border: "1px solid rgba(80,160,100,0.2)",
                        }}
                      >
                        <p className="eyebrow mb-2" style={{ color: "#2d6b40" }}>Payment complete</p>
                        <p className="text-[13.5px] leading-[1.65] text-stone-700">
                          This booking has already been paid successfully and no further payment action is needed.
                        </p>
                      </div>
                    )}

                    {/* Owner action form */}
                    {isOwnerAction && (
                      <div
                        className="rounded-[18px] p-5 space-y-3"
                        style={{
                          background: "rgba(255,251,245,0.7)",
                          border: "1px solid rgba(200,164,106,0.18)",
                        }}
                      >
                        <p className="text-[13px] font-medium text-stone-700 flex items-center gap-2 mb-1">
                          <MessageSquare size={13} style={{ color: "var(--warm)" }} />
                          Respond to this booking
                        </p>

                        <textarea
                          placeholder="Message to customer (optional)"
                          value={form.ownerMessage || ""}
                          onChange={(e) => handleFormChange(bookingId, "ownerMessage", e.target.value)}
                          className="vintage-textarea min-h-[90px]"
                        />

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="mb-1.5 block text-[11.5px] font-medium uppercase tracking-[0.18em]" style={{ color: "#a09080" }}>
                              Alternate start date
                            </label>
                            <input
                              type="date"
                              value={form.alternateStartDate || ""}
                              onChange={(e) => handleFormChange(bookingId, "alternateStartDate", e.target.value)}
                              className="vintage-input"
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-[11.5px] font-medium uppercase tracking-[0.18em]" style={{ color: "#a09080" }}>
                              Alternate end date
                            </label>
                            <input
                              type="date"
                              value={form.alternateEndDate || ""}
                              onChange={(e) => handleFormChange(bookingId, "alternateEndDate", e.target.value)}
                              className="vintage-input"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => handleRespond(bookingId, "approve")}
                            className="vintage-btn-primary gap-2 text-[12.5px]"
                          >
                            <CheckCircle size={13} /> Yes, available
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRespond(bookingId, "alternate")}
                            className="vintage-btn-secondary gap-2 text-[12.5px]"
                          >
                            <CalendarClock size={13} /> Send alternate dates
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRespond(bookingId, "decline")}
                            className="vintage-btn-secondary gap-2 text-[12.5px]"
                            style={{ borderColor: "rgba(200,70,60,0.22)", color: "#8a2a24" }}
                          >
                            <XCircle size={13} /> Not available
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
