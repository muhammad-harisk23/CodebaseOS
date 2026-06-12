'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonItem {
  before: string;
  after: string;
}

const comparisonItems: ComparisonItem[] = [
  {
    before: '3-4 weeks to understand',
    after: '30 minutes to understand',
  },
  {
    before: 'Manual code reading',
    after: 'Automated analysis',
  },
  {
    before: 'No risk assessment',
    after: 'Complete risk profile',
  },
  {
    before: 'Guessing architecture',
    after: 'Interactive architecture map',
  },
  {
    before: 'Unknown dependencies',
    after: 'Full dependency graph',
  },
];

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: smoothEase },
  },
};

export function FreelancerRescueSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      aria-label="Freelancer rescue"
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
            Freelancer{' '}
            <span className="gradient-text">Rescue</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Stop spending weeks understanding inherited projects
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {/* Left column - Description */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={
              isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }
            }
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            <p className="text-base leading-relaxed text-muted-foreground">
              Freelancers routinely inherit AI-generated projects and spend a
              disproportionate amount of their time on understanding rather than
              building. The client expects fast results, but the codebase is a
              black box with no documentation, no architecture diagrams, and no
              explanation of why decisions were made.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              CodebaseOS gives you an instant understanding of architecture,
              risks, and where to start. Instead of reading through hundreds of
              files trying to piece together mental models, you get a
              comprehensive analysis in minutes, including dependency maps,
              knowledge debt scores, and survivability assessments.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Most importantly, it helps you determine whether a project should
              be refactored or rebuilt from scratch, saving weeks of analysis
              time and giving you the data to have that conversation with your
              client from day one.
            </p>
          </motion.div>

          {/* Right column - Before vs After comparison */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={
              isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }
            }
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.25 }}
            className="flex items-center"
          >
            <div
              className={cn(
                'glass-card w-full overflow-hidden rounded-xl p-6 md:p-8'
              )}
            >
              {/* Column headers */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-danger-accent/15">
                    <X className="h-3 w-3 text-danger-accent" />
                  </div>
                  <span className="text-sm font-semibold text-danger-accent">
                    Before CodebaseOS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-accent/15">
                    <Check className="h-3 w-3 text-emerald-accent" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-accent">
                    After CodebaseOS
                  </span>
                </div>
              </div>

              {/* Comparison rows */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="space-y-3"
              >
                {comparisonItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="grid grid-cols-2 gap-4 rounded-lg bg-surface-inset/50 px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger-accent" />
                      <span className="text-sm text-danger-accent">
                        {item.before}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-accent" />
                      <span className="text-sm text-emerald-accent">
                        {item.after}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}