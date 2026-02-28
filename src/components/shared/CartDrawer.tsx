import { useNavigate } from 'react-router-dom';
import {
  X,
  Minus,
  Plus,
  Trash,
  ShoppingCartSimple,
  ArrowRight,
  Tag,
  Truck,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

/* Group items by supplierId so we can render supplier sections */
function groupBySupplier(items: ReturnType<typeof useCart>['items']) {
  const map = new Map<string, { supplierName: string; supplierLogo: string; supplierColor: string; items: typeof items }>();
  for (const item of items) {
    const key = item.supplierId;
    if (!map.has(key)) {
      map.set(key, {
        supplierName: item.supplierName,
        supplierLogo: item.supplierLogo,
        supplierColor: item.supplierColor,
        items: [],
      });
    }
    map.get(key)!.items.push(item);
  }
  return Array.from(map.values());
}

const SHIPPING_THRESHOLD = 500;

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : 100;
  const vat = subtotal * 0.15;
  const discount = subtotal * 0.01;
  const total = subtotal + shipping + vat - discount;

  const groups = groupBySupplier(items);

  const handleCheckout = () => {
    closeCart();
    navigate('/merchant/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={cn(
          'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-full z-50 w-full sm:w-[480px] flex flex-col',
          'bg-background border-l border-border shadow-2xl',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-700/10 flex items-center justify-center">
              <ShoppingCartSimple size={18} weight="light" className="text-brand-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">My Cart</h2>
              <p className="text-[10px] text-muted-foreground">{totalItems} items</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <ShoppingCartSimple size={28} weight="light" className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Your cart is empty</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Browse products and add items to your cart.
                </p>
              </div>
              <button
                onClick={() => { closeCart(); navigate('/merchant/products'); }}
                className="px-4 py-2 rounded-xl bg-brand-700 text-white text-xs font-semibold hover:bg-brand-800 transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {groups.map((group) => {
                const groupTotal = group.items.reduce(
                  (s, i) => s + i.price * i.quantity, 0
                );
                const toFreeShipping = SHIPPING_THRESHOLD - groupTotal;
                return (
                  <div key={group.supplierName} className="rounded-2xl border border-border overflow-hidden">
                    {/* Supplier header */}
                    <div
                      className="flex items-center justify-between px-4 py-2.5 border-b border-border"
                      style={{ background: 'linear-gradient(135deg, rgba(61, 0, 94, 0.082), transparent)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                          style={{ background: group.supplierColor }}
                        >
                          {group.supplierLogo}
                        </div>
                        <span className="text-[11px] font-semibold text-foreground">
                          {group.supplierName}
                        </span>
                      </div>
                      {toFreeShipping > 0 ? (
                        <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                          <Truck size={11} weight="light" />
                          Add {toFreeShipping.toFixed(0)} SAR for free shipping
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600">
                          <Truck size={11} weight="light" />
                          Free Shipping
                        </div>
                      )}
                    </div>

                    {/* Items in group */}
                    <div className="divide-y divide-border">
                      {group.items.map((item) => (
                        <div key={`${item.productId}-${item.supplierId}`} className="p-4">
                          <div className="flex gap-3">
                            {/* Image */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                              <img
                                src={item.productImage}
                                alt={item.productTitle}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                                {item.productTitle}
                              </p>
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

                            {/* Remove */}
                            <button
                              onClick={() => removeItem(item.productId, item.supplierId)}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-colors shrink-0 self-start"
                            >
                              <Trash size={13} weight="light" />
                            </button>
                          </div>

                          {/* Qty + Price row — right-aligned */}
                          <div className="flex items-center justify-end gap-4 mt-3">
                            {/* Qty stepper */}
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

                            {/* Price */}
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
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer summary + CTA */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-border bg-card">
            {/* Totals */}
            <div className="px-5 py-4 space-y-2">
              {[
                { label: 'Subtotal',     value: subtotal,  color: '' },
                { label: 'Shipping',     value: shipping,  color: shipping === 0 ? 'text-emerald-500' : '' },
                { label: 'VAT 15%',      value: vat,       color: '' },
                { label: 'Discount',     value: -discount, color: 'text-emerald-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={cn('font-semibold text-foreground', color)}>
                    {value < 0 ? '-' : ''}{Math.abs(value).toLocaleString('en', { minimumFractionDigits: 2 })} SAR
                    {label === 'Shipping' && value === 0 && ' (Free)'}
                  </span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">Total Amount</span>
                <span className="text-base font-extrabold text-brand-700 dark:text-brand-300">
                  {total.toLocaleString('en', { minimumFractionDigits: 2 })} SAR
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="px-5 pb-5">
              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl bg-brand-700 text-white font-bold text-sm hover:bg-brand-800 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-glow"
              >
                Proceed to Checkout
                <ArrowRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
