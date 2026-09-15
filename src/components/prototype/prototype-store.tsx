"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { demoBookingId, initialPrototypeState, type PaymentStatus, type PrototypeState } from "../../lib/prototype-data";

type PrototypeStore = {
  state: PrototypeState;
  resetDemo: () => void;
  setLanguage: (language: PrototypeState["language"]) => void;
  confirmBooking: () => void;
  checkInFarmer: () => void;
  callFarmer: () => void;
  completeProcurement: (actualWeight: number, grade: string) => void;
  updatePayment: (status: PaymentStatus) => void;
  updateCentreStatus: (status: PrototypeState["centre"]["status"], delayMessage?: string) => void;
  updateSlotStatus: (slotId: string, status: PrototypeState["slots"][number]["status"]) => void;
  addNotification: (title: string, message: string, type?: PrototypeState["notifications"][number]["type"]) => void;
};

const PrototypeContext = createContext<PrototypeStore | null>(null);
const storageKey = "kisan-sih-2026-prototype";

function createNotification(title: string, message: string, type: PrototypeState["notifications"][number]["type"]) {
  return {
    id: `n-${Date.now()}`,
    title,
    message,
    type,
    time: "Just now",
    read: false,
  };
}

function updateDemoBooking(state: PrototypeState, update: Partial<PrototypeState["bookings"][number]>) {
  return {
    ...state,
    bookings: state.bookings.map((booking) => (booking.id === demoBookingId ? { ...booking, ...update } : booking)),
  };
}

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PrototypeState>(initialPrototypeState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setState({ ...initialPrototypeState, ...JSON.parse(saved) });
      } catch {
        setState(initialPrototypeState);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [hydrated, state]);

  const commitState = (updater: (current: PrototypeState) => PrototypeState) => {
    setState((current) => {
      const next = updater(current);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      }
      return next;
    });
  };

  const value = useMemo<PrototypeStore>(
    () => ({
      state,
      resetDemo: () => {
        window.localStorage.setItem(storageKey, JSON.stringify(initialPrototypeState));
        setState(initialPrototypeState);
      },
      setLanguage: (language) => commitState((current) => ({ ...current, language })),
      confirmBooking: () =>
        commitState((current) => ({
          ...updateDemoBooking(current, {
            bookingStatus: "confirmed",
            procurementStatus: "slot-confirmed",
            paymentStatus: "processing",
            queuePosition: 12,
            queueAhead: 12,
            estimatedWait: "25 minutes",
          }),
          notifications: [
            createNotification("Procurement slot confirmed", "Your Wheat slot is confirmed for 18 September at 10:00 AM.", "success"),
            ...current.notifications,
          ],
        })),
      checkInFarmer: () =>
        commitState((current) => ({
          ...updateDemoBooking(current, { bookingStatus: "checked-in", procurementStatus: "arrived", queuePosition: 12, queueAhead: 12 }),
          queue: current.queue.map((item) => (item.token === "#10234" ? { ...item, status: "Waiting" } : item)),
          notifications: [
            createNotification("Check-in complete", "You are #12 in the queue. Estimated waiting time is 25 minutes.", "success"),
            ...current.notifications,
          ],
        })),
      callFarmer: () =>
        commitState((current) => ({
          ...updateDemoBooking(current, { bookingStatus: "called", procurementStatus: "weighing", queuePosition: 0, queueAhead: 0, estimatedWait: "Proceed to Counter 2" }),
          currentlyServing: "#10234",
          queue: current.queue.map((item) => (item.token === "#10234" ? { ...item, status: "Processing" } : item)),
          notifications: [
            createNotification("It's your turn", "Please proceed to Counter 2 for weighing.", "info"),
            ...current.notifications,
          ],
        })),
      completeProcurement: (actualWeight, grade) =>
        commitState((current) => {
          const amount = Math.round(actualWeight * 2275);
          return {
            ...updateDemoBooking(current, {
              bookingStatus: "completed",
              procurementStatus: "completed",
              paymentStatus: "processing",
              actualWeight,
              grade,
              amount,
            }),
            payment: { ...current.payment, amount, status: "processing" },
            queue: current.queue.map((item) => (item.token === "#10234" ? { ...item, status: "Completed" } : item)),
            notifications: [
              createNotification("Procurement completed", `Your produce weighing is complete. Payment of Rs. ${amount.toLocaleString("en-IN")} is processing.`, "success"),
              ...current.notifications,
            ],
          };
        }),
      updatePayment: (status) =>
        commitState((current) => ({
          ...updateDemoBooking(current, { paymentStatus: status }),
          payment: { ...current.payment, status, receivedDate: status === "received" ? "20 September 2026" : current.payment.receivedDate },
          notifications: [
            createNotification(
              status === "received" ? "Payment credited" : "Payment update",
              status === "received"
                ? `Rs. ${current.payment.amount.toLocaleString("en-IN")} has been credited to your registered bank account.`
                : "Your payment is being processed.",
              status === "received" ? "payment" : "warning",
            ),
            ...current.notifications,
          ],
        })),
      updateCentreStatus: (status, delayMessage) =>
        commitState((current) => ({
          ...current,
          centre: { ...current.centre, status, delayMessage },
          notifications:
            status === "delayed"
              ? [createNotification("Centre delay", delayMessage || "Procurement is delayed by approximately 30 minutes.", "warning"), ...current.notifications]
              : current.notifications,
        })),
      updateSlotStatus: (slotId, status) =>
        commitState((current) => ({
          ...current,
          slots: current.slots.map((slot) => (slot.id === slotId ? { ...slot, status, available: status === "full" ? 0 : slot.available || 8 } : slot)),
        })),
      addNotification: (title, message, type = "info") =>
        commitState((current) => ({ ...current, notifications: [createNotification(title, message, type), ...current.notifications] })),
    }),
    [state],
  );

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototype() {
  const store = useContext(PrototypeContext);
  if (!store) throw new Error("usePrototype must be used inside PrototypeProvider");
  return store;
}
