'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Circle,
  PlayCircle,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { interviewQuestions, interviewScoring } from '@/mock/interview';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

/* ------------------------------------------------------------------ */
/*  Score colour helpers                                               */
/* ------------------------------------------------------------------ */
function scoreColor(score: number): { bar: string; text: string; bg: string } {
  if (score > 70) return { bar: '[&>div]:bg-emerald-accent', text: 'text-emerald-accent', bg: 'bg-emerald-accent/15' };
  if (score > 50) return { bar: '[&>div]:bg-amber-accent', text: 'text-amber-accent', bg: 'bg-amber-accent/15' };
  if (score > 30) return { bar: '[&>div]:bg-electric', text: 'text-electric', bg: 'bg-electric/15' };
  return { bar: '[&>div]:bg-danger-accent', text: 'text-danger-accent', bg: 'bg-danger-accent/15' };
}

function difficultyStyle(diff: string) {
  if (diff === 'foundational') return 'bg-emerald-accent/15 text-emerald-accent';
  if (diff === 'intermediate') return 'bg-electric/15 text-electric';
  if (diff === 'advanced') return 'bg-amber-accent/15 text-amber-accent';
  return 'bg-muted text-muted-foreground';
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export function KnowledgeInterviewView() {
  const { setCurrentView } = useAppStore();

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = interviewQuestions;
  const scoring = interviewScoring;
  const current = questions[activeQuestion];
  const answeredIds = new Set(Object.entries(responses).filter(([, v]) => v.trim().length > 0).map(([k]) => k));

  const overallScore = Math.round(scoring.reduce((sum, c) => sum + c.score, 0) / scoring.length);
  const allStrengths = scoring.flatMap((c) => c.strengths);
  const allGaps = scoring.flatMap((c) => c.gaps);

  /* ---- navigation handlers ---- */
  const goPrev = () => setActiveQuestion((i) => Math.max(0, i - 1));
  const goNext = () => setActiveQuestion((i) => Math.min(questions.length - 1, i + 1));
  const handleFinish = () => {
    setResponses((prev) => ({ ...prev, [current.id]: prev[current.id] ?? '' }));
    setShowResults(true);
  };
  const handleResponse = (value: string) =>
    setResponses((prev) => ({ ...prev, [current.id]: value }));

  /* ============================== RENDER ============================== */
  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ---- Hero ---- */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Repository Knowledge Interview&trade;
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Measure your team&apos;s understanding of the codebase. Answer each question as thoroughly as
          possible, then review your knowledge assessment results.
        </p>
      </motion.div>

      {/* ---- Scoring Summary ---- */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {scoring.map((cat) => {
          const colors = scoreColor(cat.score);
          return (
            <div key={cat.id} className="glass-card rounded-xl border border-glass-border p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">{cat.label}</p>
              <div className="flex items-end justify-between mb-2">
                <span className={cn('text-xl font-bold', colors.text)}>{cat.score}</span>
                <span className="text-[10px] text-muted-foreground">/ {cat.max}</span>
              </div>
              <Progress value={cat.score} className={cn('h-1.5', colors.bar)} />
            </div>
          );
        })}
      </motion.div>

      {/* ---- Two-Column Layout ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Question Navigation */}
        <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Questions</h2>
          <ScrollArea className="h-[520px]">
            <div className="space-y-2 pr-2">
              {questions.map((q, i) => {
                const isActive = i === activeQuestion && !showResults;
                const isAnswered = answeredIds.has(q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuestion(i);
                      setShowResults(false);
                    }}
                    className={cn(
                      'w-full text-left rounded-lg border p-3 transition-all duration-200',
                      isActive
                        ? 'border-electric/50 bg-electric/10'
                        : isAnswered
                          ? 'border-emerald-accent/30 bg-emerald-accent/5'
                          : 'border-glass-border bg-glass hover:bg-surface-inset',
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                          isAnswered
                            ? 'bg-emerald-accent/20 text-emerald-accent'
                            : isActive
                              ? 'bg-electric/20 text-electric'
                              : 'bg-surface-inset text-muted-foreground',
                        )}
                      >
                        {isAnswered ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">{q.text}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="outline" className="text-[9px] px-1 py-0 bg-surface-inset border-0">
                            {q.module}
                          </Badge>
                          <Badge variant="outline" className={cn('text-[9px] px-1 py-0 border-0', difficultyStyle(q.difficulty))}>
                            {q.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </motion.div>

        {/* Right: Active Question or Results */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          {!showResults ? (
            /* ---------- Question Area ---------- */
            <div className="glass-card rounded-xl border border-glass-border p-6 space-y-4">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[10px] bg-electric/15 text-electric border-0">
                  {current.module}
                </Badge>
                <Badge variant="outline" className={cn('text-[10px] border-0', difficultyStyle(current.difficulty))}>
                  {current.difficulty}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  Question {activeQuestion + 1} of {questions.length}
                </span>
              </div>

              {/* Question */}
              <h3 className="text-lg font-semibold text-foreground">{current.text}</h3>

              {/* Context */}
              <p className="text-xs text-muted-foreground leading-relaxed">{current.context}</p>

              <Separator className="bg-glass-border" />

              {/* Expected Topics */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Expected Topics
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {current.expectedTopics.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-surface-inset px-2.5 py-1 text-[10px] font-medium text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Follow-ups */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Follow-up Questions
                </p>
                <ul className="space-y-1.5">
                  {current.followUps.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator className="bg-glass-border" />

              {/* Response textarea */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Your Response</label>
                <textarea
                  className="flex min-h-[150px] w-full rounded-lg border border-glass-border bg-surface-inset px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  placeholder="Describe your understanding of this aspect of the codebase..."
                  value={responses[current.id] ?? ''}
                  onChange={(e) => handleResponse(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between pt-1">
                <Button variant="outline" size="sm" onClick={goPrev} disabled={activeQuestion === 0}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button size="sm" onClick={activeQuestion === questions.length - 1 ? handleFinish : goNext}>
                  {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            /* ---------- Results Panel ---------- */
            <div className="glass-card rounded-xl border border-glass-border p-6 space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Knowledge Assessment Results</h3>
                <p className="text-xs text-muted-foreground">
                  Based on {questions.length} questions across {scoring.length} categories
                </p>
              </div>

              {/* Overall score */}
              <div className="glass-card rounded-xl border border-glass-border p-4 flex items-center justify-center gap-4">
                <Target className={cn('h-8 w-8', scoreColor(overallScore).text)} />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Overall Score
                  </p>
                  <p className={cn('text-3xl font-bold', scoreColor(overallScore).text)}>{overallScore}/100</p>
                </div>
              </div>

              {/* Strengths & Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="glass-card rounded-xl border border-emerald-accent/30 p-4">
                  <h4 className="text-xs font-semibold text-emerald-accent uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Knowledge Strengths
                  </h4>
                  <ul className="space-y-2">
                    {allStrengths.map((s) => (
                      <li key={s} className="text-xs text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-emerald-accent shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gaps */}
                <div className="glass-card rounded-xl border border-danger-accent/30 p-4">
                  <h4 className="text-xs font-semibold text-danger-accent uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Knowledge Gaps
                  </h4>
                  <ul className="space-y-2">
                    {allGaps.map((g) => (
                      <li key={g} className="text-xs text-muted-foreground flex items-start gap-2">
                        <AlertCircle className="h-3 w-3 text-danger-accent shrink-0 mt-0.5" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <Button className="w-full" onClick={() => setCurrentView('learning-missions')}>
                <Target className="h-4 w-4 mr-1" />
                Generate Learning Missions
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
