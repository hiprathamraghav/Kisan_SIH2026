"use client";

import { CalendarDays, CirclePlay, MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function Hero() {
  return (
    <section id="home" className="relative min-h-[720px] overflow-hidden bg-forest pt-24 text-white lg:min-h-[790px]">
      <div className="absolute inset-0 bg-[url('/images/mandi-hero.png')] bg-cover bg-[center_48%]" />
      <div className="image-darken absolute inset-0" />
      <div className="hero-grid absolute inset-0 opacity-20" />
      <div className="relative mx-auto flex min-h-[720px] max-w-6xl items-center px-5 pb-10 pt-24 sm:px-8 lg:min-h-[790px] lg:pt-20">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }} className="max-w-xl">
          <Badge className="border border-white/25 bg-white/10 text-lime"><span className="h-1.5 w-1.5 rounded-full bg-lime" /> Digital Procurement for a Stronger Bharat</Badge>
          <h1 className="mt-5 max-w-[560px] text-5xl font-semibold leading-[.94] tracking-[-.055em] sm:text-6xl lg:text-7xl">
            Right Time<br />Fair Price<br /><span className="text-lime">Brighter Tomorrows</span>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/85 sm:text-base">AI-powered slot management for seamless farm procurement.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button className="px-5" arrow>Book Your Slot</Button>
            <Button variant="outline" className="px-5"><CirclePlay className="h-4 w-4" /> Watch Demo</Button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .25 }} className="absolute right-5 top-32 hidden w-40 rounded-2xl bg-lime p-4 text-forest shadow-2xl sm:block lg:right-10 lg:top-36">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-lime"><CalendarDays className="h-5 w-5" /></span>
          <p className="mt-4 text-base font-semibold leading-tight">Skip the Queue<br />Save Your Time</p>
          <span className="mt-4 grid h-7 w-7 place-items-center rounded-full bg-white"><MoveRight className="h-4 w-4" /></span>
        </motion.div>
        <div className="absolute bottom-14 right-7 max-w-[180px] text-right text-lime sm:bottom-16 lg:right-14">
          <p className="font-cursive text-3xl font-bold leading-[.84] -rotate-6 sm:text-4xl">Kisan ki mehnat,<br />Desh ki taakat</p>
          <div className="ml-auto mt-2 h-2 w-28 rounded-full bg-lime -rotate-12" />
        </div>
      </div>
    </section>
  );
}
