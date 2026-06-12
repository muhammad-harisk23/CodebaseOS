'use client';

import React, { useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentView, sidebarOpen, setSidebarOpen, commandPaletteOpen, setCommandPaletteOpen } =
    useAppStore();
  const isHome = currentView === 'home';

  // Command palette keyboard shortcut
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    },
    [commandPaletteOpen, setCommandPaletteOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Close mobile sidebar on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sidebarOpen, setSidebarOpen]);

  if (isHome) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <AnimatePresence mode="wait">
          <motion.main
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="flex-1"
            role="main"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <CommandPalette />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <AnimatePresence mode="wait">
          <motion.main
            key={currentView}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="flex-1 overflow-auto"
            role="main"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
      <CommandPalette />
    </div>
  );
}