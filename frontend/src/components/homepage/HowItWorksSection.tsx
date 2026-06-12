'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Upload,
  Brain,
  Network,
  AlertTriangle,
  Shield,
  Bot,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TimelineCard } from '@/components/shared/TimelineCard';

interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  status: 'completed' | 'active' | 'pending';
}

const steps: WorkflowStep[] = [
  {
    step: 1,
    title: 'Repository Upload',
    description:
      'Connect your Git repository or upload source code for instant analysis',
    icon: Upload,
    status: 'completed',
  },
  {
    step: 2,
    title: 'Repository Memory Engine',
    description:
      'Our proprietary engine extracts architecture, dependencies, and business logic patterns',
    icon: Brain,
    status: 'completed',
  },
  {
    step: 3,
    title: 'Architecture Mapping',
    description:
      'Automatically generate interactive architecture graphs and dependency maps',
    icon: Network,
    status: 'completed',
  },
  {
    step: 4,
    title: 'Knowledge Debt Analysis',
    description:
      'Score your codebase on documentation coverage, complexity, and transferability',
    icon: AlertTriangle,
    status: 'active',
  },
  {
    step: 5,
    title: 'Survivability Assessment',
    description:
      'Evaluate whether your team can maintain and evolve the codebase',
    icon: Shield,
    status: 'pending',
  },
  {
    step: 6,
    title: 'GitLab Agent Actions',
    description:
      'Automatically create issues, documentation, and learning missions',
    icon: Bot,
    status: 'pending',
  },
];

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      aria-label="How CodebaseOS works"
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
            How CodebaseOS{' '}
            <span className="gradient-text">Works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            From repository to organizational knowledge in minutes
          </p>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {steps.map((step) => (
              <TimelineCard
                key={step.step}
                step={step.step}
                title={step.title}
                description={step.description}
                status={step.status}
                icon={step.icon}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}