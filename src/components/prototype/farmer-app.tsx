"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  FileText,
  HelpCircle,
  Home,
  Landmark,
  Languages,
  MapPin,
  Menu,
  Search,
  Sprout,
  Tractor,
  User,
  UsersRound,
  Wheat,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { logout } from "../../actions";
import { calculateProcessingMinutes } from "../../lib/procurement-master-data";
import type { Booking, Scheme, Slot } from "../../lib/prototype-data";
import { cn } from "../ui/cn";
import { PrototypeProvider, usePrototype } from "./prototype-store";

type FarmerScreen =
  | "dashboard"
  | "book"
  | "queue"
  | "status"
  | "payment"
  | "schemes"
  | "scheme-detail";

const navItems = [
  { href: "/farmer", label: "Dashboard" },
  { href: "/farmer#bookings", label: "My Bookings" },
  { href: "/farmer/status", label: "Procurement Status" },
  { href: "/farmer/schemes", label: "Government Schemes" },
  { href: "/farmer#help", label: "Help" },
];

const steps = [
  "Farmer Details",
  "Procurement Details",
  "Select Slot",
  "Review & Confirm",
];

export function FarmerApp({
  screen,
  schemeId,
}: {
  screen: FarmerScreen;
  schemeId?: string;
}) {
  return (
    <PrototypeProvider role="KISAN">
      <FarmerShell screen={screen} schemeId={schemeId} />
    </PrototypeProvider>
  );
}

function FarmerShell({
  screen,
  schemeId,
}: {
  screen: FarmerScreen;
  schemeId?: string;
}) {
  const { state, loading, error, setLanguage } = usePrototype();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const booking = state.bookings[0];

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-[#f7f4eb] p-6 text-lg font-black text-green-900">Loading live procurement data...</main>;
  }

  if (error) {
    return <main className="grid min-h-screen place-items-center bg-[#f7f4eb] p-6 text-center"><div><h1 className="text-2xl font-black text-red-900">Unable to load procurement data</h1><p className="mt-2 text-red-800/70">{error}</p></div></main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f4eb] text-[#12351f]">
      <header className="sticky top-0 z-40 border-b border-green-900/10 bg-[#fffdf6]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Kisan SIH home"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1e6b3b] text-white shadow-lg shadow-green-900/20">
              <Wheat className="h-6 w-6" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-black">
                Kisan Procurement
              </span>
              <span className="block text-xs font-semibold text-green-800/70">
                Digital Mandi Portal
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-green-900/10 bg-white p-1 shadow-sm lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-bold text-green-950/70 transition hover:bg-green-50 hover:text-green-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(state.language === "en" ? "hi" : "en")}
              className="hidden min-h-11 items-center gap-2 rounded-full border border-green-900/10 bg-white px-3 text-sm font-bold text-green-900 shadow-sm sm:inline-flex"
            >
              <Languages className="h-4 w-4" />
              {state.language === "en" ? "English" : "Hindi"}
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileOpen((open) => !open)}
                className="flex min-h-11 items-center gap-2 rounded-full border border-green-900/10 bg-white px-2 py-1 shadow-sm sm:px-3"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1e6b3b] text-xs font-black text-white">
                  RK
                </span>
                <span className="hidden text-left text-xs leading-tight sm:block">
                  <strong className="block">{state.farmerProfile.name}</strong>
                  <span className="text-green-900/60">
                    {state.farmerProfile.district}, UP
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-green-900/60" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-green-900/10 bg-white p-2 text-sm font-semibold shadow-xl">
                  <Link onClick={() => setProfileOpen(false)} href="/farmer#profile" className="block rounded-xl px-3 py-2 text-left hover:bg-green-50">My Profile</Link>
                  <Link onClick={() => setProfileOpen(false)} href="/farmer#bookings" className="block rounded-xl px-3 py-2 text-left hover:bg-green-50">My Bookings</Link>
                  <Link onClick={() => setProfileOpen(false)} href="/farmer#notifications" className="block rounded-xl px-3 py-2 text-left hover:bg-green-50">Notifications</Link>
                  <Link onClick={() => setProfileOpen(false)} href="/farmer#help" className="block rounded-xl px-3 py-2 text-left hover:bg-green-50">Help</Link>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      void logout();
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left text-red-700 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button
              className="grid h-11 w-11 place-items-center rounded-full bg-green-800 text-white lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Open menu"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="grid gap-2 border-t border-green-900/10 bg-white px-4 py-4 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {state.centre.status === "delayed" && (
        <div className="bg-amber-100 px-4 py-3 text-center text-sm font-bold text-amber-900">
          {state.centre.delayMessage ||
            "Procurement centre is experiencing a delay."}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {screen === "dashboard" && <FarmerDashboard booking={booking} />}
        {screen === "book" && <BookingFlow />}
        {screen === "queue" && <LiveQueue booking={booking} />}
        {screen === "status" && <ProcurementStatus booking={booking} />}
        {screen === "payment" && <PaymentStatusView />}
        {screen === "schemes" && <SchemesList />}
        {screen === "scheme-detail" && <SchemeDetail schemeId={schemeId} />}
      </div>

      <Link
        href="/farmer/book"
        className="fixed bottom-4 left-4 right-4 z-30 rounded-2xl bg-[#1e6b3b] px-5 py-4 text-center text-base font-black text-white shadow-2xl shadow-green-900/30 sm:hidden"
      >
        Book Procurement Slot
      </Link>
    </main>
  );
}

function FarmerDashboard({
  booking,
}: {
  booking?: Booking;
}) {
  const { state } = usePrototype();
  const noBooking = state.bookings.length === 0;
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-[2rem] bg-[#1d693b] p-6 text-white shadow-xl shadow-green-900/20 sm:p-8">
          <p className="text-sm font-bold text-lime-100">
            Digital Procurement & Queue Management
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Namaste, {state.farmerProfile.name.split(" ")[0]}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/85">
            Manage your procurement booking, queue and payment status from one
            place.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/farmer/book"
              className="rounded-2xl bg-white px-5 py-3 text-base font-black text-green-900 shadow-lg"
            >
              Book New Slot
            </Link>
            <Link
              href="/farmer/queue"
              className="rounded-2xl border border-white/35 px-5 py-3 text-base font-black text-white"
            >
              View Live Queue
            </Link>
          </div>
        </div>
        <UpcomingBookingCard booking={booking} noBooking={noBooking} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          icon={CalendarDays}
          title="Upcoming Slot"
          value={noBooking ? "No slot" : "18 Sept, 10:00 AM"}
          note={noBooking ? "Book a slot" : "Confirmed"}
          tone="green"
          href="/farmer/book"
        />
        <StatusCard
          icon={UsersRound}
          title="Queue Position"
          value={
            booking?.bookingStatus === "called"
              ? "Your turn"
              : booking
                ? `#${booking.queuePosition}`
                : "No queue position"
          }
          note={
            booking?.bookingStatus === "called"
              ? "Proceed to Counter 2"
              : booking
                ? `${booking.queueAhead} farmers ahead`
                : "Book a slot to join the queue"
          }
          tone="blue"
          href="/farmer/queue"
        />
        <StatusCard
          icon={Wheat}
          title="Procurement Status"
          value={booking ? statusLabel(booking.procurementStatus) : "No booking"}
          note="Track every step"
          tone="amber"
          href="/farmer/status"
        />
        <StatusCard
          icon={Banknote}
          title="Payment Status"
          value={booking ? paymentLabel(booking.paymentStatus) : "No payment"}
          note={booking ? `Rs. ${booking.amount.toLocaleString("en-IN")}` : "No booking"}
          tone="violet"
          href="/farmer/payment"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div
          id="bookings"
          className="rounded-[1.5rem] border border-green-900/10 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black">My Procurement Bookings</h2>
            <Link
              href="/farmer/book"
              className="hidden rounded-full bg-green-50 px-4 py-2 text-sm font-black text-green-800 sm:inline-flex"
            >
              View All Bookings
            </Link>
          </div>
          <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
            {state.bookings.map((item) => (
              <BookingCard key={item.id} booking={item} onView={() => setSelectedBooking(item)} />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-green-900/10 bg-white p-5 shadow-sm">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-green-100 text-green-800">
              <Tractor className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-2xl font-black">
              Book a Procurement Slot
            </h2>
            <p className="mt-2 text-base leading-relaxed text-green-950/70">
              Avoid long queues. Choose a date and time before visiting the
              procurement centre.
            </p>
            <Link
              href="/farmer/book"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1e6b3b] px-5 font-black text-white"
            >
              Book New Slot <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <NotificationsPreview />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <SchemesPreview />
        <div
          id="help"
          className="rounded-[1.5rem] border border-blue-900/10 bg-blue-50 p-5"
        >
          <HelpCircle className="h-8 w-8 text-blue-700" />
          <h2 className="mt-3 text-xl font-black text-blue-950">Need help?</h2>
          <p className="mt-2 text-sm leading-relaxed text-blue-950/70">
            Visit the procurement centre help desk or call the farmer support
            helpline for booking, queue, payment, or scheme support.
          </p>
          <button className="mt-4 rounded-xl bg-blue-700 px-4 py-3 text-sm font-black text-white">
            Call Help Desk
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <EmptyState
          title="No Upcoming Booking"
          message="You do not have another upcoming procurement slot after this booking."
          action="Book a Slot"
        />
        <EmptyState
          title="Payment Pending"
          message="Your payment is being processed. No action is needed from your side."
          action="Track Payment"
        />
      </section>

      {selectedBooking && (
        <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  );
}

function UpcomingBookingCard({
  booking,
  noBooking,
}: {
  booking?: Booking;
  noBooking: boolean;
}) {
  if (noBooking || !booking) {
    return (
      <div className="rounded-[2rem] border border-dashed border-green-900/20 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black">No Upcoming Booking</h2>
        <p className="mt-2 text-green-950/70">
          You do not have an upcoming procurement slot.
        </p>
        <Link
          href="/farmer/book"
          className="mt-5 inline-flex rounded-2xl bg-green-700 px-5 py-3 font-black text-white"
        >
          Book a Slot
        </Link>
      </div>
    );
  }
  return (
    <div className="rounded-[2rem] border border-green-900/10 bg-white p-6 shadow-sm">
      <p className="text-sm font-black uppercase tracking-wide text-green-700">
        Upcoming Procurement
      </p>
      <h2 className="mt-3 text-3xl font-black">{booking.crop} Procurement</h2>
      <div className="mt-5 grid gap-3 text-base font-semibold text-green-950/75">
        <InfoLine icon={MapPin} text={booking.centre} />
        <InfoLine icon={CalendarDays} text={booking.date} />
        <InfoLine icon={Clock3} text={booking.time} />
        <InfoLine icon={FileText} text={`Booking ID: ${booking.id}`} />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-800">
          {booking.bookingStatus === "called" ? "Your Turn" : "Confirmed"}
        </span>
        <Link
          href="/farmer/status"
          className="rounded-2xl bg-green-800 px-5 py-3 font-black text-white"
        >
          View Booking
        </Link>
        <Link
          href="/farmer/book"
          className="rounded-2xl border border-green-900/15 px-5 py-3 font-black text-green-900"
        >
          Reschedule
        </Link>
      </div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  title,
  value,
  note,
  tone,
  href,
}: {
  icon: typeof CalendarDays;
  title: string;
  value: string;
  note: string;
  tone: "green" | "blue" | "amber" | "violet";
  href: string;
}) {
  const tones = {
    green: "bg-green-50 text-green-800",
    blue: "bg-blue-50 text-blue-800",
    amber: "bg-amber-50 text-amber-800",
    violet: "bg-violet-50 text-violet-800",
  };
  return (
    <Link
      href={href}
      className="rounded-[1.5rem] border border-green-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <span
        className={cn(
          "grid h-12 w-12 place-items-center rounded-2xl",
          tones[tone],
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-4 text-sm font-black text-green-950/60">{title}</p>
      <h3 className="mt-1 text-3xl font-black">{value}</h3>
      <p className="mt-2 text-sm font-bold text-green-700">{note}</p>
    </Link>
  );
}

function BookingCard({
  booking,
  onView,
}: {
  booking?: Booking;
  onView?: () => void;
}) {
  if (!booking) {
    return <PageShell title="Live Procurement Queue" subtitle="Track your turn before visiting the procurement centre."><EmptyState title="No active booking" message="Book a procurement slot to see your live queue position." action="Book a Slot" /></PageShell>;
  }
  return (
    <article className="min-w-[280px] rounded-[1.25rem] border border-green-900/10 bg-[#fffdf6] p-5">
      <h3 className="text-xl font-black">{booking.crop} Procurement</h3>
      <p className="mt-1 text-sm font-bold text-green-950/60">
        Booking ID: {booking.id}
      </p>
      <div className="mt-4 grid gap-2 text-sm font-semibold text-green-950/70">
        <InfoLine icon={MapPin} text={booking.centre} />
        <InfoLine icon={CalendarDays} text={booking.date} />
        <InfoLine icon={Clock3} text={booking.time} />
      </div>
      <div className="mt-4 grid gap-2 text-sm">
        <BadgeText
          label="Queue"
          value={
            booking.bookingStatus === "called"
              ? "Your turn"
              : `#${booking.queuePosition}`
          }
        />
        <BadgeText
          label="Procurement"
          value={statusLabel(booking.procurementStatus)}
        />
        <BadgeText
          label="Payment"
          value={paymentLabel(booking.paymentStatus)}
        />
      </div>
      <button
        onClick={onView}
        className="mt-4 inline-flex items-center gap-2 text-sm font-black text-green-800"
      >
        View Details <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
}

function BookingDetailsModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const { state } = usePrototype();
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-green-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-green-700">Booking Details</p>
            <h2 className="mt-1 text-3xl font-black">{booking.id}</h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-green-50 text-green-900" aria-label="Close booking details">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ReviewCard title="Farmer Details" onEdit={onClose} items={[
            state.farmerProfile.name,
            `Farmer ID: ${state.farmerProfile.farmerId}`,
            `Mobile: ${state.farmerProfile.mobile}`,
          ]} />
          <ReviewCard title="Location" onEdit={onClose} items={[
            `State: ${booking.state || state.farmerProfile.state}`,
            `District: ${booking.district || state.farmerProfile.district}`,
            `Tehsil: ${booking.tehsil || "-"}`,
            `Village: ${booking.village || "-"}`,
          ]} />
          <ReviewCard title="Procurement" onEdit={onClose} items={[
            ...(booking.crops?.map((item) => `${item.name}: ${item.quantity} quintals`) || [`${booking.crop}: ${booking.quantity} quintals`]),
            `Total quantity: ${booking.quantity} quintals`,
            `Processing time: ${booking.processingMinutes || calculateProcessingMinutes(booking.quantity)} minutes`,
          ]} />
          <ReviewCard title="Booking" onEdit={onClose} items={[
            `Centre: ${booking.centre}`,
            `Date: ${booking.date}`,
            `Time: ${booking.time}`,
            `Queue position: #${booking.queuePosition}`,
            `Status: ${statusLabel(booking.procurementStatus)}`,
            `Payment: ${paymentLabel(booking.paymentStatus)}`,
          ]} />
        </div>
      </div>
    </div>
  );
}

function BookingFlow() {
  const { state, bookingOptions, confirmBooking } = usePrototype();
  const [step, setStep] = useState(0);
  const [stateName, setStateName] = useState(state.farmerProfile.state || "");
  const [district, setDistrict] = useState(state.farmerProfile.district || "");
  const [tehsil, setTehsil] = useState(state.farmerProfile.block || "");
  const [village, setVillage] = useState(state.farmerProfile.village || "");
  const [cropQuery, setCropQuery] = useState("");
  const [selectedCropIds, setSelectedCropIds] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [modalSlot, setModalSlot] = useState<Slot | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const crops = bookingOptions?.crops || [];
  const centre = bookingOptions?.centres[0];
  const locations = bookingOptions?.locations || [];
  const selectedState = locations.find((item) => item.state === stateName);
  const selectedDistrict = selectedState?.districts.find((item) => item.district === district);
  const selectedTehsil = selectedDistrict?.tehsils.find((item) => item.tehsil === tehsil);
  const selectedCrops = crops.filter((crop) => selectedCropIds.includes(crop.id));
  const totalQuantity = selectedCropIds.reduce((total, cropId) => total + (Number(quantities[cropId]) || 0), 0);
  const processingMinutes = calculateProcessingMinutes(totalQuantity || 0);
  const slotRows = state.slots.filter((slot) => !selectedDate || slot.date === selectedDate);
  const filteredCrops = crops.filter((crop) => crop.name.toLowerCase().includes(cropQuery.toLowerCase())).slice(0, 12);

  useEffect(() => {
    if (!stateName && locations[0]) setStateName(locations[0].state);
  }, [locations, stateName]);

  useEffect(() => {
    if (!selectedDate && state.slots[0]) setSelectedDate(state.slots[0].date);
  }, [selectedDate, state.slots]);

  const addCrop = (cropId: string) => {
    if (selectedCropIds.includes(cropId)) return;
    setSelectedCropIds((current) => [...current, cropId]);
    setQuantities((current) => ({ ...current, [cropId]: current[cropId] || 1 }));
    setSelectedSlot(null);
    setCropQuery("");
  };

  const removeCrop = (cropId: string) => {
    setSelectedCropIds((current) => current.filter((item) => item !== cropId));
    setSelectedSlot(null);
  };

  const canContinue = step === 0
    ? Boolean(stateName && district && tehsil && village)
    : step === 1
      ? Boolean(centre && selectedCropIds.length && totalQuantity > 0)
      : step === 2
        ? Boolean(selectedSlot)
        : accepted;

  if (confirmed) {
    return (
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 text-center shadow-xl sm:p-10">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-green-800"><Check className="h-10 w-10" /></span>
        <h1 className="mt-5 text-3xl font-black sm:text-4xl">Your Procurement Slot is Confirmed!</h1>
        <p className="mt-3 text-lg font-bold text-green-800">Booking ID: {bookingCode}</p>
        <div className="mx-auto mt-6 grid max-w-xl gap-3 rounded-2xl bg-green-50 p-5 text-left text-base font-semibold">
          <InfoLine icon={Wheat} text={selectedCrops.map((crop) => `${crop.name} (${quantities[crop.id]} q)`).join(", ")} />
          <InfoLine icon={MapPin} text={`${centre?.name || ""}, ${village}, ${district}`} />
          <InfoLine icon={CalendarDays} text={selectedSlot?.date || ""} />
          <InfoLine icon={Clock3} text={selectedSlot?.label || ""} />
          <InfoLine icon={UsersRound} text={`Estimated processing time: ${processingMinutes} minutes`} />
        </div>
        <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-lg font-black text-amber-900">Please arrive 10-15 minutes before your slot.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/farmer/queue" className="rounded-2xl bg-green-800 px-5 py-3 font-black text-white">View Live Queue</Link>
          <Link href="/farmer/status" className="rounded-2xl border border-green-900/15 px-5 py-3 font-black">View Booking</Link>
          <Link href="/farmer" className="rounded-2xl border border-green-900/15 px-5 py-3 font-black">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-20 sm:pb-0">
      <Link href="/farmer" className="inline-flex items-center gap-2 text-sm font-black text-green-800"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Link>
      <div className="rounded-[2rem] border border-green-900/10 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          {steps.map((label, index) => (
            <div key={label} className={cn("rounded-2xl px-4 py-3 text-sm font-black", index <= step ? "bg-green-700 text-white" : "bg-green-50 text-green-900/60")}>{index + 1}. {label}</div>
          ))}
        </div>
      </div>

      <section className="rounded-[2rem] border border-green-900/10 bg-white p-5 shadow-sm sm:p-7">
        {step === 0 && (
          <div>
            <h1 className="text-3xl font-black">Farmer Information</h1>
            <p className="mt-2 text-green-950/70">Farmer identity is loaded from your authenticated profile and cannot be edited here.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[["Full Name", state.farmerProfile.name], ["Mobile Number", state.farmerProfile.mobile], ["Farmer ID / Registration Number", state.farmerProfile.farmerId]].map(([label, value]) => (
                <label key={label} className="grid gap-2 text-sm font-black text-green-950/70">{label}<input readOnly disabled value={value} className="min-h-12 rounded-2xl border border-green-900/15 bg-green-50 px-4 text-base font-bold text-green-950 opacity-100" /></label>
              ))}
            </div>
            <h2 className="mt-7 text-xl font-black">Location</h2>
            <div className="mt-3 grid gap-4 md:grid-cols-4">
              <SelectField label="State" value={stateName} onChange={(value) => { setStateName(value); setDistrict(""); setTehsil(""); setVillage(""); }} options={locations.map((item) => item.state)} />
              <SelectField label="District" value={district} disabled={!stateName} onChange={(value) => { setDistrict(value); setTehsil(""); setVillage(""); }} options={selectedState?.districts.map((item) => item.district) || []} />
              <SelectField label="Tehsil" value={tehsil} disabled={!district} onChange={(value) => { setTehsil(value); setVillage(""); }} options={selectedDistrict?.tehsils.map((item) => item.tehsil) || []} />
              <SelectField label="Village" value={village} disabled={!tehsil} onChange={setVillage} options={selectedTehsil?.villages || []} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-3xl font-black">Procurement Details</h1>
            <p className="mt-2 text-green-950/70">Search and select one or more crops. Add quantity separately for every crop.</p>
            <label className="relative mt-6 block">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-800/50" />
              <input value={cropQuery} onChange={(event) => setCropQuery(event.target.value)} placeholder="Search crops like Wheat, Mustard, Maize..." className="min-h-12 w-full rounded-2xl border border-green-900/15 bg-white pl-12 pr-4 text-base font-bold outline-none focus:ring-2 focus:ring-green-500" />
            </label>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCrops.map((crop) => (
                <button key={crop.id} type="button" disabled={selectedCropIds.includes(crop.id)} onClick={() => addCrop(crop.id)} className="rounded-2xl border border-green-900/10 bg-green-50 p-3 text-left text-sm font-black disabled:opacity-45">
                  {crop.name}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-3">
              {selectedCrops.map((crop) => (
                <div key={crop.id} className="grid gap-3 rounded-2xl border border-green-900/10 bg-white p-4 md:grid-cols-[1fr_180px_auto] md:items-end">
                  <p className="text-lg font-black">{crop.name}</p>
                  <label className="grid gap-1 text-sm font-black text-green-950/70">Quantity (quintals)<input type="number" min={0.01} step="0.01" value={quantities[crop.id] || ""} onChange={(event) => { setQuantities((current) => ({ ...current, [crop.id]: Number(event.target.value) })); setSelectedSlot(null); }} className="min-h-11 rounded-xl border border-green-900/15 px-3 font-bold" /></label>
                  <button onClick={() => removeCrop(crop.id)} className="rounded-xl bg-red-50 px-3 py-3 font-black text-red-700">Remove</button>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 rounded-2xl bg-green-50 p-5 sm:grid-cols-3">
              <BadgeText label="Total Quantity" value={`${totalQuantity.toFixed(2)} quintals`} />
              <BadgeText label="Processing Time" value={`${processingMinutes} minutes`} />
              <BadgeText label="Formula" value="(30 + qty x 4) x 1.05" />
            </div>
            <h2 className="mt-6 text-xl font-black">Procurement Centre</h2>
            <div className="mt-3 rounded-2xl border-2 border-green-700 bg-green-50 p-5">
              <h3 className="text-xl font-black">{centre?.name || state.centre.name}</h3>
              <p className="mt-2 text-sm font-semibold text-green-950/70">{centre?.address || state.centre.location}</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-3xl font-black">Choose Your Procurement Slot</h1>
            <p className="mt-2 text-green-950/70">Available slots are filtered by date and revalidated by the backend before booking.</p>
            <label className="mt-6 grid max-w-sm gap-2 text-sm font-black text-green-950/70">Booking Date<select value={selectedDate} onChange={(event) => { setSelectedDate(event.target.value); setSelectedSlot(null); }} className="min-h-12 rounded-2xl border border-green-900/15 px-4 font-bold"><option value="">Select date</option>{[...new Set(state.slots.map((slot) => slot.date))].map((date) => <option key={date} value={date}>{date}</option>)}</select></label>
            <div className="mt-5 grid gap-3">
              {slotRows.length === 0 && <EmptyState title="No slots available" message="No valid slots are available for this date. Please choose another date." action="Choose another date" />}
              {slotRows.map((slot) => (
                <button key={slot.id} disabled={slot.status === "full" || slot.status === "closed"} onClick={() => setModalSlot(slot)} className={cn("flex min-h-20 items-center justify-between rounded-2xl border p-4 text-left transition", slot.id === selectedSlot?.id ? "border-green-700 bg-green-50" : "border-green-900/10 bg-white", (slot.status === "full" || slot.status === "closed") && "opacity-60")}>
                  <span><strong className="block text-lg">{slot.label}</strong><span className="mt-1 block text-sm font-black">{slot.status === "full" ? "Full" : slot.status === "closed" ? "Centre closed" : `${slot.available} slots available`}</span></span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-3xl font-black">Review Your Booking</h1>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <ReviewCard title="Farmer" onEdit={() => setStep(0)} items={[state.farmerProfile.name, `Farmer ID: ${state.farmerProfile.farmerId}`, `Mobile: ${state.farmerProfile.mobile}`]} />
              <ReviewCard title="Location" onEdit={() => setStep(0)} items={[`State: ${stateName}`, `District: ${district}`, `Tehsil: ${tehsil}`, `Village: ${village}`]} />
              <ReviewCard title="Procurement" onEdit={() => setStep(1)} items={[...selectedCrops.map((crop) => `${crop.name}: ${quantities[crop.id]} quintals`), `Total quantity: ${totalQuantity.toFixed(2)} quintals`, `Processing time: ${processingMinutes} minutes`, `Centre: ${centre?.name || state.centre.name}`]} />
              <ReviewCard title="Appointment" onEdit={() => setStep(2)} items={[`Date: ${selectedSlot?.date || "Not selected"}`, `Time: ${selectedSlot?.label || "Not selected"}`]} />
            </div>
            {submitError && <p className="mt-5 rounded-2xl bg-red-50 p-4 font-bold text-red-800">{submitError}</p>}
            <label className="mt-6 flex items-start gap-3 rounded-2xl bg-green-50 p-4 text-base font-bold"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-5 w-5" />I confirm that the information provided is correct.</label>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <button disabled={step === 0 || submitting} onClick={() => setStep((current) => Math.max(0, current - 1))} className="rounded-2xl border border-green-900/15 px-5 py-3 font-black disabled:opacity-40">Back</button>
          {step < 3 ? (
            <button disabled={!canContinue} onClick={() => setStep((current) => Math.min(3, current + 1))} className="rounded-2xl bg-green-800 px-5 py-3 font-black text-white disabled:opacity-40">Continue</button>
          ) : (
            <button disabled={!canContinue || submitting} onClick={() => {
              if (!centre || !selectedSlot) return;
              setSubmitting(true);
              setSubmitError("");
              void confirmBooking({ centreId: centre.id, slotId: selectedSlot.id, state: stateName, district, tehsil, village, crops: selectedCropIds.map((cropId) => ({ cropId, quantity: Number(quantities[cropId]) })) })
                .then((code) => { if (code) { setBookingCode(code); setConfirmed(true); } })
                .catch((error) => setSubmitError(error instanceof Error ? error.message : "Unable to confirm booking."))
                .finally(() => setSubmitting(false));
            }} className="rounded-2xl bg-green-800 px-5 py-3 font-black text-white disabled:opacity-40">{submitting ? "Confirming booking..." : "Confirm Procurement Slot"}</button>
          )}
        </div>
      </section>

      {modalSlot && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-green-950/50 p-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
            <h2 className="text-3xl font-black">Confirm Your Slot</h2>
            <div className="mt-5 grid gap-3 text-base font-semibold">
              <InfoLine icon={Wheat} text={`Total quantity: ${totalQuantity.toFixed(2)} quintals`} />
              <InfoLine icon={MapPin} text={`Procurement Centre: ${centre?.name || state.centre.name}`} />
              <InfoLine icon={CalendarDays} text={`Date: ${modalSlot.date}`} />
              <InfoLine icon={Clock3} text={`Time: ${modalSlot.label}`} />
              <InfoLine icon={UsersRound} text={`Estimated processing: ${processingMinutes} minutes`} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => { setSelectedSlot(modalSlot); setModalSlot(null); setStep(3); }} className="rounded-2xl bg-green-800 px-5 py-3 font-black text-white">Confirm Slot</button>
              <button onClick={() => setModalSlot(null)} className="rounded-2xl border border-green-900/15 px-5 py-3 font-black">Choose Another Slot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LiveQueue({
  booking,
}: {
  booking?: Booking;
}) {
  if (!booking) {
    return <PageShell title="Procurement Status" subtitle="Simple step-by-step tracking from booking to payment."><EmptyState title="No procurement status yet" message="Your status will appear after you book a procurement slot." action="Book a Slot" /></PageShell>;
  }
  const { state } = usePrototype();
  const [notify, setNotify] = useState(true);
  return (
    <PageShell
      title="Live Procurement Queue"
      subtitle="Track your turn before visiting the procurement centre."
    >
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <div className="rounded-[2rem] bg-green-800 p-7 text-white">
          <p className="text-sm font-bold text-green-100">
            Your Queue Position
          </p>
          <h2 className="mt-3 text-7xl font-black">
            {booking.bookingStatus === "called"
              ? "Now"
              : `#${booking.queuePosition}`}
          </h2>
          <p className="mt-3 text-xl font-bold">
            {booking.bookingStatus === "called"
              ? "It is your turn"
              : `${booking.queueAhead} farmers ahead of you`}
          </p>
          <p className="mt-5 rounded-2xl bg-white/12 p-4 text-lg font-black">
            Estimated waiting time: {booking.estimatedWait}
          </p>
        </div>
        <div className="rounded-[2rem] border border-green-900/10 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Current Status</h2>
          <p className="mt-3 rounded-2xl bg-green-50 p-4 font-bold text-green-800">
            Procurement centre is operating normally.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <BadgeText
              label="Currently serving token"
              value={state.currentlyServing}
            />
            <BadgeText label="Your token" value="#PROC10234" />
            <BadgeText
              label="Estimated turn"
              value={booking.bookingStatus === "called" ? "Now" : "10:35 AM"}
            />
          </div>
          <label className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-green-900/10 p-4 font-black">
            <span className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-green-700" /> Notify me when my turn
              is approaching
            </span>
            <input
              type="checkbox"
              checked={notify}
              onChange={(event) => setNotify(event.target.checked)}
              className="h-5 w-5"
            />
          </label>
        </div>
      </div>
      <div className="rounded-[2rem] border border-green-900/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black">Queue Progress</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {["Completed", "Currently Serving", "You", "Waiting Farmers"].map(
            (item, index) => (
              <div
                key={item}
                className={cn(
                  "rounded-2xl p-5 text-center font-black",
                  index < 2
                    ? "bg-green-50 text-green-800"
                    : index === 2
                      ? "bg-amber-100 text-amber-900"
                      : "bg-slate-50 text-slate-700",
                )}
              >
                {item}
              </div>
            ),
          )}
        </div>
      </div>
    </PageShell>
  );
}

function ProcurementStatus({
  booking,
}: {
  booking: NonNullable<
    ReturnType<typeof usePrototype>["state"]["bookings"][number]
  >;
}) {
  const timeline = useMemo(() => {
    const active = booking.procurementStatus;
    const order = ["slot-confirmed", "arrived", "weighing", "completed"];
    const activeIndex = order.indexOf(active);
    return [
      [
        "Registration",
        "12 Sep, 09:15 AM",
        "Your farmer profile is registered.",
      ],
      [
        "Slot Confirmed",
        "15 Sep, 10:00 AM",
        "Your procurement slot is confirmed.",
      ],
      [
        "Farmer Arrived",
        booking.bookingStatus === "confirmed" ? "Pending" : "18 Sep, 09:48 AM",
        "Arrival at centre is recorded.",
      ],
      [
        "Weighing",
        booking.procurementStatus === "weighing"
          ? "Now"
          : booking.procurementStatus === "completed"
            ? "18 Sep, 10:32 AM"
            : "Pending",
        "Your produce is being weighed.",
      ],
      [
        "Procurement Complete",
        booking.procurementStatus === "completed"
          ? "18 Sep, 10:48 AM"
          : "Pending",
        "Procurement record is completed.",
      ],
      [
        "Payment Processing",
        booking.paymentStatus !== "pending" ? "18 Sep, 11:00 AM" : "Pending",
        "Payment file is under process.",
      ],
      [
        "Payment Received",
        booking.paymentStatus === "received" ? "20 Sep, 02:10 PM" : "Pending",
        "Payment credited to bank account.",
      ],
    ].map((item, index) => ({
      label: item[0],
      time: item[1],
      description: item[2],
      state:
        index <= activeIndex + 1
          ? "done"
          : index === activeIndex + 2
            ? "active"
            : "upcoming",
    }));
  }, [booking]);

  return (
    <PageShell
      title="Procurement Status"
      subtitle="Simple step-by-step tracking from booking to payment."
    >
      <div className="rounded-[2rem] border border-green-900/10 bg-white p-6 shadow-sm">
        <div className="grid gap-4">
          {timeline.map((item) => (
            <div
              key={item.label}
              className="grid gap-4 rounded-2xl border border-green-900/10 p-4 sm:grid-cols-[52px_1fr]"
            >
              <span
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-full",
                  item.state === "done" && "bg-green-100 text-green-800",
                  item.state === "active" && "bg-blue-100 text-blue-800",
                  item.state === "upcoming" && "bg-slate-100 text-slate-500",
                )}
              >
                {item.state === "done" ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <Clock3 className="h-6 w-6" />
                )}
              </span>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-black">{item.label}</h2>
                  <span className="text-sm font-bold text-green-950/60">
                    {item.time}
                  </span>
                </div>
                <p className="mt-1 text-green-950/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function PaymentStatusView() {
  const { state } = usePrototype();
  const booking = state.bookings[0];
  if (!booking) {
    return <PageShell title="Payment Status" subtitle="Understand your payment without financial jargon."><EmptyState title="No payment record" message="Payment details will appear after procurement is completed." action="View Procurement" /></PageShell>;
  }
  return (
    <PageShell
      title="Payment Status"
      subtitle="Understand your payment without financial jargon."
    >
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <div className="rounded-[2rem] bg-amber-100 p-7 text-amber-950">
          <p className="text-sm font-black uppercase">Payment Amount</p>
          <h2 className="mt-3 text-5xl font-black">
            Rs. {booking.amount.toLocaleString("en-IN")}
          </h2>
          <p className="mt-4 rounded-2xl bg-white/70 p-4 text-xl font-black">
            {paymentLabel(state.payment.status)}
          </p>
        </div>
        <div className="rounded-[2rem] border border-green-900/10 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <BadgeText
              label="Procurement amount"
              value={`Rs. ${booking.amount.toLocaleString("en-IN")}`}
            />
            <BadgeText label="Bank" value={state.payment.bank} />
            <BadgeText
              label="Transaction status"
              value={paymentLabel(state.payment.status)}
            />
            <BadgeText
              label="Expected payment"
              value={
                state.payment.status === "received"
                  ? state.payment.receivedDate || "Received"
                  : state.payment.expected
              }
            />
            <BadgeText
              label="Transaction ID"
              value={state.payment.transactionId}
            />
          </div>
          <p className="mt-5 rounded-2xl bg-green-50 p-4 font-bold text-green-800">
            {state.payment.status === "received"
              ? "Payment Received. The amount has been credited to your registered bank account."
              : "Your payment is being processed. No action is needed."}
          </p>
        </div>
      </div>
    </PageShell>
  );
}

function SchemesPreview() {
  const { state } = usePrototype();
  return (
    <div className="rounded-[1.5rem] border border-green-900/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">Government Schemes & Benefits</h2>
          <p className="mt-1 text-green-950/65">
            Explore schemes and benefits available for farmers.
          </p>
        </div>
        <Link
          href="/farmer/schemes"
          className="hidden rounded-full bg-green-50 px-4 py-2 text-sm font-black text-green-800 sm:inline-flex"
        >
          View All
        </Link>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {state.schemes.slice(0, 4).map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </div>
    </div>
  );
}

function SchemesList() {
  const { state } = usePrototype();
  return (
    <PageShell
      title="Government Schemes & Benefits"
      subtitle="Readable scheme information for farmers."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {state.schemes.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </div>
    </PageShell>
  );
}

function SchemeDetail({ schemeId }: { schemeId?: string }) {
  const { state, addNotification } = usePrototype();
  const scheme =
    state.schemes.find((item) => item.id === schemeId) || state.schemes[0];
  return (
    <PageShell
      title={scheme.name}
      subtitle={scheme.summary}
      backHref="/farmer/schemes"
    >
      <div className="rounded-[2rem] border border-green-900/10 bg-white p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <SchemeSection title="About the Scheme" body={scheme.about} />
            <SchemeSection title="Who is Eligible?" body={scheme.eligibility} />
            <SchemeSection title="Key Benefits" items={scheme.benefits} />
            <SchemeSection
              title="Documents Required"
              items={scheme.documents}
            />
            <SchemeSection title="How to Apply" body={scheme.apply} />
            <SchemeSection title="Important Dates" body={scheme.dates} />
          </div>
          <aside className="rounded-2xl bg-green-50 p-5">
            <Landmark className="h-9 w-9 text-green-800" />
            <p className="mt-4 text-sm font-black uppercase text-green-800">
              Eligibility
            </p>
            <p className="mt-1 text-2xl font-black">
              {scheme.eligible ? "Likely eligible" : "Check with office"}
            </p>
            <div className="mt-5 grid gap-3">
              <button
                onClick={() =>
                  addNotification(
                    "Eligibility checked",
                    `${scheme.name} eligibility check is saved for demo.`,
                    "info",
                  )
                }
                className="rounded-2xl bg-green-800 px-5 py-3 font-black text-white"
              >
                Check Eligibility
              </button>
              <button
                onClick={() =>
                  addNotification(
                    "Application started",
                    `${scheme.name} application flow is ready for backend connection.`,
                    "success",
                  )
                }
                className="rounded-2xl border border-green-900/15 bg-white px-5 py-3 font-black"
              >
                Apply Now
              </button>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

function SchemeCard({ scheme }: { scheme: Scheme }) {
  return (
    <Link
      href={`/farmer/schemes/${scheme.id}`}
      className="rounded-2xl border border-green-900/10 bg-[#fffdf6] p-5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-green-100 text-green-800">
        <Landmark className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-xl font-black">{scheme.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-green-950/70">
        {scheme.summary}
      </p>
      <p
        className={cn(
          "mt-4 inline-flex rounded-full px-3 py-1 text-xs font-black",
          scheme.eligible
            ? "bg-green-100 text-green-800"
            : "bg-amber-100 text-amber-800",
        )}
      >
        {scheme.eligible ? "Eligible" : "Check eligibility"}
      </p>
      <span className="mt-4 flex items-center gap-2 text-sm font-black text-green-800">
        View Details <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

function NotificationsPreview() {
  const { state } = usePrototype();
  return (
    <div className="rounded-[1.5rem] border border-green-900/10 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black">Notifications</h2>
      <div className="mt-4 grid gap-3">
        {state.notifications.slice(0, 4).map((item) => (
          <div key={item.id} className="rounded-2xl bg-green-50 p-4">
            <p className="font-black">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-green-950/70">
              {item.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-green-900/20 bg-white p-5">
      <CircleAlert className="h-8 w-8 text-amber-700" />
      <h3 className="mt-3 text-xl font-black">{title}</h3>
      <p className="mt-2 text-green-950/70">{message}</p>
      <button className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-black text-green-800">
        {action}
      </button>
    </div>
  );
}

function PageShell({
  title,
  subtitle,
  children,
  backHref = "/farmer",
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backHref?: string;
}) {
  return (
    <div className="space-y-5 pb-20 sm:pb-0">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-black text-green-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div>
        <h1 className="text-4xl font-black tracking-tight">{title}</h1>
        <p className="mt-2 text-lg text-green-950/70">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function InfoLine({ icon: Icon, text }: { icon: typeof MapPin; text: string }) {
  return (
    <span className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-green-700" />
      <span>{text}</span>
    </span>
  );
}

function BadgeText({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-green-900/10">
      <p className="text-xs font-black uppercase text-green-950/50">{label}</p>
      <p className="mt-1 text-base font-black text-green-950">{value}</p>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-black text-green-950/70">
      {label}
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-2xl border border-green-900/15 bg-white px-4 text-base font-bold text-green-950 outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-50 disabled:text-green-950/45"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReviewCard({
  title,
  items,
  onEdit,
}: {
  title: string;
  items: string[];
  onEdit?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-green-900/10 bg-green-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black">{title}</h2>
        {onEdit && (
          <button onClick={onEdit} className="text-sm font-black text-green-800">
            Edit
          </button>
        )}
      </div>
      <div className="mt-4 grid gap-2 text-sm font-bold text-green-950/75">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}

function SchemeSection({
  title,
  body,
  items,
}: {
  title: string;
  body?: string;
  items?: string[];
}) {
  return (
    <section>
      <h2 className="text-2xl font-black">{title}</h2>
      {body && (
        <p className="mt-2 text-lg leading-relaxed text-green-950/75">{body}</p>
      )}
      {items && (
        <ul className="mt-3 grid gap-2 text-lg font-semibold text-green-950/75">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <Check className="mt-1 h-5 w-5 shrink-0 text-green-700" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function statusLabel(status: string) {
  if (status === "slot-confirmed") return "Slot Confirmed";
  if (status === "arrived") return "Farmer Arrived";
  if (status === "weighing") return "Weighing Pending";
  return "Completed";
}

function paymentLabel(status: string) {
  if (status === "received") return "Payment Received";
  if (status === "pending") return "Pending";
  return "Processing";
}
