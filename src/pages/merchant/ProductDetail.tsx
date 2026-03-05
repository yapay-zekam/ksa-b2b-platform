import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  CaretRight,
  Heart,
  ShareNetwork,
  ShoppingCartSimple,
  Truck,
  ShieldCheck,
  Clock,
  Package,
  CheckCircle,
  Warning,
  SealCheck,
  ChartBar,
  FileText,
  Question,
  Storefront,
  ArrowLeft,
  Minus,
  Plus,
  Barcode,
  Tag,
  Globe,
  CalendarBlank,
  Snowflake,
  Info,
  Handshake,
} from '@phosphor-icons/react';
import { ProductCard } from '@/components/shared/ProductCard';
import { cn } from '@/lib/utils';
import { products, getProductDetail } from '@/data/productsData';
import type { SupplierOffer } from '@/data/productsData';
import { useCart } from '@/context/CartContext';

/* ─────────── Star rating strip ─────────── */
function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i;
        const partial = !filled && rating > i - 1;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} weight="regular" className="text-muted-foreground/30" />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: partial ? `${(rating - (i - 1)) * 100}%` : '100%' }}
              >
                <Star size={size} weight="fill" className="text-gold-400" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

/* ─────────── Supplier offer row ─────────── */
function SupplierRow({
  offer,
  displayPrice,
  selected,
  onSelect,
  onAddToCart,
}: {
  offer: SupplierOffer;
  displayPrice: number;
  selected: boolean;
  onSelect: () => void;
  onAddToCart: () => void;
}) {
  const stockStatus =
    offer.stock > 500 ? 'In Stock' : offer.stock > 50 ? 'Low Stock' : 'Critical';
  const stockColor =
    offer.stock > 500 ? 'text-emerald-500' : offer.stock > 50 ? 'text-amber-500' : 'text-red-500';

  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative flex flex-col gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-150',
        selected
          ? 'border-brand-700 bg-brand-700/5 shadow-sm'
          : 'border-border bg-card hover:border-brand-700/40 hover:bg-muted/30'
      )}
    >
      {/* Best Price badge */}
      {offer.isBestPrice && (
        <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold-400 text-brand-900 text-[9px] font-bold uppercase tracking-widest shadow-sm">
          <Star size={8} weight="fill" /> Best Price
        </span>
      )}

      {/* Row 1: Logo + Name + Rating + Price */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
          style={{ background: offer.color }}
        >
          {offer.logo}
        </div>

        {/* Name + rating */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-foreground truncate">{offer.name}</span>
            {offer.isVerified && (
              <SealCheck size={13} weight="fill" className="text-brand-700 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <StarRow rating={offer.rating} size={11} />
            <span className="text-[10px] font-semibold text-gold-400">{offer.rating}</span>
            <span className="text-[10px] text-muted-foreground">({offer.reviewCount})</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <div className="flex items-baseline gap-1.5 justify-end">
            <span className="text-base font-bold text-foreground">
              {displayPrice.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground font-medium">SAR</span>
          </div>
          {offer.originalPrice && (
            <span className="text-[10px] text-muted-foreground line-through block">
              {(offer.originalPrice * (displayPrice / offer.price)).toFixed(2)} SAR
            </span>
          )}
        </div>
      </div>

      {/* Row 2: Meta chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-lg">
          <Truck size={11} weight="light" />
          {offer.deliveryDays}
        </span>
        <span className={cn('inline-flex items-center gap-1 text-[10px] bg-muted px-2 py-1 rounded-lg', stockColor)}>
          <Package size={11} weight="light" />
          {stockStatus} ({offer.stock.toLocaleString()} units)
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-lg">
          <ShoppingCartSimple size={11} weight="light" />
          Min. {offer.minOrder} units
        </span>
      </div>

      {/* Row 3: Add to cart */}
      <button
        onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
        className="w-full py-2 rounded-xl bg-brand-700 text-white text-xs font-semibold hover:bg-brand-800 transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingCartSimple size={13} weight="bold" />
        Add to Cart — {displayPrice.toFixed(2)} SAR
      </button>
    </div>
  );
}

/* ─────────── Tab content ─────────── */
type Tab = 'Description' | 'Reviews' | 'Offers' | 'Conditions & Nutrition' | 'FAQ' | 'Supplier Profile';

const TABS: Tab[] = ['Description', 'Reviews', 'Offers', 'Conditions & Nutrition', 'FAQ', 'Supplier Profile'];

const TAB_ICONS: Record<Tab, React.ElementType> = {
  Description: FileText,
  Reviews: Star,
  Offers: Tag,
  'Conditions & Nutrition': ChartBar,
  FAQ: Question,
  'Supplier Profile': Storefront,
};

/* ─────────── Main Page ─────────── */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const detail = getProductDetail(id ?? '');

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>('Description');
  const [wishlist, setWishlist] = useState(false);
  const [cartAdded, setCartAdded] = useState<string[]>([]);

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-lg font-semibold text-foreground mb-2">Product not found</p>
        <button onClick={() => navigate('/merchant/products')} className="text-sm text-brand-700 hover:underline">
          ← Back to Products
        </button>
      </div>
    );
  }

  const activeSupplier    = detail.supplierOffers[selectedSupplier];
  const activeVariant     = detail.variants[selectedVariant];
  /* Scale supplier prices by the ratio of selected variant vs base variant */
  const variantMultiplier = activeVariant.price / detail.variants[0].price;
  const adjustedPrice     = (offer: typeof detail.supplierOffers[number]) =>
    offer.price * variantMultiplier;

  const relatedProducts = products
    .filter((p) => p.category === detail.category && p.id !== detail.id)
    .slice(0, 4);

  const handleAddToCart = (offer: typeof detail.supplierOffers[number]) => {
    if (!detail) return;
    addItem({
      productId:     detail.id,
      productTitle:  detail.title,
      productImage:  detail.images[0],
      supplierId:    offer.id,
      supplierName:  offer.name,
      supplierLogo:  offer.logo,
      supplierColor: offer.color,
      price:         adjustedPrice(offer),
      originalPrice: offer.originalPrice ? offer.originalPrice * variantMultiplier : undefined,
      unit:          activeVariant.label,
      deliveryDays:  offer.deliveryDays,
      quantity,
    });
    setCartAdded((prev) => (prev.includes(offer.id) ? prev : [...prev, offer.id]));
    openCart();
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/merchant/products" className="hover:text-foreground transition-colors">Products</Link>
        <CaretRight size={11} />
        <span className="hover:text-foreground transition-colors cursor-pointer">{detail.category}</span>
        <CaretRight size={11} />
        <span className="text-foreground font-medium truncate max-w-[260px]">{detail.title}</span>
      </nav>

      {/* Back button (mobile) */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors sm:hidden"
      >
        <ArrowLeft size={14} weight="light" /> Back
      </button>

      {/* ═══════════ 3-COLUMN LAYOUT ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_minmax(0,2.5fr)] gap-6 items-start">

        {/* ── LEFT: Gallery ── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative rounded-2xl overflow-hidden bg-muted border border-border aspect-square">
            <img
              src={detail.images[selectedImage]}
              alt={detail.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {/* Badge overlay */}
            {detail.badge && (
              <div className="absolute top-3 left-3">
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg',
                    detail.badge === 'BEST SELLER' ? 'bg-gold-400 text-brand-900' :
                    detail.badge === 'NEW' ? 'bg-emerald-500 text-white' :
                    detail.badge === 'LIMITED' ? 'bg-red-500 text-white' :
                    'bg-brand-700 text-white'
                  )}
                >
                  {detail.badge}
                </span>
              </div>
            )}
            {/* Nav arrows */}
            {detail.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((i) => (i === 0 ? detail.images.length - 1 : i - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-sm"
                >
                  <CaretRight size={14} className="rotate-180" />
                </button>
                <button
                  onClick={() => setSelectedImage((i) => (i === detail.images.length - 1 ? 0 : i + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-sm"
                >
                  <CaretRight size={14} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {detail.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  'aspect-square rounded-xl overflow-hidden border-2 transition-all',
                  selectedImage === i
                    ? 'border-brand-700 shadow-glow'
                    : 'border-border hover:border-brand-700/40'
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Quick info pills */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border">
              <Barcode size={14} className="text-muted-foreground shrink-0" weight="light" />
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">SKU</p>
                <p className="text-[10px] font-mono font-semibold text-foreground">{detail.sku}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border">
              <Globe size={14} className="text-muted-foreground shrink-0" weight="light" />
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Origin</p>
                <p className="text-[10px] font-semibold text-foreground">{detail.countryOfOrigin}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border">
              <CalendarBlank size={14} className="text-muted-foreground shrink-0" weight="light" />
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Shelf Life</p>
                <p className="text-[10px] font-semibold text-foreground truncate">{detail.shelfLife}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border">
              <Snowflake size={14} className="text-muted-foreground shrink-0" weight="light" />
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Storage</p>
                <p className="text-[10px] font-semibold text-foreground truncate">{detail.storageConditions.split('.')[0]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── MIDDLE: Product Info ── */}
        <div className="space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300">
                  {detail.brand} · {detail.category}
                </span>
                <h1 className="text-xl font-extrabold text-foreground mt-1 leading-tight">
                  {detail.title}
                </h1>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setWishlist((w) => !w)}
                  className={cn(
                    'p-2.5 rounded-xl border transition-all',
                    wishlist
                      ? 'border-red-400 bg-red-50 text-red-500 dark:bg-red-900/20'
                      : 'border-border hover:border-red-300 text-muted-foreground hover:text-red-400'
                  )}
                >
                  <Heart size={16} weight={wishlist ? 'fill' : 'light'} />
                </button>
                <button className="p-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <ShareNetwork size={16} weight="light" />
                </button>
              </div>
            </div>

            {/* Rating row */}
            <div className="flex items-center gap-3 mt-3">
              <StarRow rating={detail.rating} size={15} />
              <span className="text-sm font-bold text-gold-400">{detail.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({detail.reviewCount.toLocaleString()} reviews)
              </span>
              <span className="text-xs text-brand-700 dark:text-brand-300 hover:underline cursor-pointer font-medium">
                Write a review
              </span>
            </div>

            {/* Certifications */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {detail.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                >
                  <ShieldCheck size={10} weight="fill" />
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              About this product
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{detail.description}</p>
          </div>

          {/* Allergen warning */}
          {detail.allergens && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-900/15 dark:border-amber-800/40">
              <Warning size={15} weight="fill" className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <span className="font-semibold">Allergen Info: </span>{detail.allergens}
              </p>
            </div>
          )}

          {/* Variant selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Size / Variant
              </h3>
              <span className="text-xs text-brand-700 dark:text-brand-300 font-medium">
                Selected: {activeVariant.label}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {detail.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => v.available && setSelectedVariant(i)}
                  disabled={!v.available}
                  className={cn(
                    'relative flex flex-col items-center px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all',
                    !v.available && 'opacity-40 cursor-not-allowed',
                    v.available && selectedVariant === i
                      ? 'border-brand-700 bg-brand-700/10 text-brand-700 dark:text-brand-300 shadow-sm'
                      : v.available
                      ? 'border-border text-foreground hover:border-brand-700/40 hover:bg-muted/50'
                      : ''
                  )}
                >
                  <span>{v.label}</span>
                  <span
                    className={cn(
                      'text-[10px] font-medium mt-0.5',
                      selectedVariant === i ? 'text-brand-700 dark:text-brand-300' : 'text-muted-foreground'
                    )}
                  >
                    {v.price.toFixed(2)} SAR
                  </span>
                  {!v.available && (
                    <span className="absolute -top-1.5 -right-1 text-[8px] bg-red-500 text-white px-1 rounded-full">
                      OOS
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Other Suppliers (compact list) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Other Suppliers — All ({detail.supplierOffers.length})
              </h3>
              <span className="text-xs text-brand-700 dark:text-brand-300 font-medium cursor-pointer hover:underline">
                Compare all
              </span>
            </div>
            <div className="space-y-2">
              {detail.supplierOffers.map((offer, i) => {
                const isSelected = selectedSupplier === i;
                return (
                  <div
                    key={offer.id}
                    onClick={() => setSelectedSupplier(i)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                      isSelected
                        ? 'border-brand-700 bg-brand-700/5'
                        : 'border-border hover:border-brand-700/30 hover:bg-muted/20'
                    )}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                      style={{ background: offer.color }}
                    >
                      {offer.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-foreground truncate">{offer.name}</span>
                        {offer.isVerified && (
                          <SealCheck size={11} weight="fill" className="text-brand-700 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRow rating={offer.rating} size={10} />
                        <span className="text-[10px] text-muted-foreground">
                          {offer.deliveryDays}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-foreground">{adjustedPrice(offer).toFixed(2)}</span>
                      <span className="text-[10px] text-muted-foreground ml-0.5">SAR</span>
                      {offer.isBestPrice && (
                        <span className="block text-[9px] font-bold text-gold-500">BEST PRICE</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Supplier Detail Panel ── */}
        <div className="space-y-4 lg:sticky lg:top-20">
          {/* Supplier Card */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Header */}
            <div
              className="px-5 py-4 border-b border-border"
              style={{
                background: `linear-gradient(135deg, ${activeSupplier?.color}15, transparent)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                  style={{ background: activeSupplier?.color }}
                >
                  {activeSupplier?.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-foreground truncate">
                      {activeSupplier?.name}
                    </span>
                    {activeSupplier?.isVerified && (
                      <SealCheck size={14} weight="fill" className="text-brand-700 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <StarRow rating={activeSupplier?.rating ?? 0} size={11} />
                    <span className="text-[10px] text-gold-400 font-semibold">{activeSupplier?.rating}</span>
                    <span className="text-[10px] text-muted-foreground">
                      ({activeSupplier?.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price block */}
            <div className="px-5 py-4 border-b border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Price</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-foreground">
                  {activeSupplier ? adjustedPrice(activeSupplier).toFixed(2) : '—'}
                </span>
                <span className="text-base font-semibold text-muted-foreground">SAR</span>
                {activeSupplier?.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {(activeSupplier.originalPrice * variantMultiplier).toFixed(2)} SAR
                  </span>
                )}
                {activeSupplier?.isBestPrice && (
                  <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-400 text-brand-900 text-[9px] font-bold uppercase tracking-widest">
                    <Star size={8} weight="fill" /> Best Price
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Per unit · Min. order {activeSupplier?.minOrder} units
              </p>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
              {[
                { icon: Truck,        label: 'Delivery',    value: activeSupplier?.deliveryDays ?? '—' },
                { icon: Package,      label: 'Stock',       value: activeSupplier ? `${(activeSupplier.stock / 1000).toFixed(1)}k` : '—' },
                { icon: ShieldCheck,  label: 'Verified',    value: activeSupplier?.isVerified ? 'Yes' : 'No' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center py-3 px-2 text-center">
                  <Icon size={15} weight="light" className="text-brand-700 mb-1" />
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</span>
                  <span className="text-xs font-bold text-foreground mt-0.5">{value}</span>
                </div>
              ))}
            </div>

            {/* Quantity picker in right panel */}
            <div className="px-5 py-4 border-b border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Quantity</span>
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <Minus size={12} weight="bold" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <Plus size={12} weight="bold" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-muted/60">
                <span className="text-xs text-muted-foreground">Total estimate</span>
                <span className="text-sm font-bold text-foreground">
                  {(activeSupplier ? adjustedPrice(activeSupplier) * quantity : 0).toFixed(2)} SAR
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="px-5 py-4 space-y-2.5">
              <button
                onClick={() => activeSupplier && handleAddToCart(activeSupplier)}
                className={cn(
                  'w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all',
                  cartAdded.includes(activeSupplier?.id ?? '')
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-700 text-white hover:bg-brand-800 shadow-sm hover:shadow-glow'
                )}
              >
                {cartAdded.includes(activeSupplier?.id ?? '') ? (
                  <>
                    <CheckCircle size={16} weight="fill" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCartSimple size={16} weight="bold" /> Add to Cart
                  </>
                )}
              </button>
              <button className="w-full py-3 rounded-xl border border-brand-700 text-brand-700 dark:text-brand-300 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-brand-700/5 transition-colors">
                <Handshake size={15} weight="light" /> Create New Contract
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: Truck,       title: 'Fast Delivery',    sub: 'Same-day dispatch' },
              { icon: ShieldCheck, title: 'Secure Payment',   sub: 'SFDA regulated' },
              { icon: Clock,       title: '24/7 Support',     sub: 'Dedicated account' },
              { icon: Info,        title: 'Money-Back Guarantee', sub: 'Dispute within 7 days' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-2.5 p-3 rounded-xl bg-card border border-border">
                <div className="w-7 h-7 rounded-lg bg-brand-700/10 flex items-center justify-center shrink-0">
                  <Icon size={13} weight="light" className="text-brand-700" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-foreground leading-tight">{title}</p>
                  <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ TABS SECTION ═══════════ */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center gap-0 border-b border-border overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = TAB_ICONS[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px',
                  activeTab === tab
                    ? 'border-brand-700 text-brand-700 dark:text-brand-300'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon size={13} weight="light" />
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'Description' && (
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl">
              <p>{detail.description}</p>
              <ul className="space-y-2 list-none">
                {[
                  `Brand: ${detail.brand}`,
                  `Category: ${detail.category}`,
                  `Country of Origin: ${detail.countryOfOrigin}`,
                  `Shelf Life: ${detail.shelfLife}`,
                  `Storage: ${detail.storageConditions}`,
                  `Allergens: ${detail.allergens}`,
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle size={14} weight="fill" className="text-brand-700 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'Conditions & Nutrition' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Info size={13} weight="light" />
                Serving size: 200 ml · Servings per container: ~10
              </div>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Nutrient</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Per 100g</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Per Serving</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {detail.nutritionInfo.map((row) => (
                      <tr key={row.label} className="hover:bg-[#3D005E]/5 transition-colors">
                        <td className="px-4 py-2.5 text-xs text-foreground font-medium">{row.label}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground text-right">{row.per100g}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground text-right">{row.perServing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div className="flex flex-col items-center py-10 text-center gap-3">
              <div className="text-5xl font-extrabold text-foreground">{detail.rating}</div>
              <StarRow rating={detail.rating} size={20} />
              <p className="text-sm text-muted-foreground">
                Based on {detail.reviewCount.toLocaleString()} verified purchases
              </p>
              <button className="mt-2 px-4 py-2 rounded-xl bg-brand-700 text-white text-xs font-semibold hover:bg-brand-800 transition-colors">
                Write a Review
              </button>
            </div>
          )}

          {activeTab === 'Offers' && (
            <div className="space-y-3 max-w-2xl">
              {detail.supplierOffers.map((offer, i) => (
                <SupplierRow
                  key={offer.id}
                  offer={offer}
                  displayPrice={adjustedPrice(offer)}
                  selected={selectedSupplier === i}
                  onSelect={() => setSelectedSupplier(i)}
                  onAddToCart={() => handleAddToCart(offer)}
                />
              ))}
            </div>
          )}

          {activeTab === 'FAQ' && (
            <div className="space-y-3 max-w-2xl">
              {[
                { q: 'What is the minimum order quantity?',       a: `The minimum order quantity varies by supplier. The current selected supplier requires a minimum of ${activeSupplier?.minOrder} units per order.` },
                { q: 'Is this product Halal certified?',          a: 'Yes. All products on Suptomer must carry valid Halal certification issued by a recognized Saudi authority.' },
                { q: 'How long does delivery take?',              a: `Delivery times vary by supplier. The selected supplier delivers in ${activeSupplier?.deliveryDays}.` },
                { q: 'Can I return or exchange this product?',    a: 'Returns are accepted within 7 days of delivery if the product is damaged, expired, or does not match the listing description.' },
                { q: 'Are bulk discounts available?',             a: 'Yes. Contact the supplier directly via the platform messaging system to negotiate bulk pricing and contract terms.' },
              ].map(({ q, a }) => (
                <div key={q} className="p-4 rounded-xl border border-border bg-muted/20">
                  <p className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-2">
                    <Question size={13} weight="fill" className="text-brand-700 shrink-0" />
                    {q}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-5">{a}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Supplier Profile' && (
            <div className="flex flex-col items-center py-10 text-center gap-3">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-sm"
                style={{ background: activeSupplier?.color }}
              >
                {activeSupplier?.logo}
              </div>
              <h3 className="text-base font-bold text-foreground">{activeSupplier?.name}</h3>
              <div className="flex items-center gap-2">
                <StarRow rating={activeSupplier?.rating ?? 0} size={14} />
                <span className="text-sm font-bold text-gold-400">{activeSupplier?.rating}</span>
                <span className="text-xs text-muted-foreground">({activeSupplier?.reviewCount} reviews)</span>
              </div>
              <button className="mt-2 px-5 py-2.5 rounded-xl bg-brand-700 text-white text-xs font-semibold hover:bg-brand-800 transition-colors flex items-center gap-2">
                <Storefront size={13} weight="light" /> View Full Supplier Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ RELATED PRODUCTS ═══════════ */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">Related Products</h2>
            <Link
              to="/merchant/products"
              className="text-xs text-brand-700 dark:text-brand-300 hover:underline font-medium flex items-center gap-1"
            >
              View all <CaretRight size={11} weight="bold" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={(pid) => navigate(`/merchant/products/${pid}`)}
                onAddToCart={(pid) => console.log('add', pid)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
