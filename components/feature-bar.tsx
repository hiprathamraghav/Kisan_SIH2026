import { BarChart3, CalendarCheck2, ShieldCheck } from "lucide-react";

const features = [
  { icon: CalendarCheck2, title: "Smart Slot\nBooking", text: "Book your mandi visit in seconds." },
  { icon: BarChart3, title: "AI Time\nEstimation", text: "Get accurate processing time based on crop & quantity." },
  { icon: ShieldCheck, title: "End-to-End\nTransparency", text: "Track your crop from entry to payment." },
];

export function FeatureBar() {
  return (
    <section id="features" className="bg-[#f4f8df] px-5 py-9 sm:px-8">
      <div className="mx-auto grid max-w-6xl divide-y divide-forest/10 md:grid-cols-3 md:divide-x md:divide-y-0">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4 px-0 py-5 first:pt-0 last:pb-0 md:px-8 md:py-0 first:md:pl-0 last:md:pr-0">
            <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lime/70 text-forest"><Icon className="h-5 w-5" strokeWidth={2.4} /></span>
            <div><h3 className="whitespace-pre-line text-lg font-bold leading-[.93] tracking-tight text-forest">{title}</h3><p className="mt-2 max-w-[190px] text-[11px] leading-snug text-forest/70">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
