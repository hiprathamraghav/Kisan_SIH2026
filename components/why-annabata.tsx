import { BellRing, CalendarDays, ChevronRight, Clock3, LayoutDashboard, Star } from "lucide-react";
import { Reveal } from "./reveal";
import { Button } from "./ui/button";

const items = [
  { icon: CalendarDays, title: "Slot Booking", text: "Choose your mandi, district and preferred procurement center. Get a confirmed time slot." },
  { icon: Clock3, title: "Processing\nTime Prediction", text: "AI estimates handling time based on crop type and quantity." },
  { icon: BellRing, title: "Real-Time\nUpdates", text: "Get notifications at every stage: arrival, weighing, procurement and payment." },
  { icon: LayoutDashboard, title: "Mandi Admin\nDashboard", text: "Live view of expected load and resource allocation for smooth operations." },
];

export function WhyAnnabata() {
  return (
    <section id="about" className="noise bg-forest px-5 py-16 text-white sm:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="grid items-end gap-7 lg:grid-cols-[1.4fr_.65fr]">
          <div><p className="text-[10px] font-bold tracking-[.16em] text-lime">WHY ANNABATA PROCURE-CONNECT</p><h2 className="mt-3 max-w-2xl text-3xl font-medium leading-[1.02] tracking-[-.045em] sm:text-4xl">Everything You Need<br />For a Hassle-Free Procurement Experience</h2></div>
          <p className="max-w-sm text-xs leading-relaxed text-white/70 lg:pb-1">A unified platform connecting farmers, mandi officers, and government systems to make procurement faster, fairer and fully transparent.</p>
        </Reveal>
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }, index) => (
            <Reveal delay={index * .08} key={title}>
              <article className="group flex min-h-[245px] flex-col rounded-xl border border-white/10 bg-white/[.09] p-5 transition hover:-translate-y-1 hover:bg-white/[.14]">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime text-forest"><Icon className="h-5 w-5" strokeWidth={2.3} /></span>
                <h3 className="mt-6 whitespace-pre-line text-lg font-semibold leading-[.92] tracking-tight">{title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-white/75">{text}</p>
                <span className="mt-auto grid h-7 w-7 place-items-center rounded-full bg-white text-forest transition group-hover:translate-x-1"><ChevronRight className="h-4 w-4" /></span>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={.18} className="mt-6 flex flex-col items-start justify-between gap-5 border-t border-white/15 pt-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3"><div className="flex -space-x-2">{[0, 1, 2, 3].map((i) => <span key={i} className="grid h-8 w-8 place-items-center rounded-full border-2 border-forest bg-lime text-[9px] text-forest"><Star className="h-3 w-3 fill-current" /></span>)}</div><p className="max-w-md text-xs italic leading-relaxed text-white/80">“Now I don&apos;t have to wait at the wholesale mandi. The slot system saved my time and effort.” <span className="not-italic text-lime">— Farmer from Haryana</span></p></div>
          <Button className="shrink-0 px-5 py-2.5 text-xs" arrow>See How It Works</Button>
        </Reveal>
      </div>
    </section>
  );
}
