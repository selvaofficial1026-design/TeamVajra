"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FAQS_DATA } from "@/data/artsData";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const list = FAQS_DATA || [];

  return (
    <section id="faq" className="py-24 relative border-t border-white/[0.06] bg-[#070A10]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="eyebrow text-blue-400 block mb-3">
            Inquiries & Information
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-400 text-sm">
            Everything you need to know regarding admissions, trial classes, and grading protocols.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {list.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#0B0F1A] border border-white/[0.06] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-white font-semibold text-sm hover:bg-white/[0.02] transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 border-t border-white/[0.04] pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}