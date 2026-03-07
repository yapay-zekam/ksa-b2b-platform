import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CartDrawer } from './CartDrawer';
import { AiCopilot, AiFloatingButton } from './AiCopilot';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  role: 'merchant' | 'supplier';
}

export function Layout({ role }: LayoutProps) {
  const [collapsed,   setCollapsed]   = useState(false);
  const [aiOpen,      setAiOpen]      = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const { isOpen: cartOpen } = useCart();
  const { pathname } = useLocation();
  /* Hide the AI floating button while cart drawer is open or user is on checkout */
  const hideAiButton = cartOpen || pathname === '/merchant/checkout';

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Sidebar
        role={role}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Topbar
        sidebarCollapsed={collapsed}
        role={role}
        userName="Ugur"
        businessName={role === 'merchant' ? 'Hafız Mustafa Baklava' : 'U Coffee Shop'}
        onOpenAi={() => setAiOpen(true)}
        onMobileMenuOpen={() => setMobileOpen(true)}
      />

      {/* Cart drawer — merchant only */}
      {role === 'merchant' && <CartDrawer />}

      {/* AI Copilot panel */}
      <AiCopilot isOpen={aiOpen} onClose={() => setAiOpen(false)} />

      {/* Floating AI trigger button — hidden when cart is open or on checkout */}
      {!aiOpen && !hideAiButton && <AiFloatingButton onClick={() => setAiOpen(true)} />}

      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300 overflow-x-hidden',
          /* On large screens offset left for the sidebar; on mobile, no offset (sidebar overlays) */
          collapsed ? 'lg:pl-[68px]' : 'lg:pl-[220px]'
        )}
      >
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
