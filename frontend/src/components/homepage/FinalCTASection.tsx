'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: smoothEase },
  },
};

export function FinalCTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const navigateToApp = useAppStore((s) => s.navigateToApp);

  return (
    <section
      ref={ref}
      aria-label="Call to action"
      className="relative overflow-hidden py-20 md:py-28"
    >
      {/* Subtle gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, oklch(0.55 0.2 260 / 4%) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col items-center text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            Stop Inheriting Repositories{' '}
            <span className="gradient-text">Nobody Understands.</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Transform your codebase into transferable knowledge. Start with a
            free analysis.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10">
            <button
              onClick={navigateToApp}
              className={cn(
                'glow-blue inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold',
                'bg-electric text-electric-foreground transition-all duration-200',
                'hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric/50'
              )}
            >
              Analyze Repository
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-5 text-sm text-muted-foreground"
          >
            No credit card required. Free for open source.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}