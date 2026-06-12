'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const variantStyles = {
  default:
    'glass-card glass-card-hover border-glass-border hover:glow-blue',
  primary:
    'bg-gradient-to-br from-electric/20 via-purple-glow/10 to-transparent border-electric/20 hover:from-electric/25 hover:via-purple-glow/15 hover:glow-blue',
  danger:
    'glass-card border-danger-accent/20 hover:glow-danger hover:border-danger-accent/40',
};

const iconVariantStyles = {
  default: 'bg-muted/50 text-muted-foreground',
  primary: 'bg-electric/15 text-electric',
  danger: 'bg-danger-accent/15 text-danger-accent',
};

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'default' | 'primary' | 'danger';
  onClick?: () => void;
  href?: string;
}

export function ActionCard({
  icon: Icon,
  title,
  description,
  variant = 'default',
  onClick,
  href,
}: ActionCardProps) {
  const Comp = href ? 'a' : motion.button;
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' as const } : {};

  return (
    <Comp
      {...linkProps}
      onClick={!href ? onClick : undefined}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'flex cursor-pointer items-start gap-4 rounded-xl border p-5 transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variantStyles[variant]
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          iconVariantStyles[variant]
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </Comp>
  );
}