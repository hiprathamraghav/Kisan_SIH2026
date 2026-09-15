"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

const faqs = [
  ["Do I need an app to book a slot?", "No. You can use the platform from any modern mobile browser; an app is optional."],
  ["Is there any fee for using the platform?", "No fee is charged to farmers for slot booking and status tracking."],
  ["How is the processing time estimated?", "Our model uses crop type, quantity, expected mandi load and historical processing patterns."],
  ["Can I reschedule my slot?", "Yes, you can reschedule subject to available capacity at your selected procurement center."],
  ["Will I get payment status on the spot?", "You will receive timely status notifications as your crop progresses through procurement."],
];

export function Faq() {
  return (
    <section id="faq" className="bg-[#f5f9e5] px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.25fr_.75fr]"><div><p className="text-[10px] font-bold tracking-[.16em] text-leaf">COMMON QUERIES</p><Accordion.Root type="single" collapsible className="mt-4 space-y-2">{faqs.map(([question, answer]) => <Accordion.Item value={question} key={question} className="overflow-hidden rounded-lg bg-[#e5ecd1]"><Accordion.Header><Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-3 text-left text-xs font-medium text-forest"><span>{question}</span><Plus className="h-4 w-4 transition group-data-[state=open]:rotate-45" /></Accordion.Trigger></Accordion.Header><Accordion.Content className="overflow-hidden px-4 pb-3 text-xs leading-relaxed text-forest/75 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">{answer}</Accordion.Content></Accordion.Item>)}</Accordion.Root></div><div className="lg:pt-7"><h2 className="max-w-[260px] text-3xl font-semibold leading-[.95] tracking-[-.05em] text-forest">Frequently Asked Questions</h2><p className="mt-4 max-w-xs text-sm leading-relaxed text-forest/70">Find answers to the most common questions about slot booking, mandi visits, payments and more.</p><Button variant="dark" className="mt-5 px-4 py-2.5 text-xs" arrow>View All FAQs</Button></div></div></section>
  );
}
