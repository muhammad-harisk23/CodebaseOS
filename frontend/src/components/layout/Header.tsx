'use client';

import React, { useCallback, useState } from 'react';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Menu,
  Command,
  User,
  LogOut,
  Settings,
  Home,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const { theme, setTheme } = useTheme();
  const {
    currentView,
    toggleSidebar,
    setCommandPaletteOpen,
    navigateToApp,
    navigateToHome,
  } = useAppStore();
  const [searchFocused, setSearchFocused] = useState(false);

  const isHome = currentView === 'home';

  const handleCommandPalette = useCallback(() => {
    setCommandPaletteOpen(true);
  }, [setCommandPaletteOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border px-4 transition-colors',
        isHome
          ? 'bg-background/80 backdrop-blur-xl'
          : 'bg-background/60 backdrop-blur-xl'
      )}
      role="banner"
    >
      {/* Mobile Menu */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Home / Back to Home */}
      {!isHome && (
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={navigateToHome}
          aria-label="Go to homepage"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Home</span>
        </Button>
      )}

      {/* Search / Command Palette Trigger */}
      <button
        onClick={handleCommandPalette}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        className={cn(
          'flex items-center gap-2 rounded-md border border-input bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-all flex-1 max-w-md',
          'hover:border-ring/50 hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring',
          searchFocused && 'border-ring/50 bg-muted'
        )}
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">
          Search repositories, commands...
        </span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:flex">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 h-8 w-8"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8 relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger-accent text-[9px] font-bold text-white">
              4
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
            <span className="text-sm font-medium">Critical Risk Detected</span>
            <span className="text-xs text-muted-foreground">
              Authentication module has knowledge debt score of 92/100
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
            <span className="text-sm font-medium">Analysis Complete</span>
            <span className="text-xs text-muted-foreground">
              Next.js Commerce Platform analysis finished
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
            <span className="text-sm font-medium">New Agent Action</span>
            <span className="text-xs text-muted-foreground">
              Documentation generation for Payment module completed
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
            <span className="text-sm font-medium">Bus Factor Alert</span>
            <span className="text-xs text-muted-foreground">
              API Gateway module has only 1 knowledge holder
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8 rounded-full"
            aria-label="User menu"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[11px] bg-gradient-to-br from-electric to-purple-glow text-white">
                JD
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px] bg-gradient-to-br from-electric to-purple-glow text-white">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Jane Doe</span>
              <span className="text-[11px] text-muted-foreground">
                jane@company.com
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => useAppStore.getState().setCurrentView('settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}