'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  GitBranch,
  Share2,
  AlertTriangle,
  FileText,
  FolderGit2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentStep {
  step: number;
  title: string;
  icon: LucideIcon;
  description: string;
}

const agentSteps: AgentStep[] = [
  {
    step: 1,
    title: 'Repository Analyzed',
    icon: GitBranch,
    description: 'Codebase is scanned and parsed',
  },
  {
    step: 2,
    title: 'Knowledge Graph Generated',
    icon: Share2,
    description: 'Architecture and dependencies mapped',
  },
  {
    step: 3,
    title: 'Risk Detected',
    icon: AlertTriangle,
    description: 'Knowledge debt and survivability scored',
  },
  {
    step: 4,
    title: 'Documentation Generated',
    icon: FileText,
    description: 'Auto-generated from code analysis',
  },
  {
    step: 5,
    title: 'GitLab Issue Created',
    icon: FolderGit2,
    description: 'Actionable issues pushed to your workflow',
  },
];

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: smoothEase },
  },
};

function StepDot({ active, index }: { active: boolean; index: number }) {
  return (
    <div
      className={cn(
        'flex h-3 w-3 shrink-0 items-center justify-center rounded-full transition-all duration-500',
        active ? 'bg-electric scale-110' : 'bg-muted'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    />
  );
}

export function AgentWorkflowSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      aria-label="Automated agent workflow"
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
            Automated Agent{' '}
            <span className="gradient-text">Workflow</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            From analysis to action without manual intervention
          </p>
        </motion.div>

        {/* Desktop: horizontal layout */}
        <div className="hidden md:block">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="relative"
          >
            {/* Connecting line background */}
            <div className="absolute top-10 right-0 left-0 h-px bg-muted/20" />
            {/* Animated gradient overlay line */}
            <motion.div
              className="absolute top-10 h-px"
              style={{
                background:
                  'linear-gradient(90deg, oklch(0.65 0.22 260), oklch(0.65 0.2 300))',
                transformOrigin: 'left',
              }}
              initial={{ width: '0%' }}
              animate={isInView ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
            />

            <div className="relative grid grid-cols-5 gap-4">
              {agentSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    variants={stepVariants}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Icon circle */}
                    <div
                      className={cn(
                        'glass-card glow-blue relative z-10 mb-5 flex h-20 w-20 items-center justify-center rounded-2xl'
                      )}
                    >
                      <Icon className="h-8 w-8 text-electric" />
                    </div>

                    {/* Step number */}
                    <span className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Step {step.step}
                    </span>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-foreground">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="relative"
          >
            {/* Vertical connecting line */}
            <div className="absolute top-0 bottom-0 left-[15px] w-px bg-muted/20" />

            <div className="space-y-6">
              {agentSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    variants={stepVariants}
                    className="relative flex gap-4 pl-2"
                  >
                    {/* Dot */}
                    <div className="relative z-10 mt-0.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-electric/10 ring-2 ring-electric/30">
                        <Icon className="h-3.5 w-3.5 text-electric" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Step {step.step}
                      </span>
                      <h3 className="text-sm font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}