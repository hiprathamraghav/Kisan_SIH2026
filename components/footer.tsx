import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { Logo } from "./logo";

const links = ["Home", "About", "Contact", "Privacy", "Terms"];

export function Footer() {
  return (
    <footer className="bg-[#123019] px-5 py-10 text-white sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-7 border-b border-white/15 pb-7 md:flex-row md:items-center md:justify-between"><Logo light /><nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/75">{links.map((link) => <a key={link} href="#home" className="hover:text-lime">{link}</a>)}</nav><div className="flex gap-3 text-lime">{[Linkedin, Facebook, Instagram, Youtube].map((Icon, i) => <a key={i} href="#home" aria-label="Social link" className="transition hover:-translate-y-0.5 hover:text-white"><Icon className="h-4 w-4" /></a>)}</div></div><div className="flex flex-col gap-2 pt-5 text-[10px] text-white/55 sm:flex-row sm:justify-between"><p>© 2026 Annadata Procure-Connect. All rights reserved.</p><p>Made for Farmers. Built for a Better Tomorrow.</p></div></div></footer>
  );
}
