import { useState } from 'react';
import {
  MagnifyingGlass,
  Bell,
  Moon,
  Sun,
  ShoppingCart,
  CaretDown,
  Buildings,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/context/CartContext';

interface TopbarProps {
  sidebarCollapsed: boolean;
  role?: 'merchant' | 'supplier';
  userName?: string;
  businessName?: string;
  onOpenAi?: () => void;
}

export function Topbar({
  sidebarCollapsed,
  role = 'merchant',
  userName = 'Ali',
  businessName = 'Al Noor Cafe',
}: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { totalItems, openCart } = useCart();
  const [searchFocused, setSearchFocused] = useState(false);

  const isSupplier = role === 'supplier';

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 flex items-center gap-3 px-5',
        'bg-card border-b border-border transition-all duration-300',
        sidebarCollapsed ? 'left-[68px]' : 'left-[220px]'
      )}
    >
      {/* Greeting */}
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-foreground truncate">
          Good morning, {userName} 👋
        </h2>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Buildings size={11} weight="light" />
          {isSupplier ? 'Supplier Portal' : businessName}
        </p>
      </div>

      {/* Search */}
      <div
        className={cn(
          'hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200',
          'bg-muted/50',
          searchFocused
            ? 'border-brand-700/50 ring-2 ring-brand-700/10 w-72'
            : 'border-border w-48 hover:border-border/80'
        )}
      >
        <MagnifyingGlass size={15} className="text-muted-foreground shrink-0" weight="light" />
        <input
          type="text"
          placeholder="Search…"
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === 'dark' ? (
            <Sun size={17} weight="light" />
          ) : (
            <Moon size={17} weight="light" />
          )}
        </button>

        {/* Cart — merchant only */}
        {!isSupplier && (
          <button
            onClick={openCart}
            className="relative p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ShoppingCart size={17} weight="light" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-brand-700 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={17} weight="light" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 border border-card" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-0.5" />

        {/* User Avatar */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-muted transition-colors">
          <div className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0',
            isSupplier
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-700'
              : 'bg-gradient-to-br from-brand-600 to-brand-800'
          )}>
            {userName.charAt(0)}
          </div>
          <div className="hidden lg:flex flex-col items-start">
            <span className="text-xs font-semibold text-foreground leading-tight">{userName}</span>
            <span className="text-[10px] text-muted-foreground leading-tight capitalize">{role}</span>
          </div>
          <CaretDown size={11} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
