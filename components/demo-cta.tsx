import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export function DemoCta() {
  return (
    <section className="bg-forest px-5 py-12 text-white sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.1fr_.9fr] md:items-end"><div><p className="text-[10px] font-bold tracking-[.16em] text-lime">SEE IT IN ACTION</p><h2 className="mt-3 max-w-xl text-3xl font-medium leading-[1.03] tracking-[-.05em] sm:text-4xl">Request a Demo – Get<br />Tailored Procurement Insights</h2></div><div><p className="max-w-sm text-sm leading-relaxed text-white/75">See how Annadata Procure-Connect can digitize and simplify procurement at your mandi.</p><div className="mt-5 flex flex-wrap gap-3"><Button variant="outline" className="px-4 py-2.5 text-xs" arrow>Request a Demo</Button><Button className="px-4 py-2.5 text-xs"><MessageCircle className="h-4 w-4" /> Talk to Us</Button></div></div></div>
    </section>
  );
}
