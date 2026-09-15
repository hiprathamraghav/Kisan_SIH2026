import { Building2, Landmark, UsersRound, Wheat } from "lucide-react";
import { Reveal } from "./reveal";

const cards = [
  { icon: Wheat, pre: "For", title: "Farmers", text: "Less waiting, fair price and complete transparency." },
  { icon: Building2, pre: "For", title: "Mandi Officers", text: "Better planning, optimized resources and real-time control." },
  { icon: UsersRound, pre: "For", title: "Communities", text: "Growth in local economy and stronger trust." },
  { icon: Landmark, pre: "For a", title: "Stronger India", text: "Efficient procurement, reduced waste and enhanced food security." },
];

export function Ecosystem() {
  return (
    <section id="impact" className="relative overflow-hidden bg-forest px-5 py-16 text-white sm:px-8 lg:py-20">
      <div className="absolute inset-0 bg-[url('/images/mandi-hero.png')] bg-cover bg-center opacity-[.22]" /><div className="absolute inset-0 bg-forest/70" />
      <div className="relative mx-auto max-w-6xl"><Reveal><p className="text-[10px] font-bold tracking-[.16em] text-lime">BUILT FOR A STRONGER ECOSYSTEM</p></Reveal><div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
        {cards.map(({ icon: Icon, pre, title, text }, index) => <Reveal delay={index * .08} key={title}><article><Icon className="h-6 w-6 text-lime" fill="currentColor" /><p className="mt-4 text-xs font-semibold text-white/80">{pre}</p><h3 className="text-xl font-semibold leading-none tracking-tight">{title}</h3><p className="mt-3 max-w-[175px] text-xs leading-relaxed text-white/70">{text}</p></article></Reveal>)}
      </div></div>
    </section>
  );
}
