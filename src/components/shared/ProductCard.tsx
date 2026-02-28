import { Star, ArrowRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { Product, BadgeType } from '@/data/productsData';

const BADGE_CONFIG: Record<NonNullable<BadgeType>, { label: string; className: string }> = {
  NEW: {
    label: 'NEW',
    className: 'bg-emerald-500 text-white',
  },
  SALE: {
    label: 'SALE',
    className: 'bg-brand-700 text-white',
  },
  'BEST SELLER': {
    label: 'BEST SELLER',
    className: 'bg-gold-400 text-brand-900',
  },
  LIMITED: {
    label: 'LIMITED',
    className: 'bg-red-500 text-white',
  },
};

interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
  onViewDetail?: (id: string) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i;
        const partial = !filled && rating > i - 1;
        return (
          <span key={i} className="relative inline-block">
            <Star
              size={11}
              weight="regular"
              className="text-muted-foreground/30"
            />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: partial ? `${(rating - (i - 1)) * 100}%` : '100%' }}
              >
                <Star size={11} weight="fill" className="text-gold-400" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export function ProductCard({ product, onAddToCart, onViewDetail }: ProductCardProps) {
  const badgeConf = product.badge ? BADGE_CONFIG[product.badge] : null;
  const primarySupplier = product.suppliers[0];
  const extraSuppliers = product.suppliers.length - 1;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden',
        'bg-card border border-border',
        'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5',
        'cursor-pointer'
      )}
      onClick={() => onViewDetail?.(product.id)}
    >
      {/* Image container */}
      <div
        className="relative overflow-hidden bg-white dark:bg-white/5"
        style={{ height: '200px' }}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {badgeConf && (
            <span
              className={cn(
                'text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md leading-none w-fit',
                badgeConf.className
              )}
            >
              {badgeConf.label}
            </span>
          )}
          {discount && (
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md leading-none w-fit bg-brand-700 text-white">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category label */}
        <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-300">
          {product.category}
        </span>

        {/* Title */}
        <h3
          className="text-sm font-semibold text-foreground leading-snug"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-[10px] font-semibold text-gold-400">{product.rating}</span>
          <span className="text-[10px] text-muted-foreground">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* ─── AGGREGATION BOX ─── */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border">
          {/* Supplier avatar stack */}
          <div className="flex items-center -space-x-2 shrink-0">
            {product.suppliers.slice(0, 3).map((sup, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white ring-2 ring-card shrink-0"
                style={{ background: sup.color, zIndex: 3 - i }}
                title={sup.name}
              >
                {sup.logo.charAt(0)}
              </div>
            ))}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-semibold text-foreground truncate leading-tight">
              {primarySupplier.name}
            </span>
            {extraSuppliers > 0 && (
              <span className="text-[10px] text-brand-700 dark:text-brand-300 font-medium leading-tight">
                +{extraSuppliers} Suppliers
              </span>
            )}
          </div>
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between mt-auto pt-1">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground leading-none mb-1">Start from</span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-foreground">
                {product.price.toFixed(2)}{' '}
                <span className="text-xs font-semibold text-muted-foreground">SAR</span>
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5">{product.unit}</span>
          </div>

          {/* Detail arrow button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail?.(product.id);
            }}
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
              'bg-brand-700 text-white',
              'hover:bg-brand-800 transition-colors shadow-sm',
              'group-hover:shadow-glow'
            )}
          >
            <ArrowRight size={15} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
