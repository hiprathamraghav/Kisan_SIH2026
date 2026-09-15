import { Check, CircleUserRound, ClipboardList, CalendarCheck } from "lucide-react";
import { Reveal } from "./reveal";
import { Button } from "./ui/button";

const steps = [
  { icon: CircleUserRound, title: "Register & Login", text: "Sign up with your mobile number and get a unique Farmer ID." },
  { icon: ClipboardList, title: "Fill Crop Details", text: "Enter crop type, quantity and select your preferred procurement center." },
  { icon: CalendarCheck, title: "Get AI Suggested Slot", text: "Our system estimates processing time and suggests the best available slot." },
  { icon: Check, title: "Visit, Track & Get Paid", text: "Visit the mandi at your slot time, track the progress in real-time and receive payment." },
];

export function HowItWorks() {
  return (
    <section className="bg-mist px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-11 lg:grid-cols-[.93fr_1.07fr] lg:gap-16">
        <Reveal>
          <p className="text-[10px] font-bold tracking-[.16em] text-leaf">SIMPLE. SMART. SEAMLESS.</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-[-.05em] text-forest sm:text-5xl">How It Works</h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-forest/75">From registration to payment, experience a smooth digital procurement journey in just a few steps.</p>
          <div className="relative mt-7 min-h-[400px] overflow-hidden rounded-3xl bg-forest shadow-soft sm:min-h-[480px]">
            <div className="absolute inset-0 bg-[url('/images/farmer-phone.png')] bg-cover bg-[center_45%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-transparent to-transparent" />
            <p className="absolute right-5 top-10 rotate-[-6deg] text-right font-cursive text-3xl font-bold leading-[.85] text-lime sm:right-8 sm:top-16 sm:text-4xl">Digital Mandi,<br />Stronger Farmers</p>
            <Button className="absolute bottom-5 left-5 bg-lime px-5 py-2.5 text-forest hover:bg-white sm:bottom-7 sm:left-7" arrow>Get Started</Button>
          </div>
        </Reveal>
        <div className="relative flex flex-col justify-center gap-3 py-3 lg:pt-20">
          <div className="absolute left-6 top-8 bottom-8 hidden border-l-2 border-dashed border-forest/45 lg:block" />
          {steps.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * .1} className="relative flex gap-4">
              <div className="z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e7eed5] text-forest shadow-sm"><Icon className="h-5 w-5" strokeWidth={2.4} /></div>
              <article className="min-h-[105px] flex-1 rounded-2xl border border-forest/5 bg-[#e7eed5]/85 p-4 transition hover:bg-lime/70">
                <h3 className="text-sm font-bold tracking-tight text-forest">{index + 1}. {title}</h3>
                <p className="mt-1.5 max-w-[305px] text-xs leading-snug text-forest/72">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
