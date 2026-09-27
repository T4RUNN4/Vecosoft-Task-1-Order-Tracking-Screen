import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Copy,
  ExternalLink,
  Headphones,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShieldAlert,
  Truck,
  X,
} from "lucide-react";
import ordersData from "./data/orders.json";
import "./index.css";

const stateOptions = [
  { key: "on_time", label: "On time" },
  { key: "delayed", label: "Delayed" },
  { key: "delivered_not_received", label: "Delivered, not received" },
  { key: "tracking_unavailable", label: "Tracking unavailable" },
];

const money = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function statusTheme(accent) {
  return {
    blue: {
      icon: "bg-blue-100 text-blue-700 ring-blue-100",
      badge: "bg-blue-50 text-blue-700 border-blue-100",
      line: "bg-blue-600",
      dot: "bg-blue-600",
    },
    amber: {
      icon: "bg-amber-100 text-amber-700 ring-amber-100",
      badge: "bg-amber-50 text-amber-800 border-amber-200",
      line: "bg-amber-500",
      dot: "bg-amber-500",
    },
    rose: {
      icon: "bg-rose-100 text-rose-700 ring-rose-100",
      badge: "bg-rose-50 text-rose-700 border-rose-100",
      line: "bg-rose-500",
      dot: "bg-rose-500",
    },
    slate: {
      icon: "bg-slate-100 text-slate-600 ring-slate-100",
      badge: "bg-slate-100 text-slate-600 border-slate-200",
      line: "bg-slate-400",
      dot: "bg-slate-400",
    },
  }[accent];
}

function App() {
  const order = ordersData.orders[0];
  const [selectedState, setSelectedState] = useState("on_time");
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const current = order.states[selectedState];
  const theme = statusTheme(current.accent);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(timer);
  }, []);

  const timeline = useMemo(() => {
    return order.timeline.map((item, index) => {
      let done = item.done;

      if (selectedState === "tracking_unavailable") {
        done = index === 0;
      } else if (selectedState === "on_time") {
        done = index <= 2;
      } else if (selectedState === "delayed") {
        done = index <= 2;
      } else if (selectedState === "delivered_not_received") {
        done = index <= 3;
      }

      return { ...item, done };
    });
  }, [order.timeline, selectedState]);

  async function copyOrderId() {
    await navigator.clipboard?.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-5 text-slate-900 sm:px-6">
      <div className="mx-auto w-full max-w-107.5">
        <header className="mb-4 flex items-center justify-between px-1">
          <button
            className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Order tracking
            </p>
            <h1 className="mt-0.5 text-base font-bold text-slate-900">
              {order.id}
            </h1>
          </div>

          <button
            onClick={copyOrderId}
            className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
            aria-label="Copy order ID"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </header>

        {/* Demo state switcher — remove in production and drive selectedState from API data. */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold text-slate-500">
              Preview order status
            </span>

            <span className="text-[10px] text-slate-400">Demo only</span>
          </div>

          <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-100 p-1 shadow-sm scrollbar-none">
            {stateOptions.map((option) => {
              const isActive = selectedState === option.key;

              return (
                <button
                  key={option.key}
                  onClick={() => setSelectedState(option.key)}
                  className={cn(
                    "flex min-w-fit flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-2.5 text-[11px] font-semibold transition-all",
                    isActive
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:bg-white/70 hover:text-slate-700",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <section
          className={cn(
            "overflow-hidden rounded-[28px] border bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]",
            current.accent === "amber"
              ? "border-amber-200"
              : current.accent === "rose"
                ? "border-rose-200"
                : "border-slate-200",
          )}
        >
          {/* Status hero */}
          <div className="p-5 pb-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-2xl ring-8",
                  theme.icon,
                )}
              >
                {current.accent === "rose" ? (
                  <ShieldAlert size={23} />
                ) : current.accent === "amber" ? (
                  <Clock3 size={23} />
                ) : current.accent === "slate" ? (
                  <Package size={23} />
                ) : (
                  <Truck size={23} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                      theme.badge,
                    )}
                  >
                    {current.status}
                  </span>
                </div>
                <h2 className="text-[22px] font-extrabold leading-tight tracking-tight text-slate-950">
                  {current.label}
                </h2>
                <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
                  {current.message}
                </p>
              </div>
            </div>

            <div
              className={cn(
                "mt-5 rounded-2xl border p-4",
                current.accent === "amber"
                  ? "border-amber-100 bg-amber-50/70"
                  : current.accent === "rose"
                    ? "border-rose-100 bg-rose-50/60"
                    : "border-blue-100 bg-blue-50/60",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {selectedState === "delivered_not_received"
                      ? "Delivery recorded"
                      : "Estimated delivery"}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {current.estimated}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {current.window}
                  </p>
                </div>
                <div className="grid size-10 place-items-center rounded-xl bg-white shadow-sm">
                  <MapPin size={18} className="text-slate-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="border-y border-slate-100 px-5 py-5 sm:px-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Delivery progress
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {current.progress}% complete
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {selectedState === "tracking_unavailable"
                  ? "Awaiting tracking"
                  : selectedState === "delivered_not_received"
                    ? "Action needed"
                    : "In transit"}
              </span>
            </div>

            <div className="relative">
              <div className="absolute left-3.25 top-3.5 bottom-3.5 w-px bg-slate-200" />

              <div className="space-y-5">
                {timeline.map((item, index) => {
                  const active =
                    selectedState === "tracking_unavailable"
                      ? index === 0
                      : index ===
                        (selectedState === "delivered_not_received" ? 3 : 2);
                  return (
                    <div key={item.title} className="relative flex gap-3">
                      <div
                        className={cn(
                          "relative z-10 grid size-7 shrink-0 place-items-center rounded-full border-2 bg-white",
                          item.done
                            ? cn("border-transparent text-white", theme.dot)
                            : active
                              ? "border-slate-900 text-slate-900"
                              : "border-slate-200 text-slate-300",
                        )}
                      >
                        {item.done ? (
                          <Check size={13} strokeWidth={3} />
                        ) : active ? (
                          <span className="size-2 rounded-full bg-current" />
                        ) : (
                          <span className="size-1.5 rounded-full bg-slate-200" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pb-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              item.done || active
                                ? "text-slate-900"
                                : "text-slate-400",
                            )}
                          >
                            {item.title}
                          </p>
                          {active && (
                            <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Product */}
          <button
            onClick={() => setDetailsOpen(true)}
            className="group flex w-full items-center gap-3 p-5 text-left transition hover:bg-slate-50 sm:px-6"
          >
            <img
              src={order.product.image}
              alt=""
              className="size-16 rounded-2xl object-cover ring-1 ring-slate-200"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {order.product.name}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {order.product.variant} · Qty {order.product.quantity}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-700">
                {money.format(order.product.price)}
              </p>
            </div>
            <ArrowRight
              size={17}
              className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
            />
          </button>

          {selectedState === "tracking_unavailable" && (
            <div className="mx-5 mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:mx-6">
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-slate-500 shadow-sm">
                  <Package size={17} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Tracking isn't available yet
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your order exists and has been confirmed. Tracking details
                    will appear here once the carrier receives and scans the
                    package.
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2.5">
                <RefreshCw size={14} className="text-slate-400" />
                <span className="text-[11px] font-medium text-slate-500">
                  No action is needed right now.
                </span>
              </div>
            </div>
          )}

          {/* Contextual action */}
          {selectedState === "delayed" && (
            <div className="mx-5 mb-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 sm:mx-6">
              <p className="text-sm font-bold text-amber-950">
                What happens next?
              </p>
              <p className="mt-1 text-xs leading-5 text-amber-800">
                The carrier has been notified. If the package does not arrive by
                Sep 30, contact support and we’ll investigate it for you.
              </p>
            </div>
          )}

          {selectedState === "delivered_not_received" && (
            <div className="mx-5 mb-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 sm:mx-6">
              <p className="text-sm font-bold text-rose-950">
                Can’t find the package?
              </p>
              <p className="mt-1 text-xs leading-5 text-rose-800">
                Check around your entrance and with household members or
                neighbors. If it’s still missing, report it to support.
              </p>
            </div>
          )}

          {/* Footer actions */}
          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 p-4 sm:px-6">
            <button
              onClick={() => setDetailsOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
            >
              <Package size={16} />
              Order details
            </button>
            <button
              onClick={() => setSupportOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-3 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-[0.99]"
            >
              <Headphones size={16} />
              {selectedState === "delivered_not_received"
                ? "Report issue"
                : selectedState === "tracking_unavailable"
                  ? "Contact support"
                  : "Contact support"}
            </button>
          </div>
        </section>

        <p className="py-5 text-center text-[10px] leading-4 text-slate-400">
          Last updated just now · Tracking information may change as the carrier
          scans your package.
        </p>
      </div>

      {detailsOpen && (
        <Modal title="Order details" onClose={() => setDetailsOpen(false)}>
          <div className="space-y-4">
            <div className="flex gap-3">
              <img
                src={order.product.image}
                alt=""
                className="size-20 rounded-2xl object-cover"
              />
              <div>
                <p className="font-bold text-slate-900">{order.product.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {order.product.variant}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {money.format(order.product.price)}
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <DetailRow label="Order ID" value={order.id} />
              <DetailRow
                label="Quantity"
                value={String(order.product.quantity)}
              />
              <DetailRow label="Customer" value={order.customer} />
              <DetailRow label="Payment" value="Cash on delivery" last />
            </div>
          </div>
        </Modal>
      )}

      {supportOpen && (
        <Modal
          title={
            selectedState === "delivered_not_received"
              ? "Report a missing delivery"
              : selectedState === "tracking_unavailable"
                ? "Ask about your order"
                : "Contact support"
          }
          onClose={() => setSupportOpen(false)}
        >
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm">
                <CircleHelp size={19} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {selectedState === "delivered_not_received"
                    ? "We’ll help locate your package."
                    : selectedState === "tracking_unavailable"
                      ? "Your order is confirmed, but tracking hasn't started yet."
                      : "Need help with this order?"}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Our support team is available from 9 AM to 10 PM. We can
                  confirm your order status if you have any questions.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700">
              <Phone size={15} />
              Call us
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white">
              <Headphones size={15} />
              Live chat
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function LoadingScreen() {
  return (
    <main className="min-h-screen bg-slate-50 px-3 py-5">
      <div className="mx-auto w-full max-w-107.5 animate-pulse">
        <div className="mb-4 flex justify-between">
          <div className="size-10 rounded-full bg-slate-200" />
          <div className="h-10 w-28 rounded-xl bg-slate-200" />
          <div className="size-10 rounded-full bg-slate-200" />
        </div>
        <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
          <div className="p-6">
            <div className="flex gap-4">
              <div className="size-12 rounded-2xl bg-slate-200" />
              <div className="flex-1">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="mt-3 h-7 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-full rounded bg-slate-100" />
              </div>
            </div>
            <div className="mt-5 h-24 rounded-2xl bg-slate-100" />
          </div>
          <div className="border-y border-slate-100 p-6">
            <div className="h-4 w-36 rounded bg-slate-200" />
            <div className="mt-5 space-y-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="size-7 rounded-full bg-slate-200" />
                  <div className="h-8 flex-1 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
          <div className="p-5">
            <div className="h-16 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    </main>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 p-3 backdrop-blur-[2px] sm:items-center">
      <div className="w-full max-w-107.5 rounded-[28px] bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-950">{title}</h3>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value, last = false }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-2.5",
        !last && "border-b border-slate-200",
      )}
    >
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
