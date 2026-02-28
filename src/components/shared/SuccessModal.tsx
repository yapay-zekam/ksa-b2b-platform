import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Package,
  ArrowRight,
  SquaresFour,
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

interface SuccessModalProps {
  orderId: string;
  totalAmount: number;
  onClose: () => void;
}

function fireConfetti() {
  const PURPLE = '#3D005E';
  const GOLD   = '#FFD680';
  const WHITE  = '#ffffff';

  const shared = {
    particleCount: 80,
    spread: 70,
    colors: [PURPLE, GOLD, WHITE, '#9d1fff', '#FFB800'],
  };

  /* Left cannon */
  confetti({ ...shared, origin: { x: 0.2, y: 0.6 }, angle: 60 });

  /* Right cannon */
  setTimeout(() => {
    confetti({ ...shared, origin: { x: 0.8, y: 0.6 }, angle: 120 });
  }, 150);

  /* Top center burst */
  setTimeout(() => {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: [PURPLE, GOLD, WHITE],
      startVelocity: 35,
    });
  }, 300);

  /* Lingering sparkles */
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: 0.35, y: 0.5 },
      colors: [GOLD, WHITE],
      shapes: ['circle'],
      scalar: 0.7,
    });
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: 0.65, y: 0.5 },
      colors: [PURPLE, WHITE],
      shapes: ['circle'],
      scalar: 0.7,
    });
  }, 500);
}

export function SuccessModal({ orderId, totalAmount, onClose }: SuccessModalProps) {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const handleFire = useCallback(() => {
    fireConfetti();
  }, []);

  useEffect(() => {
    /* Small delay so modal is visible before confetti */
    const t = setTimeout(handleFire, 200);
    return () => clearTimeout(t);
  }, [handleFire]);

  const handleGoToDashboard = () => {
    clearCart();
    onClose();
    navigate('/merchant/dashboard');
  };

  const handleContinueShopping = () => {
    clearCart();
    onClose();
    navigate('/merchant/products');
  };

  return (
    /* Full-screen overlay */
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl overflow-hidden animate-[fadeInUp_0.4s_ease]">
        {/* Purple top band */}
        <div className="h-2 w-full bg-gradient-to-r from-brand-700 via-brand-500 to-gold-400" />

        <div className="px-8 py-10 text-center">
          {/* Success icon */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle size={44} weight="fill" className="text-emerald-500" />
              </div>
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400/30 animate-ping" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-extrabold text-foreground mb-1">
            Order Placed Successfully!
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your order is on the way. Sit back while we handle the rest.
          </p>

          {/* Order details card */}
          <div className="rounded-2xl bg-muted/60 border border-border p-5 mb-6 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Order ID</span>
              <code className="text-sm font-bold text-brand-700 dark:text-brand-300 font-mono">
                {orderId}
              </code>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">Total Amount</span>
              <span className="text-sm font-extrabold text-foreground">
                {totalAmount.toLocaleString('en', { minimumFractionDigits: 2 })} SAR
              </span>
            </div>
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <Package size={14} weight="light" className="text-brand-700 shrink-0" />
              <span className="text-xs text-muted-foreground">
                Estimated delivery: <span className="font-semibold text-foreground">1–3 business days</span>
              </span>
            </div>
          </div>

          {/* Action steps */}
          <div className="grid grid-cols-3 gap-2 mb-7">
            {[
              { step: '1', label: 'Order Confirmed', done: true },
              { step: '2', label: 'Processing',      done: false },
              { step: '3', label: 'Out for Delivery', done: false },
            ].map(({ step, label, done }) => (
              <div key={step} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  {done ? '✓' : step}
                </div>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-2.5">
            <button
              onClick={handleGoToDashboard}
              className="w-full py-3 rounded-xl bg-brand-700 text-white font-bold text-sm hover:bg-brand-800 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-glow"
            >
              <SquaresFour size={16} weight="light" />
              Go to Dashboard
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight size={14} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
