"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Bell,
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock3,
  CreditCard,
  Home,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  QrCode,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Tractor,
  UserCheck,
  UsersRound,
  Wheat,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PrototypeProvider, usePrototype } from "./prototype-store";
import { cn } from "../ui/cn";
import { demoBookingId } from "../../lib/prototype-data";

type OperatorScreen = "dashboard" | "check-in" | "queue" | "process" | "payments" | "slots" | "notifications";

const navItems = [
  { href: "/operator", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/operator/queue", label: "Live Queue", icon: UsersRound, group: "Queue" },
  { href: "/operator/check-in", label: "Farmer Check-In", icon: UserCheck, group: "Farmers" },
  { href: "/operator/process", label: "Procurement Processing", icon: Wheat, group: "Procurement" },
  { href: "/operator/payments", label: "Payment Status", icon: CreditCard, group: "Payments" },
  { href: "/operator/slots", label: "Slot Management", icon: CalendarDays, group: "Slots" },
  { href: "/operator/notifications", label: "Notifications", icon: Bell, group: "Notifications" },
];

export function OperatorApp({ screen }: { screen: OperatorScreen }) {
  return (
    <PrototypeProvider>
      <OperatorShell screen={screen} />
    </PrototypeProvider>
  );
}

function OperatorShell({ screen }: { screen: OperatorScreen }) {
  const { state, resetDemo } = usePrototype();
  const [signedIn, setSignedIn] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!signedIn) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 p-4 text-slate-950">
        <section className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-xl">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-700 text-white"><ShieldCheck className="h-7 w-7" /></span>
          <h1 className="mt-5 text-3xl font-black">Procurement Centre Operator</h1>
          <p className="mt-2 text-slate-600">Sign in to manage appointments, queue, weighing, and payment updates.</p>
          <div className="mt-6 grid gap-3">
            <input className="min-h-12 rounded-2xl border border-slate-200 px-4 font-bold" defaultValue="OP-MEERUT-01" aria-label="Operator ID" />
            <input className="min-h-12 rounded-2xl border border-slate-200 px-4 font-bold" defaultValue="MEERUT-C01" aria-label="Centre Code" />
            <input className="min-h-12 rounded-2xl border border-slate-200 px-4 font-bold" defaultValue="password" type="password" aria-label="Password" />
            <button onClick={() => setSignedIn(true)} className="min-h-12 rounded-2xl bg-blue-700 font-black text-white">Sign In</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef3f8] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-[#10233f] p-4 text-white lg:block">
        <Link href="/" className="flex items-center gap-3 rounded-2xl bg-white/8 p-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500"><Tractor className="h-6 w-6" /></span>
          <span>
            <strong className="block">Centre Operator</strong>
            <span className="text-xs text-white/65">Government Procurement</span>
          </span>
        </Link>
        <nav className="mt-6 grid gap-2">
          {navItems.map((item) => <OperatorNavItem key={item.href} item={item} active={activeFor(screen, item.href)} />)}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/8 p-4">
          <p className="font-black">Rajiv Sharma</p>
          <p className="text-sm text-white/65">Centre Operator</p>
          <button onClick={() => setSignedIn(false)} className="mt-4 flex items-center gap-2 text-sm font-black text-white/80"><LogOut className="h-4 w-4" /> Logout</button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:ml-72">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-blue-700">Meerut Procurement Centre</p>
            <h1 className="text-xl font-black">Good Morning, Operator</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("hidden rounded-full px-3 py-2 text-sm font-black sm:inline-flex", state.centre.status === "open" ? "bg-green-100 text-green-800" : state.centre.status === "delayed" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800")}>
              Centre {state.centre.status.toUpperCase()}
            </span>
            <button onClick={resetDemo} className="hidden rounded-full border border-slate-200 px-3 py-2 text-sm font-black sm:inline-flex">Reset Demo</button>
            <button onClick={() => setMenuOpen((open) => !open)} className="grid h-11 w-11 place-items-center rounded-full bg-slate-900 text-white lg:hidden" aria-label="Open menu">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mt-3 grid gap-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 font-black">
                  <Icon className="h-5 w-5 text-blue-700" /> {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <div className="p-4 pb-24 lg:ml-72 lg:p-6">
        {screen === "dashboard" && <OperatorDashboard />}
        {screen === "check-in" && <CheckInPage />}
        {screen === "queue" && <QueuePage />}
        {screen === "process" && <ProcessingPage />}
        {screen === "payments" && <PaymentsPage />}
        {screen === "slots" && <SlotsPage />}
        {screen === "notifications" && <NotificationsPage />}
      </div>
    </main>
  );
}

function OperatorDashboard() {
  const { state, updateCentreStatus } = usePrototype();
  const checkedIn = state.bookings.filter((item) => item.bookingStatus !== "confirmed").length + 55;
  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-blue-700">18 September 2026</p>
              <h2 className="mt-2 text-3xl font-black">{state.centre.name}</h2>
              <p className="mt-1 font-semibold text-slate-600">{state.centre.location}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => updateCentreStatus("open")} className="rounded-xl bg-green-100 px-4 py-3 text-sm font-black text-green-800">Open</button>
              <button onClick={() => updateCentreStatus("delayed", "Procurement is delayed by approximately 30 minutes.")} className="rounded-xl bg-amber-100 px-4 py-3 text-sm font-black text-amber-800">Delay 30m</button>
              <button onClick={() => updateCentreStatus("closed", "Procurement at this centre is currently closed.")} className="rounded-xl bg-red-100 px-4 py-3 text-sm font-black text-red-800">Close Centre</button>
            </div>
          </div>
        </div>
        <AttentionPanel />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <Kpi icon={CalendarDays} title="Today's Appointments" value="84" note="12 remaining" />
        <Kpi icon={UserCheck} title="Farmers Checked In" value={String(checkedIn)} note="66% of appointments" />
        <Kpi icon={UsersRound} title="Currently in Queue" value="18" note="Estimated wait 32 min" />
        <Kpi icon={ClipboardCheck} title="Completed" value="38" note="45% completed" />
        <Kpi icon={Wheat} title="Pending Weighing" value="7" note="Needs attention" />
        <Kpi icon={Banknote} title="Payments Pending" value="12" note="Rs. 4,82,500" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[380px_1fr_320px]">
        <CurrentlyServing />
        <LiveQueueTable compact />
        <UpNext />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <PerformancePanel />
        <RecentNotifications />
      </section>
    </div>
  );
}

function CheckInPage() {
  const { state, checkInFarmer } = usePrototype();
  const booking = state.bookings.find((item) => item.id === demoBookingId) || state.bookings[0];
  const [query, setQuery] = useState(demoBookingId);
  const [checked, setChecked] = useState(false);
  return (
    <OperatorPage title="Farmer Check-In" subtitle="Search booking, verify farmer, and add to today's queue.">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <label className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-12 w-full rounded-2xl border border-slate-200 pl-12 pr-4 font-bold" placeholder="Search Booking ID, Farmer ID, or Mobile Number" />
            </label>
            <button className="rounded-2xl border border-slate-200 px-5 py-3 font-black">Search Booking</button>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 font-black text-white"><QrCode className="h-5 w-5" /> Scan Booking QR</button>
          </div>

          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="font-black text-green-800">Valid Booking</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Detail label="Name" value={state.farmerProfile.name} />
              <Detail label="Farmer ID" value={state.farmerProfile.farmerId} />
              <Detail label="Mobile" value="XXXXXX1234" />
              <Detail label="Crop" value={booking.crop} />
              <Detail label="Expected Quantity" value={`${booking.quantity} Quintals`} />
              <Detail label="Booking" value={`18 September - ${booking.time}`} />
              <Detail label="Centre" value={booking.centre} />
            </div>
            <button
              onClick={() => {
                checkInFarmer();
                setChecked(true);
              }}
              className="mt-5 rounded-2xl bg-green-700 px-5 py-3 font-black text-white"
            >
              Check In Farmer
            </button>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Check-In Confirmation</h2>
          {checked || booking.bookingStatus !== "confirmed" ? (
            <div className="mt-5 rounded-2xl bg-green-50 p-5">
              <Check className="h-10 w-10 text-green-700" />
              <h3 className="mt-3 text-2xl font-black">Farmer Checked In Successfully</h3>
              <Detail label="Token" value="#10234" />
              <Detail label="Queue Position" value="12" />
              <Detail label="Estimated Waiting Time" value="25 minutes" />
              <button className="mt-4 rounded-xl bg-blue-700 px-4 py-3 font-black text-white">Add to Queue</button>
            </div>
          ) : (
            <p className="mt-4 text-slate-600">Confirmation appears here after check-in.</p>
          )}
        </section>
      </div>
    </OperatorPage>
  );
}

function QueuePage() {
  const { callFarmer, state } = usePrototype();
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? state.queue : state.queue.filter((item) => item.status === filter);
  return (
    <OperatorPage title="Queue Management" subtitle="Call, skip, mark no-show, and monitor today's queue.">
      <div className="grid gap-4 sm:grid-cols-5">
        <Kpi icon={CalendarDays} title="Total Bookings" value="84" note="Today" />
        <Kpi icon={UserCheck} title="Checked In" value="56" note="Arrived" />
        <Kpi icon={UsersRound} title="Waiting" value="18" note="In queue" />
        <Kpi icon={Wheat} title="Processing" value="7" note="At counters" />
        <Kpi icon={Check} title="Completed" value="25" note="Served" />
      </div>
      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {["All", "Waiting", "Processing", "Completed", "No Show"].map((item) => (
              <button key={item} onClick={() => setFilter(item)} className={cn("rounded-full px-4 py-2 text-sm font-black", filter === item ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-700")}>{item}</button>
            ))}
          </div>
          <button onClick={callFarmer} className="rounded-2xl bg-blue-700 px-5 py-3 font-black text-white">Call Next Farmer</button>
        </div>
        <LiveQueueTable rows={filtered} />
      </section>
    </OperatorPage>
  );
}

function ProcessingPage() {
  const { state, completeProcurement } = usePrototype();
  const [weight, setWeight] = useState(19.85);
  const [grade, setGrade] = useState("A");
  const [remarks, setRemarks] = useState("Quality accepted.");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const amount = Math.round(weight * 2275);
  return (
    <OperatorPage title="Procurement Processing" subtitle="Record weighing, quality grade, and procurement amount.">
      <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <Detail label="Farmer" value={state.farmerProfile.name} />
            <Detail label="Booking" value={demoBookingId} />
            <Detail label="Crop" value="Wheat" />
            <Detail label="Expected Quantity" value="25 Quintals" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-black text-slate-600">
              Actual Weight
              <input type="number" step="0.01" value={weight} onChange={(event) => setWeight(Number(event.target.value))} className="min-h-14 rounded-2xl border border-slate-200 px-4 text-xl font-black" />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-600">
              Quality / Grade
              <select value={grade} onChange={(event) => setGrade(event.target.value)} className="min-h-14 rounded-2xl border border-slate-200 px-4 text-xl font-black">
                {["A", "B", "C", "Rejected"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-600 sm:col-span-2">
              Remarks
              <textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} className="min-h-28 rounded-2xl border border-slate-200 p-4 font-semibold" />
            </label>
          </div>
        </div>
        <aside className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-sm">
          <p className="font-black text-blue-200">Rate: Rs. 2,275 / Quintal</p>
          <p className="mt-5 text-sm font-black text-white/60">Estimated Amount</p>
          <h2 className="mt-2 text-5xl font-black">Rs. {amount.toLocaleString("en-IN")}</h2>
          <button onClick={() => setConfirmOpen(true)} className="mt-6 w-full rounded-2xl bg-green-500 px-5 py-4 font-black text-slate-950">Confirm Weighing</button>
        </aside>
      </section>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
            <h2 className="text-3xl font-black">Complete Procurement?</h2>
            <div className="mt-5 grid gap-3">
              <Detail label="Farmer" value={state.farmerProfile.name} />
              <Detail label="Crop" value="Wheat" />
              <Detail label="Actual Weight" value={`${weight} Quintals`} />
              <Detail label="Rate" value="Rs. 2,275 / Quintal" />
              <Detail label="Total Amount" value={`Rs. ${amount.toLocaleString("en-IN")}`} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  completeProcurement(weight, grade);
                  setConfirmOpen(false);
                }}
                className="rounded-2xl bg-green-700 px-5 py-3 font-black text-white"
              >
                Complete Procurement
              </button>
              <button onClick={() => setConfirmOpen(false)} className="rounded-2xl border border-slate-200 px-5 py-3 font-black">Go Back</button>
            </div>
          </div>
        </div>
      )}
    </OperatorPage>
  );
}

function PaymentsPage() {
  const { state, updatePayment } = usePrototype();
  const booking = state.bookings.find((item) => item.id === demoBookingId) || state.bookings[0];
  return (
    <OperatorPage title="Payment Management" subtitle="Track procurement value and payment status updates.">
      <section className="grid gap-4 sm:grid-cols-4">
        <Kpi icon={Banknote} title="Total Value" value="18.42L" note="Today" />
        <Kpi icon={Check} title="Processed" value="13.60L" note="Credited" />
        <Kpi icon={Clock3} title="Pending" value="4.82L" note="Processing" />
        <Kpi icon={AlertTriangle} title="Failed" value="0" note="No failures" />
      </section>
      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-blue-50 p-4">
          <div>
            <p className="text-sm font-black uppercase text-blue-700">Selected Booking</p>
            <p className="text-xl font-black">{state.farmerProfile.name} - {demoBookingId}</p>
            <p className="text-sm font-semibold text-slate-600">Current payment status: {paymentLabel(state.payment.status)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => updatePayment("processing")} className="rounded-xl bg-amber-100 px-4 py-3 font-black text-amber-800">Set Processing</button>
            <button type="button" onClick={() => updatePayment("received")} className="rounded-xl bg-green-600 px-4 py-3 font-black text-white">Mark Payment Received</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr><th className="py-3">Farmer</th><th>Booking</th><th>Amount</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-4 font-black">{state.farmerProfile.name}</td>
                <td>{demoBookingId}</td>
                <td>Rs. {booking.amount.toLocaleString("en-IN")}</td>
                <td><StatusBadge label={paymentLabel(state.payment.status)} /></td>
                <td className="flex gap-2 py-3">
                  <button type="button" onClick={() => updatePayment("processing")} className="rounded-xl bg-amber-100 px-3 py-2 font-black text-amber-800">Processing</button>
                  <button type="button" onClick={() => updatePayment("received")} className="rounded-xl bg-green-100 px-3 py-2 font-black text-green-800">Mark Received</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </OperatorPage>
  );
}

function SlotsPage() {
  const { state, updateSlotStatus } = usePrototype();
  return (
    <OperatorPage title="Slot Management" subtitle="Manage centre capacity and slot availability.">
      <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">18 September</h2>
          <div className="mt-5 grid gap-3">
            <Detail label="Centre Capacity" value={`${state.centre.capacity} farmers`} />
            <Detail label="Booked" value="84" />
            <Detail label="Remaining" value="16" />
            <Detail label="Counters" value={String(state.centre.counters)} />
          </div>
        </div>
        <div className="grid gap-3">
          {state.slots.map((slot) => (
            <div key={slot.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black">{slot.label}</h3>
                  <p className="mt-1 font-semibold text-slate-600">{slot.capacity - slot.available} / {slot.capacity} booked</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => updateSlotStatus(slot.id, "available")} className="rounded-xl bg-green-100 px-3 py-2 font-black text-green-800">Open Slot</button>
                  <button onClick={() => updateSlotStatus(slot.id, "closed")} className="rounded-xl bg-red-100 px-3 py-2 font-black text-red-800">Close Slot</button>
                  <button onClick={() => updateSlotStatus(slot.id, "limited")} className="rounded-xl bg-blue-100 px-3 py-2 font-black text-blue-800">Increase Capacity</button>
                  <button onClick={() => updateSlotStatus(slot.id, "full")} className="rounded-xl bg-slate-100 px-3 py-2 font-black text-slate-700">Reduce Capacity</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </OperatorPage>
  );
}

function NotificationsPage() {
  const { state, addNotification } = usePrototype();
  const [audience, setAudience] = useState("Waiting farmers");
  const [message, setMessage] = useState("Your queue position is now #5. Please stay near the procurement centre.");
  return (
    <OperatorPage title="Notifications" subtitle="Send simple updates to farmers.">
      <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <label className="grid gap-2 text-sm font-black text-slate-600">
            Send to
            <select value={audience} onChange={(event) => setAudience(event.target.value)} className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-bold">
              {["All booked farmers", "Waiting farmers", "Specific farmer", "10:00 AM slot farmers"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="mt-4 grid gap-2 text-sm font-black text-slate-600">
            Message
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-36 rounded-2xl border border-slate-200 p-4 text-base font-semibold" />
          </label>
          <button onClick={() => addNotification(`Message sent to ${audience}`, message, "info")} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 font-black text-white">
            <Send className="h-4 w-4" /> Send Notification
          </button>
        </div>
        <RecentNotifications />
      </section>
    </OperatorPage>
  );
}

function CurrentlyServing() {
  const { state, callFarmer } = usePrototype();
  const serving = state.queue.find((item) => item.token === state.currentlyServing) || state.queue[1];
  return (
    <section className="rounded-[2rem] bg-blue-700 p-6 text-white shadow-sm">
      <p className="text-sm font-black text-blue-100">Currently Serving</p>
      <h2 className="mt-2 text-4xl font-black">Token {serving.token}</h2>
      <p className="mt-3 text-2xl font-black">{serving.farmer}</p>
      <div className="mt-5 grid gap-2 text-sm font-semibold text-blue-50">
        <p>Crop: {serving.crop}</p>
        <p>Expected Quantity: {serving.quantity} Quintals</p>
        <p>Slot: {serving.slot} AM</p>
      </div>
      <p className="mt-5 rounded-2xl bg-white/15 p-4 text-xl font-black">Weighing in Progress</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/operator/process" className="rounded-xl bg-white px-4 py-3 font-black text-blue-800">Complete Weighing</Link>
        <button onClick={callFarmer} className="rounded-xl border border-white/35 px-4 py-3 font-black">Call Ramesh</button>
      </div>
    </section>
  );
}

function UpNext() {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Up Next</h2>
      <div className="mt-5 grid gap-3">
        {[
          ["#10223", "Amit Kumar", "Wheat - 20 Quintals", "10:05 AM"],
          ["#10224", "Rajesh", "Wheat - 18 Quintals", "10:15 AM"],
          ["#10234", "Ramesh Kumar", "Wheat - 25 Quintals", "10:35 AM"],
        ].map(([token, name, meta, turn]) => (
          <div key={token} className="rounded-2xl bg-slate-50 p-4">
            <p className="font-black">{token} - {name}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{meta}</p>
            <p className="mt-2 text-sm font-black text-blue-700">Estimated turn: {turn}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LiveQueueTable({ compact = false, rows }: { compact?: boolean; rows?: ReturnType<typeof usePrototype>["state"]["queue"] }) {
  const { state } = usePrototype();
  const tableRows = rows || state.queue;
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black">Live Procurement Queue</h2>
        {compact && <Link href="/operator/queue" className="text-sm font-black text-blue-700">Manage <ArrowRight className="inline h-4 w-4" /></Link>}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr><th className="py-3">Token</th><th>Farmer</th><th>Crop</th><th>Quantity</th><th>Slot</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableRows.map((row) => (
              <tr key={row.token}>
                <td className="py-4 font-black">{row.token}</td>
                <td className="font-bold">{row.farmer}</td>
                <td>{row.crop}</td>
                <td>{row.quantity} Q</td>
                <td>{row.slot}</td>
                <td><StatusBadge label={row.status} /></td>
                <td><Link href="/operator/process" className="rounded-xl bg-slate-100 px-3 py-2 font-black text-slate-700">{row.status === "Waiting" ? "Call" : row.status === "Processing" ? "Process" : "View"}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AttentionPanel() {
  return (
    <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5">
      <h2 className="flex items-center gap-2 text-xl font-black text-amber-950"><AlertTriangle className="h-5 w-5" /> Attention Required</h2>
      <div className="mt-4 grid gap-3 text-sm font-bold text-amber-950">
        <Link href="/operator/queue">7 farmers waiting more than 30 minutes</Link>
        <Link href="/operator/payments">12 payments pending</Link>
        <Link href="/operator/slots">Slot 11:00 AM is almost full</Link>
        <Link href="/operator">Counter 2 is currently unavailable</Link>
      </div>
    </section>
  );
}

function PerformancePanel() {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Daily Centre Performance</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail label="Farmers scheduled" value="84" />
        <Detail label="Farmers served" value="56" />
        <Detail label="No-shows" value="3" />
        <Detail label="Average waiting time" value="28 min" />
        <Detail label="Average service time" value="14 min" />
        <Detail label="Total quantity procured" value="824 Quintals" />
        <Detail label="Total procurement value" value="Rs. 18.42 Lakh" />
      </div>
    </section>
  );
}

function RecentNotifications() {
  const { state } = usePrototype();
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Recent Notifications</h2>
      <div className="mt-4 grid gap-3">
        {state.notifications.slice(0, 4).map((item) => (
          <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
            <p className="font-black">{item.title}</p>
            <p className="mt-1 text-sm text-slate-600">{item.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function OperatorPage({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-slate-600">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function OperatorNavItem({ item, active }: { item: (typeof navItems)[number]; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className={cn("flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black transition", active ? "bg-blue-500 text-white" : "text-white/75 hover:bg-white/10 hover:text-white")}>
      <Icon className="h-5 w-5" />
      {item.label}
    </Link>
  );
}

function Kpi({ icon: Icon, title, value, note }: { icon: typeof CalendarDays; title: string; value: string; note: string }) {
  return (
    <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></span>
      <p className="mt-4 text-xs font-black uppercase text-slate-500">{title}</p>
      <h3 className="mt-1 text-3xl font-black">{value}</h3>
      <p className="mt-1 text-sm font-bold text-slate-500">{note}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-black text-slate-950">{value}</p>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  const color = label.includes("Completed") || label.includes("Received") ? "bg-green-100 text-green-800" : label.includes("Processing") || label.includes("Weighing") ? "bg-blue-100 text-blue-800" : label.includes("No") ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800";
  return <span className={cn("rounded-full px-3 py-1 text-xs font-black", color)}>{label}</span>;
}

function activeFor(screen: OperatorScreen, href: string) {
  if (screen === "dashboard") return href === "/operator";
  return href.endsWith(screen);
}

function paymentLabel(status: string) {
  if (status === "received") return "Payment Received";
  if (status === "pending") return "Pending";
  return "Processing";
}
