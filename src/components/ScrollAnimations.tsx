"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

// 1. Text / Section sliding in smoothly from the Left
export function SlideFromLeft({ children, className = "", delay = 0, duration = 0.6 }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 2. Text / Section sliding in smoothly from the Right
export function SlideFromRight({ children, className = "", delay = 0, duration = 0.6 }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 3. Card Pop Up / Zoom In animation when scrolled into view
export function PopUpCard({ children, className = "", delay = 0, duration = 0.5 }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 35 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ 
        duration, 
        delay, 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 4. Subtle Smooth Fade Up
export function FadeUp({ children, className = "", delay = 0, duration = 0.5 }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}