'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertTriangle, Brain, UserX, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CrisisCard {
  title: string;
  icon: LucideIcon;
  colorClass: string;
  iconBgClass: string;
  description: string;
  stat: string;
  statLabel: string;
}

const crises: CrisisCard[] = [
  {
    title: 'Knowledge Debt',
    icon: AlertTriangle,
    colorClass: 'text-danger-accent',
    iconBgClass: 'bg-danger-accent/10',
    description:
      'AI-generated code with no documentation creates invisible debt that compounds over time, making every future change riskier and more expensive. Teams inherit codebases they cannot safely modify.',
    stat: '81/100',
    statLabel: 'average knowledge debt score',
  },
  {
    title: 'Context Loss',
    icon: Brain,
    colorClass: 'text-amber-accent',
    iconBgClass: 'bg-amber-accent/10',
    description:
      'Key developers leave and take irreplaceable mental models with them, leaving teams unable to make changes confidently. Critical business logic becomes a guessing game.',
    stat: '62%',
    statLabel: 'of orgs report key-person risk',
  },
  {
    title: 'Freelancer Nightmare',
    icon: UserX,
    colorClass: 'text-purple-glow',
    iconBgClass: 'bg-purple-glow/10',
    description:
      'Freelancers inherit AI-generated projects and spend weeks just understanding basic architecture before writing a single line of meaningful code. Billable hours vanish into comprehension.',
    stat: '3-4 wks',
    statLabel: 'average time to understand a codebase',
  },
  {
    title: 'Knowledge Silos',
    icon: Lock,
    colorClass: 'text-electric',
    iconBgClass: 'bg-electric/10',
    description:
      'Critical information locked in individual minds, Slack threads, and abandoned documentation that no one can find or trust. Institutional knowledge decays faster than it accumulates.',
    stat: '47%',
    statLabel: 'of developer time spent searching',
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

export function CrisisSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      aria-label="The AI knowledge crisis"
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
            The AI{' '}
            <span className="gradient-text">Knowledge Crisis</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Organizations are accumulating technical debt faster than ever before.
            The symptoms are everywhere, but the root cause is the same: code
            without understanding.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-4 sm:grid-cols-2 md:gap-6"
        >
          {crises.map((crisis) => {
            const Icon = crisis.icon;
            return (
              <motion.div
                key={crisis.title}
                variants={cardVariants}
                className={cn(
                  'glass-card glass-card-hover group relative overflow-hidden rounded-xl p-6 transition-all duration-300 md:p-8'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'mb-5 flex h-11 w-11 items-center justify-center rounded-lg',
                    crisis.iconBgClass
                  )}
                >
                  <Icon className={cn('h-5 w-5', crisis.colorClass)} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground">
                  {crisis.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {crisis.description}
                </p>

                {/* Stat */}
                <div className="mt-5 flex items-baseline gap-2 border-t border-glass-border pt-4">
                  <span
                    className={cn('text-2xl font-bold tabular-nums', crisis.colorClass)}
                  >
                    {crisis.stat}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {crisis.statLabel}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}