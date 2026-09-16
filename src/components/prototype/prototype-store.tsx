"use client";

import {
  callNextFarmer,
  checkInBooking,
  completeProcurement,
  createBooking,
  getKisanBookingOptions,
  getKisanDashboard,
  getOperatorDashboard,
  updateCentreStatus as saveCentreStatus,
  updatePaymentStatus,
  updateSlotStatus as saveSlotStatus,
  sendCentreNotification,
} from "../../actions";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CentreStatus, PaymentStatus, PrototypeState } from "../../lib/prototype-data";

type Role = "KISAN" | "ADMIN";
type BookingInput = {
  centreId: string;
  slotId: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  crops: { cropId: string; quantity: number }[];
};
type BookingOptions = Awaited<ReturnType<typeof getKisanBookingOptions>>;
type BookingRecord = {
  id: string;
  bookingCode: string;
  expectedQuantity: number;
  queuePosition: number;
  bookingStatus: keyof typeof statusMap;
  procurementStatus: keyof typeof procurementMap;
  crop: { name: string };
  centre: { name: string };
  slot: { startsAt: Date; endsAt: Date };
  payment: { amount: number; status: keyof typeof paymentMap } | null;
  procurement: { actualWeight: number; grade: string; amount: number } | null;
  cropItems?: { quantity: number; crop: { name: string } }[];
  state?: string | null;
  district?: string | null;
  tehsil?: string | null;
  village?: string | null;
  totalQuantity?: number | null;
  processingMinutes?: number | null;
  kisan: { name: string; phoneNumber: string; kisanId: string; state: string; district: string };
};

type PrototypeStore = {
  state: PrototypeState;
  bookingOptions: BookingOptions | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setLanguage: (language: PrototypeState["language"]) => void;
  confirmBooking: (input?: BookingInput) => Promise<string | null>;
  checkInFarmer: (bookingId?: string) => Promise<void>;
  callFarmer: () => Promise<void>;
  completeProcurement: (actualWeight: number, grade: string, ratePerQuintal: number, remarks?: string) => Promise<void>;
  updatePayment: (status: PaymentStatus, bookingId?: string) => Promise<void>;
  updateCentreStatus: (status: CentreStatus, delayMessage?: string) => Promise<void>;
  updateSlotStatus: (slotId: string, status: PrototypeState["slots"][number]["status"]) => Promise<void>;
  addNotification: (title: string, message: string, type?: PrototypeState["notifications"][number]["type"]) => Promise<void>;
};

const emptyState: PrototypeState = {
  farmerProfile: { name: "", mobile: "", farmerId: "", state: "", district: "", block: "", village: "" },
  bookings: [], queue: [],
  payment: { amount: 0, bank: "", status: "pending", transactionId: "", expected: "" },
  notifications: [], schemes: [], slots: [],
  centre: { name: "", location: "", status: "closed", capacity: 0, counters: 0 },
  currentlyServing: "", language: "en",
};

const statusMap = { CONFIRMED: "confirmed", CHECKED_IN: "checked-in", CALLED: "called", COMPLETED: "completed", CANCELLED: "no-show", NO_SHOW: "no-show" } as const;
const procurementMap = { SLOT_CONFIRMED: "slot-confirmed", ARRIVED: "arrived", WEIGHING: "weighing", COMPLETED: "completed", REJECTED: "completed" } as const;
const paymentMap = { PENDING: "pending", PROCESSING: "processing", RECEIVED: "received", FAILED: "pending" } as const;

function formatDate(value: Date | string) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value)); }
function formatTime(start: Date | string, end: Date | string) {
  const options: Intl.DateTimeFormatOptions = { timeStyle: "short" };
  return `${new Intl.DateTimeFormat("en-IN", options).format(new Date(start))} - ${new Intl.DateTimeFormat("en-IN", options).format(new Date(end))}`;
}

function mapBooking(booking: BookingRecord) {
  const crops = booking.cropItems?.length
    ? booking.cropItems.map((item) => ({ name: item.crop.name, quantity: item.quantity }))
    : [{ name: booking.crop.name, quantity: booking.expectedQuantity }];
  return {
    id: booking.bookingCode,
    databaseId: booking.id,
    crop: crops.map((item) => item.name).join(", "),
    crops,
    centre: booking.centre.name,
    state: booking.state || booking.kisan.state,
    district: booking.district || booking.kisan.district,
    tehsil: booking.tehsil || "",
    village: booking.village || "",
    date: formatDate(booking.slot.startsAt),
    time: formatTime(booking.slot.startsAt, booking.slot.endsAt),
    quantity: booking.totalQuantity || booking.expectedQuantity,
    processingMinutes: booking.processingMinutes || undefined,
    queuePosition: booking.queuePosition,
    queueAhead: Math.max(booking.queuePosition - 1, 0),
    estimatedWait: booking.bookingStatus === "CALLED" ? "Proceed to counter" : "",
    bookingStatus: statusMap[booking.bookingStatus],
    procurementStatus: procurementMap[booking.procurementStatus],
    paymentStatus: booking.payment ? paymentMap[booking.payment.status] : "pending",
    actualWeight: booking.procurement?.actualWeight,
    grade: booking.procurement?.grade,
    amount: booking.payment?.amount ?? booking.procurement?.amount ?? 0,
  };
}

function mapKisanState(data: Awaited<ReturnType<typeof getKisanDashboard>>): PrototypeState {
  const bookings = data.bookings.map((item) => mapBooking(item as unknown as BookingRecord));
  const first = bookings[0];
  return {
    ...emptyState,
    farmerProfile: { name: data.name, mobile: data.phoneNumber, farmerId: data.kisanId, state: data.state, district: data.district, block: data.tehsil || "", village: data.village || "" },
    bookings,
    payment: first ? { amount: first.amount, bank: "", status: first.paymentStatus, transactionId: "", expected: "" } : emptyState.payment,
    notifications: data.notifications.map((item) => ({ id: item.id, type: item.type.toLowerCase() as PrototypeState["notifications"][number]["type"], title: item.title, message: item.message, time: formatDate(item.createdAt), read: Boolean(item.readAt) })),
    schemes: [],
    centre: first ? { ...emptyState.centre, name: first.centre, location: first.centre, status: "open" } : emptyState.centre,
  };
}

function mapOperatorState(data: Awaited<ReturnType<typeof getOperatorDashboard>>): PrototypeState {
  if (!data.centre) return emptyState;
  const bookings = data.bookings.map((item) => mapBooking(item as unknown as BookingRecord));
  return {
    ...emptyState,
    bookings,
    queue: data.bookings.map((booking) => ({ token: booking.bookingCode, farmer: booking.kisan.name, crop: booking.crop.name, quantity: booking.expectedQuantity, slot: formatTime(booking.slot.startsAt, booking.slot.endsAt), status: booking.bookingStatus === "COMPLETED" ? "Completed" : booking.bookingStatus === "CALLED" ? "Processing" : booking.bookingStatus === "NO_SHOW" ? "No Show" : "Waiting" })),
    slots: data.slots.map((slot) => ({ id: slot.id, date: formatDate(slot.startsAt), label: formatTime(slot.startsAt, slot.endsAt), available: Math.max(slot.capacity - slot.bookedCount, 0), capacity: slot.capacity, status: slot.status.toLowerCase() as PrototypeState["slots"][number]["status"] })),
    centre: { name: data.centre.name, location: `${data.centre.address}, ${data.centre.district}`, status: data.centre.status.toLowerCase() as CentreStatus, capacity: data.slots.reduce((total, slot) => total + slot.capacity, 0), counters: 0 },
    farmerProfile: data.bookings[0] ? { name: data.bookings[0].kisan.name, mobile: data.bookings[0].kisan.phoneNumber, farmerId: data.bookings[0].kisan.kisanId, state: data.bookings[0].kisan.state, district: data.bookings[0].kisan.district, block: "", village: "" } : emptyState.farmerProfile,
    payment: bookings[0] ? { amount: bookings[0].amount, bank: "", transactionId: "", expected: "", status: bookings[0].paymentStatus } : emptyState.payment,
  };
}

const PrototypeContext = createContext<PrototypeStore | null>(null);

export function PrototypeProvider({ children, role }: { children: ReactNode; role: Role }) {
  const [state, setState] = useState(emptyState);
  const [bookingOptions, setBookingOptions] = useState<BookingOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      if (role === "KISAN") {
        const [dashboard, options] = await Promise.all([getKisanDashboard(), getKisanBookingOptions()]);
        setBookingOptions(options);
        const mapped = mapKisanState(dashboard);
        setState({
          ...mapped,
          schemes: options.schemes.map((scheme) => ({ id: scheme.slug, name: scheme.name, summary: scheme.summary, eligible: true, about: scheme.about, eligibility: scheme.eligibility, benefits: scheme.benefits, documents: scheme.documents, apply: scheme.apply, dates: scheme.dates })),
          slots: options.centres.flatMap((centre) => centre.slots.map((slot) => ({
            id: slot.id,
            date: formatDate(slot.startsAt),
            label: formatTime(slot.startsAt, slot.endsAt),
            available: Math.max(slot.capacity - slot.bookedCount, 0),
            capacity: slot.capacity,
            status: slot.status.toLowerCase() as PrototypeState["slots"][number]["status"],
          }))),
        });
      }
      else setState(mapOperatorState(await getOperatorDashboard()));
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load live data.");
    } finally { setLoading(false); }
  };

  useEffect(() => { void refresh(); }, [role]);

  const value = useMemo<PrototypeStore>(() => ({
    state, bookingOptions, loading, error, refresh,
    setLanguage: (language) => setState((current) => ({ ...current, language })),
    confirmBooking: async (input) => {
      if (!input) return null;
      const result = await createBooking(input);
      if (!result.success) throw new Error(result.error);
      await refresh();
      return result.data.bookingCode;
    },
    checkInFarmer: async (bookingId) => { const result = await checkInBooking(bookingId || state.bookings[0]?.databaseId || ""); if (!result.success) throw new Error(result.error); await refresh(); },
    callFarmer: async () => { const dashboard = await getOperatorDashboard(); const result = await callNextFarmer(dashboard.centre?.id || ""); if (!result.success) throw new Error(result.error); await refresh(); },
    completeProcurement: async (actualWeight, grade, ratePerQuintal, remarks) => { const result = await completeProcurement({ bookingId: state.bookings[0]?.databaseId, actualWeight, grade, ratePerQuintal, remarks }); if (!result.success) throw new Error(result.error); await refresh(); },
    updatePayment: async (status, bookingId) => { const result = await updatePaymentStatus(bookingId || state.bookings[0]?.databaseId || "", status.toUpperCase()); if (!result.success) throw new Error(result.error); await refresh(); },
    updateCentreStatus: async (status) => { const dashboard = await getOperatorDashboard(); if (!dashboard.centre) return; const result = await saveCentreStatus(dashboard.centre.id, status.toUpperCase() as "OPEN" | "DELAYED" | "CLOSED"); if (!result.success) throw new Error(result.error); await refresh(); },
    updateSlotStatus: async (slotId, status) => { const result = await saveSlotStatus(slotId, status.toUpperCase() as "AVAILABLE" | "LIMITED" | "FULL" | "CLOSED"); if (!result.success) throw new Error(result.error); await refresh(); },
    addNotification: async (title, message) => { const result = await sendCentreNotification(title, message); if (!result.success) throw new Error(result.error); await refresh(); },
  }), [state, loading, error]);

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototype() {
  const store = useContext(PrototypeContext);
  if (!store) throw new Error("usePrototype must be used inside PrototypeProvider");
  return store;
}
