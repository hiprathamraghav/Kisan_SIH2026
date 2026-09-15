"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { Button } from "./ui/button";

const links = ["Home", "About", "Features", "Impact", "FAQ"];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl bg-[#f7fadff2] px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-md sm:px-5">
        <Logo />
        <nav className="hidden items-center gap-6 text-xs font-semibold text-forest md:flex">
          {links.map((link) => <a key={link} href={`#${link.toLowerCase()}`} className="transition hover:text-leaf">{link}</a>)}
        </nav>
        <Button className="hidden bg-forest px-4 py-2 text-xs text-white hover:bg-leaf sm:inline-flex" arrow>Get a Demo</Button>
        <button onClick={() => setOpen(!open)} aria-label="Open navigation" className="text-forest md:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl bg-white p-4 shadow-soft md:hidden">
          <nav className="flex flex-col gap-2 text-sm font-semibold text-forest">
            {links.map((link) => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 hover:bg-mist">{link}</a>)}
            <Button className="mt-2 bg-forest text-white" arrow>Get a Demo</Button>
          </nav>
        </div>
      )}
    </header>
  );
}
