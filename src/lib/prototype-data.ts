export type BookingStatus = "confirmed" | "checked-in" | "called" | "completed" | "no-show";
export type ProcurementStatus = "slot-confirmed" | "arrived" | "weighing" | "completed";
export type PaymentStatus = "pending" | "processing" | "received";
export type CentreStatus = "open" | "delayed" | "closed";

export type FarmerProfile = {
  name: string;
  mobile: string;
  farmerId: string;
  state: string;
  district: string;
  block: string;
  village: string;
};

export type Booking = {
  id: string;
  databaseId?: string;
  crop: string;
  centre: string;
  date: string;
  time: string;
  quantity: number;
  queuePosition: number;
  queueAhead: number;
  estimatedWait: string;
  bookingStatus: BookingStatus;
  procurementStatus: ProcurementStatus;
  paymentStatus: PaymentStatus;
  actualWeight?: number;
  grade?: string;
  amount: number;
};

export type QueueFarmer = {
  token: string;
  farmer: string;
  crop: string;
  quantity: number;
  slot: string;
  status: "Completed" | "Processing" | "Waiting" | "No Show";
};

export type Payment = {
  amount: number;
  bank: string;
  status: PaymentStatus;
  transactionId: string;
  expected: string;
  receivedDate?: string;
};

export type NotificationItem = {
  id: string;
  type: "info" | "warning" | "success" | "payment";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export type Scheme = {
  id: string;
  name: string;
  summary: string;
  eligible: boolean;
  about: string;
  eligibility: string;
  benefits: string[];
  documents: string[];
  apply: string;
  dates: string;
};

export type Slot = {
  id: string;
  date: string;
  label: string;
  available: number;
  capacity: number;
  status: "available" | "limited" | "full" | "closed";
};

export type Centre = {
  name: string;
  location: string;
  status: CentreStatus;
  delayMessage?: string;
  capacity: number;
  counters: number;
};

export type PrototypeState = {
  farmerProfile: FarmerProfile;
  bookings: Booking[];
  queue: QueueFarmer[];
  payment: Payment;
  notifications: NotificationItem[];
  schemes: Scheme[];
  slots: Slot[];
  centre: Centre;
  currentlyServing: string;
  language: "en" | "hi";
};
