export type BookingStatus =
  | "confirmed"
  | "checked-in"
  | "called"
  | "completed"
  | "no-show";
export type ProcurementStatus =
  | "slot-confirmed"
  | "arrived"
  | "weighing"
  | "completed";
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

export type TimelineItem = {
  label: string;
  time: string;
  description: string;
  state: "done" | "active" | "upcoming";
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

export const demoBookingId = "#PROC10234";

export const initialPrototypeState: PrototypeState = {
  farmerProfile: {
    name: "Ramesh Kumar",
    mobile: "9876543210",
    farmerId: "FRM10234",
    state: "Uttar Pradesh",
    district: "Meerut",
    block: "Daurala",
    village: "Sardhana",
  },
  bookings: [
    {
      id: demoBookingId,
      crop: "Wheat",
      centre: "Meerut Procurement Centre",
      date: "18 September 2026",
      time: "10:00 AM - 11:00 AM",
      quantity: 25,
      queuePosition: 12,
      queueAhead: 12,
      estimatedWait: "25 minutes",
      bookingStatus: "confirmed",
      procurementStatus: "slot-confirmed",
      paymentStatus: "processing",
      amount: 42500,
    },
    {
      id: "#PROC10118",
      crop: "Paddy / Rice",
      centre: "Meerut Procurement Centre",
      date: "12 August 2026",
      time: "09:00 AM - 10:00 AM",
      quantity: 18,
      queuePosition: 0,
      queueAhead: 0,
      estimatedWait: "Completed",
      bookingStatus: "completed",
      procurementStatus: "completed",
      paymentStatus: "received",
      actualWeight: 18,
      grade: "A",
      amount: 37200,
    },
  ],
  queue: [
    {
      token: "#10221",
      farmer: "Mahesh Pal",
      crop: "Wheat",
      quantity: 22,
      slot: "09:00",
      status: "Completed",
    },
    {
      token: "#10222",
      farmer: "Suresh Singh",
      crop: "Wheat",
      quantity: 30,
      slot: "09:30",
      status: "Processing",
    },
    {
      token: "#10223",
      farmer: "Amit Kumar",
      crop: "Wheat",
      quantity: 20,
      slot: "10:00",
      status: "Waiting",
    },
    {
      token: "#10224",
      farmer: "Rajesh",
      crop: "Wheat",
      quantity: 18,
      slot: "10:00",
      status: "Waiting",
    },
    {
      token: "#10234",
      farmer: "Ramesh Kumar",
      crop: "Wheat",
      quantity: 25,
      slot: "10:00",
      status: "Waiting",
    },
  ],
  payment: {
    amount: 42500,
    bank: "XXXX Bank",
    status: "processing",
    transactionId: "#TXN982341",
    expected: "Within 2 working days",
  },
  notifications: [
    {
      id: "n1",
      type: "info",
      title: "Your procurement slot is tomorrow",
      message:
        "Your Wheat procurement slot at Meerut Centre is scheduled for 10:00 AM.",
      time: "Today",
      read: false,
    },
    {
      id: "n2",
      type: "warning",
      title: "Payment is being processed",
      message:
        "Your payment of Rs. 42,500 is being processed. No action is needed.",
      time: "Today",
      read: false,
    },
  ],
  schemes: [
    {
      id: "pm-kisan",
      name: "PM-KISAN",
      summary: "Financial support for eligible farmer families.",
      eligible: true,
      about:
        "PM-KISAN provides direct income support to eligible farmer families through government benefit transfer.",
      eligibility:
        "Small and marginal farmers with valid land records and Aadhaar-linked bank accounts.",
      benefits: [
        "Direct financial assistance",
        "Transparent transfer to bank account",
        "Support for seasonal input costs",
      ],
      documents: [
        "Aadhaar card",
        "Bank passbook",
        "Land record",
        "Mobile number",
      ],
      apply:
        "Apply through the official PM-KISAN portal or nearest Common Service Centre.",
      dates: "Applications are accepted throughout the year.",
    },
    {
      id: "fasal-bima",
      name: "Pradhan Mantri Fasal Bima Yojana",
      summary: "Crop insurance support against notified risks.",
      eligible: true,
      about:
        "The scheme helps farmers reduce financial risk from crop loss due to natural calamities, pests, or disease.",
      eligibility:
        "Farmers growing notified crops in notified areas can apply.",
      benefits: [
        "Crop loss protection",
        "Affordable premium",
        "Coverage for notified risks",
      ],
      documents: [
        "Aadhaar card",
        "Crop sowing certificate",
        "Bank details",
        "Land record",
      ],
      apply:
        "Apply through your bank, insurance portal, or agriculture department office.",
      dates:
        "Enrollment deadlines depend on crop season and state notifications.",
    },
    {
      id: "sinchayee",
      name: "PM Krishi Sinchayee Yojana",
      summary: "Support for irrigation and efficient water use.",
      eligible: false,
      about:
        "The scheme supports improved irrigation coverage and water-use efficiency for farms.",
      eligibility:
        "Eligibility depends on state irrigation plans and approved local projects.",
      benefits: [
        "Irrigation support",
        "Water conservation",
        "Efficient farm water use",
      ],
      documents: [
        "Aadhaar card",
        "Land record",
        "Project application",
        "Bank details",
      ],
      apply:
        "Contact the district agriculture office for project-specific application steps.",
      dates: "State-wise application windows vary.",
    },
    {
      id: "mechanization",
      name: "Agricultural Mechanization",
      summary: "Support for farm machinery and equipment.",
      eligible: true,
      about:
        "Mechanization support helps farmers access equipment for improved productivity and reduced labour burden.",
      eligibility:
        "Eligible farmers and farmer groups can apply under state machinery subsidy rules.",
      benefits: [
        "Machinery subsidy",
        "Improved productivity",
        "Support for farmer groups",
      ],
      documents: ["Aadhaar card", "Quotation", "Land record", "Bank details"],
      apply:
        "Apply through the state agriculture portal or district agriculture office.",
      dates: "Open as per state subsidy notification.",
    },
  ],
  slots: [
    {
      id: "s1",
      date: "Mon 16",
      label: "09:00 AM - 10:00 AM",
      available: 18,
      capacity: 20,
      status: "available",
    },
    {
      id: "s2",
      date: "Wed 18",
      label: "10:00 AM - 11:00 AM",
      available: 12,
      capacity: 20,
      status: "available",
    },
    {
      id: "s3",
      date: "Wed 18",
      label: "11:00 AM - 12:00 PM",
      available: 4,
      capacity: 20,
      status: "limited",
    },
    {
      id: "s4",
      date: "Thu 19",
      label: "12:00 PM - 01:00 PM",
      available: 0,
      capacity: 20,
      status: "full",
    },
  ],
  centre: {
    name: "Meerut Procurement Centre",
    location: "Meerut, Uttar Pradesh",
    status: "open",
    capacity: 100,
    counters: 3,
  },
  currentlyServing: "#10222",
  language: "en",
};
