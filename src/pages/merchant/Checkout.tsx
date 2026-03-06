import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CaretRight,
  Minus,
  Plus,
  Trash,
  Truck,
  Tag,
  CheckCircle,
  CreditCard,
  AppleLogo,
  GoogleLogo,
  Money,
  MapPin,
  User,
  Buildings,
  Lock,
  Circle,
  ArrowLeft,
  ShieldCheck,
  Spinner,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { SuccessModal } from '@/components/shared/SuccessModal';

type Step = 1 | 2;
type PaymentMethod = 'cash' | 'credit' | 'googlepay' | 'applepay' | 'tabby' | 'tamara';

const ADDRESSES = [
  { id: 'a1', label: 'Main Kitchen – Riyadh', details: 'Hittin, Riyadh, Saudi Arabia 13516', isDefault: true },
  { id: 'a2', label: 'Branch – Al Khobar',    details: 'Al Khobar, Eastern Province, Saudi Arabia', isDefault: false },
  { id: 'a3', label: 'Branch – Jeddah',       details: 'Al Rawdah, Jeddah, Saudi Arabia', isDefault: false },
];

const CONTACTS = [
  { id: 'c1', name: 'Ali Hassan', role: 'Head Chef', phone: '+966 50 123 4567' },
  { id: 'c2', name: 'Sara Ahmed', role: 'Purchasing Manager', phone: '+966 50 987 6543' },
];

const PAYMENT_METHODS: { id: PaymentMethod; label: string; sub?: string }[] = [
  { id: 'cash',      label: 'Cash' },
  { id: 'credit',    label: 'Credit Card' },
  { id: 'googlepay', label: 'Google Pay' },
  { id: 'applepay',  label: 'Apple Pay' },
  { id: 'tabby',     label: 'Tabby',   sub: 'Split in 4 payments. No interest. No late fees.' },
  { id: 'tamara',    label: 'Tamara',  sub: 'Split in 4 payments. No interest. No late fees.' },
];

/* Supplier grouping */
function groupBySupplier(items: ReturnType<typeof useCart>['items']) {
  const map = new Map<string, { supplierName: string; supplierLogo: string; supplierColor: string; items: typeof items }>();
  for (const item of items) {
    const key = item.supplierId;
    if (!map.has(key)) {
      map.set(key, { supplierName: item.supplierName, supplierLogo: item.supplierLogo, supplierColor: item.supplierColor, items: [] });
    }
    map.get(key)!.items.push(item);
  }
  return Array.from(map.values());
}

function PaymentBrands() {
  return (
    <div className="flex items-center gap-2">
      {/* Mada */}
      <div className="px-2 py-1 rounded-md bg-muted border border-border text-[9px] font-bold text-foreground">mada</div>
      {/* MC */}
      <div className="w-8 h-5 rounded-md bg-red-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute left-1 w-4 h-4 rounded-full bg-red-500 border-2 border-red-600" />
        <div className="absolute right-1 w-4 h-4 rounded-full bg-orange-400 opacity-80" />
      </div>
      {/* Visa */}
      <div className="px-2 py-1 rounded-md bg-blue-700 text-white text-[10px] font-extrabold italic">VISA</div>
    </div>
  );
}

function PaymentIcon({ method }: { method: PaymentMethod }) {
  if (method === 'credit')    return <PaymentBrands />;
  if (method === 'applepay')  return <div className="px-2 py-1 text-[10px] font-bold text-foreground bg-muted border border-border rounded-md flex items-center gap-1"><AppleLogo size={12} weight="fill" /> Pay</div>;
  if (method === 'googlepay') return <div className="px-2 py-1 text-[10px] font-bold text-foreground bg-muted border border-border rounded-md flex items-center gap-1"><GoogleLogo size={12} weight="bold" /> Pay</div>;
  if (method === 'tabby')     return <div className="px-2 py-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 rounded-md">tabby</div>;
  if (method === 'tamara')    return <div className="px-2 py-1 text-[10px] font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 rounded-md">tamara</div>;
  return <Money size={18} weight="light" className="text-muted-foreground" />;
}

/* ─── Card input formatter ─── */
function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, removeItem, updateQty } = useCart();

  const [step, setStep] = useState<Step>(1);
  const [selectedAddress, setSelectedAddress] = useState('a1');
  const [selectedContact, setSelectedContact]  = useState('c1');
  const [billingAddress,  setBillingAddress]   = useState('a1');
  const [paymentMethod,   setPaymentMethod]    = useState<PaymentMethod>('credit');
  const [agreed, setAgreed] = useState(false);

  /* Card form */
  const [cardNumber, setCardNumber] = useState('');
  const [cardName,   setCardName]   = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv,    setCardCvv]    = useState('');
  const [cardFocused, setCardFocused] = useState<string | null>(null);

  /* Processing + success */
  const [processing, setProcessing] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [orderId]    = useState(`#KSA-${Math.floor(10000 + Math.random() * 90000)}`);
  const processingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Pricing */
  const shipping  = subtotal > 500 ? 0 : 100;
  const vat       = subtotal * 0.15;
  const discount  = subtotal * 0.01;
  const total     = subtotal + shipping + vat - discount;

  const groups = groupBySupplier(items);

  const goToStep = (s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handlePlaceOrder = () => {
    if (processing || success) return;
    setProcessing(true);
    processingTimer.current = setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2200);
  };

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  };

  /* ── Order Summary Panel (shared between steps) ── */
  const OrderSummary = ({ showActions }: { showActions: boolean }) => (
    <div className="rounded-2xl border border-border bg-card overflow-hidden sticky top-20">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-bold text-foreground">Order Summary</h3>
      </div>

      {/* Expandable items list */}
      <details className="group" open>
        <summary className="flex items-center justify-between px-5 py-3 cursor-pointer border-b border-border hover:bg-muted/30 transition-colors">
          <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">Order Details</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {items.length} Products
            <CaretRight size={12} className="transition-transform group-open:rotate-90" />
          </div>
        </summary>
        <div className="max-h-48 overflow-y-auto divide-y divide-border scrollbar-thin">
          {items.map((item) => (
            <div key={`${item.productId}-${item.supplierId}`} className="flex items-center gap-3 px-5 py-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted shrink-0">
                <img src={item.productImage} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-foreground truncate">{item.productTitle}</p>
                <p className="text-[10px] text-muted-foreground">× {item.quantity}</p>
              </div>
              <span className="text-[10px] font-semibold text-foreground shrink-0">
                {(item.price * item.quantity).toLocaleString('en', { minimumFractionDigits: 2 })} SAR
              </span>
            </div>
          ))}
        </div>
      </details>

      {/* Totals */}
      <div className="px-5 py-4 space-y-2.5 border-b border-border">
        {[
          { label: 'Subtotal',    value: subtotal,  extra: '' },
          { label: 'Shipping',    value: shipping,  extra: shipping === 0 ? '(Free)' : '' },
          { label: 'VAT 15%',     value: vat,       extra: '' },
          { label: 'Discount',    value: -discount, extra: '' },
        ].map(({ label, value, extra }) => (
          <div key={label} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className={cn('font-semibold', value < 0 ? 'text-emerald-600' : 'text-foreground')}>
              {value < 0 ? '-' : ''}{Math.abs(value).toLocaleString('en', { minimumFractionDigits: 2 })} SAR {extra}
            </span>
          </div>
        ))}
        <div className="border-t border-border pt-2.5 flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">Total Amount</span>
          <span className="text-base font-extrabold text-brand-700 dark:text-brand-300">
            {total.toLocaleString('en', { minimumFractionDigits: 2 })} SAR
          </span>
        </div>
        <button className="text-[11px] text-brand-700 dark:text-brand-300 hover:underline font-medium mt-1">
          + Add discount code
        </button>
      </div>

      {/* Address info (shown on payment step) */}
      {step === 2 && (
        <div className="px-5 py-4 border-b border-border space-y-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Shipping & Billing
          </p>
          <p className="text-xs font-semibold text-foreground">{CONTACTS.find(c => c.id === selectedContact)?.name}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {ADDRESSES.find(a => a.id === selectedAddress)?.details}
          </p>
          <p className="text-xs text-muted-foreground">RYD – {Math.floor(Math.random() * 9000000000000) + 1000000000000}</p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="px-5 py-4 space-y-3">
          {step === 1 ? (
            <>
              {/* Address selectors */}
              {[
                { label: 'Contact person', icon: User, options: CONTACTS, selected: selectedContact, onSelect: setSelectedContact, getLabel: (id: string) => CONTACTS.find(c => c.id === id)?.name ?? '' },
                { label: 'Delivery address', icon: MapPin, options: ADDRESSES, selected: selectedAddress, onSelect: setSelectedAddress, getLabel: (id: string) => ADDRESSES.find(a => a.id === id)?.label ?? '' },
                { label: 'Billing address', icon: Buildings, options: ADDRESSES, selected: billingAddress, onSelect: setBillingAddress, getLabel: (id: string) => ADDRESSES.find(a => a.id === id)?.label ?? '' },
              ].map(({ label, icon: Icon, options, selected, onSelect, getLabel }) => (
                <div key={label} className="relative">
                  <select
                    value={selected}
                    onChange={(e) => onSelect(e.target.value)}
                    className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-xs text-gray-800 dark:text-gray-100 outline-none hover:border-brand-700/40 transition-colors cursor-pointer"
                    style={{ colorScheme: 'light dark' }}
                  >
                    <option value="" disabled>{label}</option>
                    {options.map((o) => (
                      <option key={o.id} value={o.id}>{getLabel(o.id)}</option>
                    ))}
                  </select>
                  <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" weight="light" />
                  <CaretRight size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
                </div>
              ))}

              <button
                onClick={() => goToStep(2)}
                disabled={!selectedAddress || !selectedContact}
                className="w-full py-3 rounded-xl bg-brand-700 text-white font-bold text-sm hover:bg-brand-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Continue to Checkout
              </button>

              <p className="text-[10px] text-muted-foreground text-center">
                I'd like to continue by adding a new address or editing an existing one.
              </p>
            </>
          ) : (
            <>
              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-brand-700 w-3.5 h-3.5 shrink-0"
                />
                <span className="text-[11px] text-muted-foreground leading-relaxed">
                  I agree to the{' '}
                  <span className="text-brand-700 dark:text-brand-300 underline cursor-pointer">terms and conditions</span>
                  {' '}and the{' '}
                  <span className="text-brand-700 dark:text-brand-300 underline cursor-pointer">privacy policy</span>.
                </span>
              </label>

              <button
                onClick={handlePlaceOrder}
                disabled={!agreed || processing}
                className="w-full py-3 rounded-xl bg-brand-700 text-white font-bold text-sm hover:bg-brand-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-glow flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Spinner size={16} className="animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Lock size={14} weight="bold" />
                    Complete Checkout
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Processing overlay */}
      {processing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-brand-700/20 border-t-brand-700 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock size={24} weight="light" className="text-brand-700" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">Processing your order…</p>
            <p className="text-sm text-muted-foreground mt-1">Please don't close this window.</p>
          </div>
          {/* Fake progress bar */}
          <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-brand-700 rounded-full animate-[progress_2s_ease-in-out_forwards]" />
          </div>
        </div>
      )}

      {/* Success modal */}
      {success && (
        <SuccessModal
          orderId={orderId}
          totalAmount={total}
          onClose={() => setSuccess(false)}
        />
      )}

      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <button onClick={() => navigate('/merchant/products')} className="hover:text-foreground transition-colors">Products</button>
          <CaretRight size={11} />
          <button onClick={() => navigate(-1)} className="hover:text-foreground transition-colors">Cart</button>
          <CaretRight size={11} />
          <span className="text-foreground font-medium">Checkout</span>
        </nav>

        {/* Step indicator */}
        <div className="flex items-center gap-3">
          {[
            { n: 1, label: 'Review & Address' },
            { n: 2, label: 'Payment' },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-2">
              {i > 0 && <CaretRight size={14} className="text-muted-foreground" />}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                    step === n
                      ? 'bg-brand-700 text-white'
                      : step > n
                      ? 'bg-emerald-500 text-white'
                      : 'bg-muted text-muted-foreground border border-border'
                  )}
                >
                  {step > n ? '✓' : n}
                </div>
                <span className={cn('text-sm font-semibold hidden sm:block', step === n ? 'text-foreground' : 'text-muted-foreground')}>
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="space-y-4">
            {/* ───── STEP 1: Cart Review ───── */}
            {step === 1 && (
              <>
                {groups.map((group) => {
                  const groupTotal = group.items.reduce((s, i) => s + i.price * i.quantity, 0);
                  const toFree = 500 - groupTotal;
                  return (
                    <div key={group.supplierName} className="rounded-2xl border border-border bg-card overflow-hidden">
                      {/* Supplier header */}
                      <div
                        className="flex items-center justify-between px-5 py-3 border-b border-border"
                        style={{ background: 'linear-gradient(135deg, rgba(61, 0, 94, 0.082), transparent)' }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                            style={{ background: group.supplierColor }}
                          >
                            {group.supplierLogo}
                          </div>
                          <span className="text-xs font-bold text-foreground">{group.supplierName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px]">
                          <Truck size={11} weight="light" className={toFree > 0 ? 'text-amber-500' : 'text-emerald-500'} />
                          {toFree > 0 ? (
                            <span className="text-amber-600">Add {toFree.toFixed(0)} SAR more for free shipping.</span>
                          ) : (
                            <span className="text-emerald-600 font-semibold">Free Shipping</span>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-border">
                        {group.items.map((item) => (
                          <div key={`${item.productId}-${item.supplierId}`} className="px-5 py-4">
                            {/* Mobile layout — mirrors My Cart cards */}
                            <div className="sm:hidden">
                              <div className="flex gap-3">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                                  <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                                    {item.productTitle}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.unit}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Truck size={10} weight="light" className="text-emerald-500 shrink-0" />
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                      {item.deliveryDays}
                                    </span>
                                  </div>
                                  {item.promoNote && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <Tag size={10} weight="light" className="text-brand-700 shrink-0" />
                                      <span className="text-[10px] text-brand-700 dark:text-brand-300">
                                        {item.promoNote}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => removeItem(item.productId, item.supplierId)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-colors shrink-0 self-start"
                                >
                                  <Trash size={13} weight="light" />
                                </button>
                              </div>

                              <div className="flex items-center justify-end gap-4 mt-3">
                                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                                  <button
                                    onClick={() => updateQty(item.productId, item.supplierId, item.quantity - 1)}
                                    className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                  >
                                    <Minus size={11} weight="bold" />
                                  </button>
                                  <span className="w-8 text-center text-xs font-semibold text-foreground">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQty(item.productId, item.supplierId, item.quantity + 1)}
                                    className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                  >
                                    <Plus size={11} weight="bold" />
                                  </button>
                                </div>
                                <div className="text-right min-w-[90px]">
                                  {item.originalPrice && (
                                    <p className="text-[10px] text-muted-foreground line-through">
                                      {(item.originalPrice * item.quantity).toLocaleString('en', { minimumFractionDigits: 2 })} SAR
                                    </p>
                                  )}
                                  <p className="text-sm font-bold text-foreground">
                                    {(item.price * item.quantity).toLocaleString('en', { minimumFractionDigits: 2 })} SAR
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Desktop layout — unchanged */}
                            <div className="hidden sm:flex items-start gap-4">
                              <CheckCircle size={16} weight="fill" className="text-brand-700 shrink-0 mt-1" />

                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                                <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground leading-snug">
                                  <span className="text-brand-700 dark:text-brand-300">{item.productTitle.split(' ')[0]}</span>
                                  {' '}{item.productTitle.split(' ').slice(1).join(' ')}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.unit}</p>
                                <div className="flex flex-col gap-0.5 mt-1.5">
                                  <div className="flex items-center gap-1">
                                    <Truck size={10} weight="light" className="text-emerald-500" />
                                    <span className="text-[10px] text-emerald-600">{item.deliveryDays}</span>
                                  </div>
                                  {item.promoNote && (
                                    <div className="flex items-center gap-1">
                                      <Tag size={10} weight="light" className="text-brand-700" />
                                      <span className="text-[10px] text-brand-700 dark:text-brand-300">{item.promoNote}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                                  <button
                                    onClick={() => updateQty(item.productId, item.supplierId, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                                  >
                                    <Minus size={11} weight="bold" />
                                  </button>
                                  <span className="w-10 text-center text-xs font-semibold">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQty(item.productId, item.supplierId, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                                  >
                                    <Plus size={11} weight="bold" />
                                  </button>
                                </div>

                                <div className="flex flex-col items-end gap-1.5 w-[90px]">
                                  <button
                                    onClick={() => removeItem(item.productId, item.supplierId)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-colors self-end"
                                  >
                                    <Trash size={13} weight="light" />
                                  </button>
                                  {item.originalPrice && (
                                    <p className="text-xs text-muted-foreground line-through text-right">
                                      {(item.originalPrice * item.quantity).toLocaleString('en', { minimumFractionDigits: 2 })} SAR
                                    </p>
                                  )}
                                  <p className="text-sm font-bold text-foreground text-right">
                                    {(item.price * item.quantity).toLocaleString('en', { minimumFractionDigits: 2 })} SAR
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* ───── STEP 2: Payment ───── */}
            {step === 2 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => goToStep(1)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={14} weight="light" /> Back to Review
                  </button>
                </div>

                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <div
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={cn(
                        'rounded-2xl border cursor-pointer transition-all duration-150 overflow-hidden',
                        isSelected
                          ? 'border-brand-700 bg-card shadow-sm'
                          : 'border-border bg-card hover:border-brand-700/40'
                      )}
                    >
                      {/* Method row */}
                      <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                            isSelected ? 'border-brand-700' : 'border-muted-foreground/40'
                          )}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-700" />}
                          </div>
                          {pm.id === 'credit' && <CreditCard size={18} weight="light" className="text-muted-foreground" />}
                          {pm.id === 'cash'   && <Money size={18} weight="light" className="text-muted-foreground" />}
                          {pm.id === 'applepay' && <AppleLogo size={18} weight="fill" className="text-foreground" />}
                          {pm.id === 'googlepay' && <GoogleLogo size={18} weight="bold" className="text-red-500" />}
                          {(pm.id === 'tabby' || pm.id === 'tamara') && <Circle size={18} weight="light" className="text-muted-foreground" />}
                          <div>
                            <span className="text-sm font-semibold text-foreground">{pm.label}</span>
                            {pm.sub && (
                              <p className="text-[10px] text-muted-foreground">{pm.sub}</p>
                            )}
                          </div>
                        </div>
                        <PaymentIcon method={pm.id} />
                      </div>

                      {/* Credit card form — inline expand */}
                      {isSelected && pm.id === 'credit' && (
                        <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                          {/* Card number */}
                          <div>
                            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                              Card Number
                            </label>
                            <div className={cn(
                              'flex items-center px-4 py-3 rounded-xl border transition-all',
                              cardFocused === 'number'
                                ? 'border-brand-700/60 ring-2 ring-brand-700/10'
                                : 'border-border hover:border-border/70'
                            )}>
                              <input
                                type="text"
                                placeholder="12## #### #### 3456"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                onFocus={() => setCardFocused('number')}
                                onBlur={() => setCardFocused(null)}
                                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none font-mono tracking-widest"
                              />
                              <CreditCard size={16} weight="light" className="text-muted-foreground shrink-0 ml-2" />
                            </div>
                          </div>

                          {/* Name */}
                          <div>
                            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                              Holder's Name
                            </label>
                            <input
                              type="text"
                              placeholder="Card Holder"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              onFocus={() => setCardFocused('name')}
                              onBlur={() => setCardFocused(null)}
                              className={cn(
                                'w-full px-4 py-3 rounded-xl border text-sm text-foreground placeholder:text-muted-foreground/50 bg-transparent outline-none transition-all',
                                cardFocused === 'name'
                                  ? 'border-brand-700/60 ring-2 ring-brand-700/10'
                                  : 'border-border hover:border-border/70'
                              )}
                            />
                          </div>

                          {/* Expiry + CVV */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Expire Date
                              </label>
                              <input
                                type="text"
                                placeholder="MM / YY"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                onFocus={() => setCardFocused('expiry')}
                                onBlur={() => setCardFocused(null)}
                                className={cn(
                                  'w-full px-4 py-3 rounded-xl border text-sm text-foreground placeholder:text-muted-foreground/50 bg-transparent outline-none transition-all font-mono',
                                  cardFocused === 'expiry'
                                    ? 'border-brand-700/60 ring-2 ring-brand-700/10'
                                    : 'border-border hover:border-border/70'
                                )}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                CVV
                              </label>
                              <div className="relative">
                                <input
                                  type="password"
                                  placeholder="•••"
                                  maxLength={4}
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                  onFocus={() => setCardFocused('cvv')}
                                  onBlur={() => setCardFocused(null)}
                                  className={cn(
                                    'w-full px-4 py-3 rounded-xl border text-sm text-foreground placeholder:text-muted-foreground/50 bg-transparent outline-none transition-all font-mono',
                                    cardFocused === 'cvv'
                                      ? 'border-brand-700/60 ring-2 ring-brand-700/10'
                                      : 'border-border hover:border-border/70'
                                  )}
                                />
                                <Lock size={13} weight="light" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                              </div>
                            </div>
                          </div>

                          {/* Security note */}
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <ShieldCheck size={12} weight="light" className="text-emerald-500" />
                            Your card details are encrypted and secure.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN: Order Summary ── */}
          <OrderSummary showActions />
        </div>
      </div>

      {/* Progress bar animation keyframe */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </>
  );
}
