import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Reveal } from "./reveal";

const studies = [
  { image: "/images/farmer-phone.png", title: "80% Reduction in Waiting Time at Pilot Mandi", text: "Farmers spent less time in queue and more time on their farms, leading to higher satisfaction.", tags: ["Better Processing", "Happier Farmers", "Better Planning"] },
  { image: "/images/mandi-hero.png", title: "Smoother Operations, Higher Throughput", text: "Mandi officers helped the center handle 2x more procurement without overcrowding.", tags: ["Optimized Resources", "Less Crowd", "Timely Payments"] },
];

export function RealImpact() {
  return (
    <section className="bg-[#f3f8df] px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="grid gap-5 lg:grid-cols-[1.1fr_.9fr] lg:items-end"><div><p className="text-[10px] font-bold tracking-[.16em] text-leaf">REAL IMPACT</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.05em] text-forest sm:text-4xl">From Real Mandis, Real People</h2></div><div className="flex flex-wrap items-center justify-between gap-3"><p className="max-w-sm text-xs leading-relaxed text-forest/75">Our smart scheduling system is already showing the difference — reducing waiting times, improving resource utilization and creating faster payments.</p><span className="rounded-full bg-forest px-3 py-2 text-[10px] font-bold text-lime">View All Success Stories</span></div></Reveal>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {studies.map((study, index) => <Reveal key={study.title} delay={index * .1}><article className="overflow-hidden rounded-2xl bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"><div className="h-36 overflow-hidden rounded-xl"><div className="h-full bg-cover bg-center transition duration-500 hover:scale-105" style={{ backgroundImage: `url(${study.image})` }} /></div><div className="p-2 pb-1"><h3 className="max-w-[265px] text-lg font-bold leading-[1.02] tracking-tight text-forest">{study.title}</h3><p className="mt-3 text-xs leading-relaxed text-forest/70">{study.text}</p><div className="mt-4 flex items-center gap-1.5"><div className="flex flex-1 flex-wrap gap-1">{study.tags.map((tag) => <span key={tag} className="rounded-full bg-lime/80 px-2 py-1 text-[8px] font-bold text-forest">{tag}</span>)}</div><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-leaf text-white"><ChevronRight className="h-4 w-4" /></span></div></div></article></Reveal>)}
        </div>
        <Reveal delay={.15} className="mt-12 border-y border-forest/10 py-7"><p className="text-center text-[9px] font-bold tracking-[.18em] text-forest/70">IN COLLABORATION WITH</p><div className="mt-6 grid grid-cols-3 gap-5 text-center sm:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="text-[11px] font-bold text-forest/65">Your Logo</div>)}</div></Reveal>
      </div>
    </section>
  );
}
