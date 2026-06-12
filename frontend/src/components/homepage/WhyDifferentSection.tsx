'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, RefreshCw, Shield, Bot } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCard {
  title: string;
  icon: LucideIcon;
  glowClass: string;
  iconColor: string;
  iconBgClass: string;
  description: string;
  stat: string;
  statLabel: string;
}

const features: FeatureCard[] = [
  {
    title: 'Repository Memory Engine',
    icon: Brain,
    glowClass: 'glow-blue',
    iconColor: 'text-electric',
    iconBgClass: 'bg-electric/10',
    description:
      'Unlike simple static analysis tools, the Memory Engine builds a living knowledge graph of your codebase that evolves with every analysis. It understands not just what code does, but why it exists and how decisions were made.',
    stat: '10x faster onboarding',
    statLabel: '',
  },
  {
    title: 'Recoverability Score',
    icon: RefreshCw,
    glowClass: 'glow-emerald',
    iconColor: 'text-emerald-accent',
    iconBgClass: 'bg-emerald-accent/10',
    description:
      'A proprietary metric that measures how quickly a new team member can become productive with a codebase. Combines documentation coverage, architecture clarity, and knowledge distribution into a single actionable score.',
    stat: '38/100',
    statLabel: 'industry average recoverability',
  },
  {
    title: 'Survivability Score',
    icon: Shield,
    glowClass: 'glow-amber',
    iconColor: 'text-amber-accent',
    iconBgClass: 'bg-amber-accent/10',
    description:
      'Assesses whether your codebase can survive key-person departures, technology changes, and scaling pressures. Identifies single points of failure before they become critical risks.',
    stat: '34/100',
    statLabel: 'industry average survivability',
  },
  {
    title: 'Agent Action Center',
    icon: Bot,
    glowClass: 'glow-purple',
    iconColor: 'text-purple-glow',
    iconBgClass: 'bg-purple-glow/10',
    description:
      'Transform insights into action automatically. Generate GitLab issues, create documentation, build learning missions, and orchestrate knowledge transfer workflows with a single click.',
    stat: '6 automated actions',
    statLabel: 'available out of the box',
  },
];

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: smoothEase },
  },
};

export function WhyDifferentSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      aria-label="Why CodebaseOS is different"
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Why CodebaseOS Is{' '}
            <span className="gradient-text">Different</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Purpose-built for the AI-generated code era
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-4 sm:grid-cols-2 md:gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className={cn(
                  'glass-card group relative overflow-hidden rounded-xl p-6 transition-all duration-300 md:p-8',
                  feature.glowClass
                )}
              >
                {/* Large icon */}
                <div
                  className={cn(
                    'mb-5 flex h-12 w-12 items-center justify-center rounded-xl',
                    feature.iconBgClass
                  )}
                >
                  <Icon className={cn('h-6 w-6', feature.iconColor)} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>

                {/* Stat highlight */}
                <div className="mt-6 border-t border-glass-border pt-4">
                  <span
                    className={cn(
                      'text-xl font-bold tabular-nums',
                      feature.iconColor
                    )}
                  >
                    {feature.stat}
                  </span>
                  {feature.statLabel && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {feature.statLabel}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}