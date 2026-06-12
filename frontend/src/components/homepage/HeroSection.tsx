'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

const floatingMetrics = [
  {
    label: 'Knowledge Debt',
    score: 81,
    max: 100,
    color: 'text-danger-accent',
    bgGlow: 'glow-danger',
    delay: 0,
  },
  {
    label: 'Survivability',
    score: 34,
    max: 100,
    color: 'text-danger-accent',
    bgGlow: 'glow-danger',
    delay: 0.15,
  },
  {
    label: 'Recoverability',
    score: 38,
    max: 100,
    color: 'text-amber-accent',
    bgGlow: 'glow-amber',
    delay: 0.3,
  },
  {
    label: 'Bus Factor',
    score: 1,
    max: 5,
    color: 'text-danger-accent',
    bgGlow: 'glow-danger',
    delay: 0.45,
  },
];

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
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: smoothEase },
  },
};

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const navigateToApp = useAppStore((s) => s.navigateToApp);

  return (
    <section
      ref={ref}
      aria-label="Hero introduction"
      className="relative flex min-h-screen items-center justify-center overflow-hidden hero-grid-bg"
    >
      {/* Subtle radial glow behind content */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 40%, oklch(0.55 0.2 260 / 8%) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6 md:px-8 md:pb-28 md:pt-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col items-center text-center"
        >
          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            AI Generates Software{' '}
            <span className="gradient-text">Faster Than Humans</span>{' '}
            Can Understand It
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
          >
            AI tools can generate thousands of lines of code in minutes, but no
            one on your team understands how it works, why decisions were made,
            or how to maintain it when things break. CodebaseOS transforms
            repositories into transferable organizational knowledge, eliminating
            the invisible debt that AI-generated code creates.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
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
            <button
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold',
                'border border-glass-border bg-transparent text-foreground transition-all duration-200',
                'hover:bg-glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
              )}
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </button>
          </motion.div>

          {/* Floating Metric Cards Mockup */}
          <motion.div
            variants={itemVariants}
            className="relative mt-20 w-full max-w-3xl"
          >
            {/* Dashboard panel */}
            <div
              className={cn(
                'glass-card relative overflow-hidden rounded-2xl p-6 sm:p-8',
                'border border-glass-border'
              )}
            >
              {/* Panel header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-danger-accent/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-accent/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-accent/60" />
                <span className="ml-2 text-xs font-medium text-muted-foreground">
                  codebase-analysis-dashboard
                </span>
              </div>

              {/* Floating metric cards grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                {floatingMetrics.map((metric) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 20 }
                    }
                    transition={{
                      duration: 0.6,
                      delay: 0.5 + metric.delay,
                      ease: smoothEase,
                    }}
                    className={cn(
                      'glass-card rounded-xl p-4 transition-colors duration-300',
                      metric.bgGlow
                    )}
                    style={{
                      animation: `float 4s ease-in-out ${metric.delay + 1}s infinite`,
                    }}
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {metric.label}
                    </p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span
                        className={cn(
                          'text-2xl font-bold tabular-nums sm:text-3xl',
                          metric.color
                        )}
                      >
                        {metric.score}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / {metric.max}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Fake progress bar */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Analysis Progress
                  </span>
                  <span className="font-medium text-electric">87%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                  <motion.div
                    className="h-full rounded-full bg-electric"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: '87%' } : { width: 0 }}
                    transition={{
                      duration: 1.4,
                      delay: 1,
                      ease: smoothEase,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}