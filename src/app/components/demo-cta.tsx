import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function DemoCta() {
  return (
    <section className="bg-forest px-5 py-12 text-white sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.1fr_.9fr] md:items-end"><div><p className="text-[10px] font-bold tracking-[.16em] text-lime">SEE IT IN ACTION</p><h2 className="mt-3 max-w-xl text-3xl font-medium leading-[1.03] tracking-[-.05em] sm:text-4xl">Try the SIH Prototype<br />Farmer + Operator Flow</h2></div><div><p className="max-w-sm text-sm leading-relaxed text-white/75">Open the farmer portal to book a slot, then use the centre operator panel to check in, manage queue, process procurement, and update payment.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/farmer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white hover:text-forest">Farmer Portal</Link><Link href="/operator" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-forest transition hover:-translate-y-0.5 hover:bg-lime"><MessageCircle className="h-4 w-4" /> Operator Panel</Link></div></div></div>
    </section>
  );
}
