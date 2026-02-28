import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CartDrawer } from './CartDrawer';
import { AiCopilot, AiFloatingButton } from './AiCopilot';
import { cn } from '@/lib/utils';

interface LayoutProps {
  role: 'merchant' | 'supplier';
}

export function Layout({ role }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [aiOpen,    setAiOpen]    = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        role={role}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <Topbar
        sidebarCollapsed={collapsed}
        role={role}
        userName="Ali"
        businessName={role === 'merchant' ? 'Al Noor Cafe' : 'Miyad International'}
        onOpenAi={() => setAiOpen(true)}
      />

      {/* Cart drawer — merchant only */}
      {role === 'merchant' && <CartDrawer />}

      {/* AI Copilot panel — available on both panels */}
      <AiCopilot isOpen={aiOpen} onClose={() => setAiOpen(false)} />

      {/* Floating AI trigger button (bottom-right) */}
      {!aiOpen && <AiFloatingButton onClick={() => setAiOpen(true)} />}

      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          collapsed ? 'pl-[68px]' : 'pl-[220px]'
        )}
      >
        <div className="p-6 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
