import { useLocation } from 'react-router-dom';
import { Wrench } from '@phosphor-icons/react';

export default function MerchantPlaceholder() {
  const location = useLocation();
  const page = location.pathname.split('/').pop() ?? 'Page';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-700/10 flex items-center justify-center mb-4">
        <Wrench size={28} weight="light" className="text-brand-700" />
      </div>
      <h2 className="text-lg font-bold text-foreground capitalize mb-2">{page}</h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        This page is under construction. Come back soon for the full experience.
      </p>
    </div>
  );
}
