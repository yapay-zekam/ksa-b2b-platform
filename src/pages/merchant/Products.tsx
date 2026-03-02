import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass,
  Funnel,
  SortAscending,
  GridFour,
  List,
  Tag,
  CaretRight,
  Sparkle,
  SpinnerGap,
} from '@phosphor-icons/react';
import { ProductCard } from '@/components/shared/ProductCard';
import { cn } from '@/lib/utils';
import { products, categories } from '@/data/productsData';

const PAGE_SIZE = 12;

/* ─── Banner data ─── */
const heroBanners = [
  {
    id: 'hero',
    title: 'We Provide Best and Natural',
    subtitle: 'Premium quality products sourced from top-tier Saudi & international suppliers.',
    cta: 'Explore Now',
    bg: 'from-brand-900 via-brand-800 to-brand-700',
    accent: '#FFD680',
    image: '/product-images/banner-1.png',
  },
];

const sideBanners = [
  {
    id: 's1',
    title: 'Always be',
    subtitle: 'one step ahead with Suptomer',
    cta: 'Get Started',
    bg: 'from-brand-700 to-brand-900',
    tag: 'Platform',
    image: '/product-images/banner-2.png',
  },
  {
    id: 's2',
    title: 'Don\'t miss the discounts',
    subtitle: 'Get the best deals on the beverage category',
    cta: 'View Discounts',
    bg: 'from-violet-900 to-brand-700',
    tag: 'Discount',
    image: '/product-images/banner-3.png',
  },
];

const SORT_OPTIONS = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Rated'];

export default function MerchantProducts() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (sort === 'Price: Low to High') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'Price: High to Low') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'Best Rated') result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [activeCategory, search, sort]);

  /* Reset visible count when filters change */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, search, sort]);

  /* Infinite scroll via IntersectionObserver */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filtered.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
            setIsLoadingMore(false);
          }, 400);
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  const visibleProducts = filtered.slice(0, visibleCount);

  return (
    <div className="space-y-6">

      {/* ─── BANNERS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {heroBanners.map((b) => (
          <div
            key={b.id}
            className={cn(
              'lg:col-span-2 relative rounded-2xl overflow-hidden flex flex-col justify-end',
              'bg-gradient-to-br',
              b.bg
            )}
            style={{ minHeight: '220px' }}
          >
            <img
              src={b.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-800/95 via-brand-800/40 to-transparent" />

            <div className="relative z-10 p-8 max-w-md">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-400 mb-3 bg-gold-400/10 px-2.5 py-1 rounded-full border border-gold-400/20">
                <Sparkle size={10} weight="fill" />
                Premium Quality
              </div>
              <h2 className="text-2xl font-extrabold text-white leading-tight mb-2 whitespace-pre-line">
                {b.title}
              </h2>
              <p className="text-sm text-white/60 mb-5 max-w-xs leading-relaxed">{b.subtitle}</p>
              <button
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: b.accent, color: '#3D005E' }}
              >
                {b.cta}
                <CaretRight size={14} weight="bold" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-4">
          {sideBanners.map((b) => (
            <div
              key={b.id}
              className={cn(
                'relative rounded-2xl overflow-hidden flex-1',
                'bg-gradient-to-br',
                b.bg
              )}
              style={{ minHeight: '96px' }}
            >
              <img
                src={b.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-800/95 via-brand-700/30 to-transparent" />

              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold-400/80 bg-gold-400/10 px-2 py-0.5 rounded-full">
                    {b.tag}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-2 leading-tight">{b.title}</h3>
                  <p className="text-[11px] text-white/50 mt-1 leading-tight">{b.subtitle}</p>
                </div>
                <button className="mt-3 self-start inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold bg-white/15 hover:bg-white/25 text-white transition-colors border border-white/10">
                  {b.cta} <CaretRight size={11} weight="bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TOP CATEGORIES ─── */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-3">Top Categories</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl border transition-all duration-150 group',
                activeCategory === cat.id
                  ? 'bg-brand-700 border-brand-700 text-white shadow-glow'
                  : 'bg-card border-border text-foreground hover:border-brand-700/40 hover:bg-brand-700/5'
              )}
            >
              <span className="text-xl leading-none">{cat.emoji}</span>
              <span
                className={cn(
                  'text-[10px] font-semibold text-center leading-tight',
                  activeCategory === cat.id ? 'text-white' : 'text-foreground'
                )}
              >
                {cat.label}
              </span>
              <span
                className={cn(
                  'text-[9px]',
                  activeCategory === cat.id ? 'text-white/60' : 'text-muted-foreground'
                )}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── SEARCH BAR ─── */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-card hover:border-brand-700/40 transition-colors focus-within:border-brand-700/60 focus-within:ring-2 focus-within:ring-brand-700/10">
        <MagnifyingGlass size={15} className="text-muted-foreground shrink-0" weight="light" />
        <input
          type="text"
          placeholder="Search products, brands, categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-muted-foreground hover:text-foreground text-xs px-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* ─── RESULTS COUNT + TOOLBAR (same row) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: count */}
        <div className="flex items-center gap-2">
          <Tag size={13} weight="light" className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-foreground">{Math.min(visibleCount, filtered.length)}</span>
            {' '}of{' '}
            <span className="font-semibold text-foreground">{filtered.length}</span> products
            {activeCategory !== 'all' && (
              <>
                {' '}in{' '}
                <span className="text-brand-700 dark:text-brand-300 font-semibold capitalize">
                  {categories.find((c) => c.id === activeCategory)?.label}
                </span>
              </>
            )}
          </span>
          {(activeCategory !== 'all' || search) && (
            <button
              onClick={() => { setActiveCategory('all'); setSearch(''); }}
              className="text-xs text-muted-foreground hover:text-foreground underline ml-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: sort + filter + view mode */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sort */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground">
            <SortAscending size={15} weight="light" className="text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent outline-none text-sm text-foreground cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Filter */}
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Funnel size={15} weight="light" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          {/* View mode */}
          <div className="flex items-center bg-muted rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-lg transition-all',
                viewMode === 'grid' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              )}
            >
              <GridFour size={16} weight="light" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-lg transition-all',
                viewMode === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              )}
            >
              <List size={16} weight="light" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── PRODUCT GRID / LIST ─── */}
      {visibleProducts.length > 0 ? (
        <div
          className={cn(
            'grid gap-4',
            viewMode === 'grid'
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1'
          )}
        >
          {visibleProducts.map((product) =>
            viewMode === 'grid' ? (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={(id) => navigate(`/merchant/products/${id}`)}
              />
            ) : (
              <div
                key={product.id}
                onClick={() => navigate(`/merchant/products/${product.id}`)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-white/5 shrink-0 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-300">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground mt-0.5 truncate">{product.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center -space-x-1.5">
                      {product.suppliers.slice(0, 3).map((s, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full ring-2 ring-card text-[8px] font-bold text-white flex items-center justify-center"
                          style={{ background: s.color }}
                        >
                          {s.logo.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {product.suppliers[0].name}
                      {product.suppliers.length > 1 && ` +${product.suppliers.length - 1} Suppliers`}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-muted-foreground">Start from</p>
                  <p className="text-base font-bold text-foreground">
                    {product.price.toFixed(2)}{' '}
                    <span className="text-xs font-medium text-muted-foreground">SAR</span>
                  </p>
                  {product.originalPrice && (
                    <p className="text-xs text-muted-foreground line-through">{product.originalPrice.toFixed(2)}</p>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/merchant/products/${product.id}`); }}
                  className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center hover:bg-brand-800 transition-colors shrink-0"
                >
                  <CaretRight size={14} weight="bold" />
                </button>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <MagnifyingGlass size={28} weight="light" className="text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Try adjusting your search or clearing the active category filter.
          </p>
          <button
            onClick={() => { setActiveCategory('all'); setSearch(''); }}
            className="mt-4 px-4 py-2 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ─── Infinite scroll sentinel ─── */}
      {visibleProducts.length > 0 && (
        <div ref={sentinelRef} className="flex items-center justify-center py-6">
          {isLoadingMore && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <SpinnerGap size={16} className="animate-spin text-brand-700" weight="bold" />
              Loading more products…
            </div>
          )}
          {!isLoadingMore && visibleCount >= filtered.length && filtered.length > 0 && (
            <p className="text-xs text-muted-foreground">
              All {filtered.length} products loaded
            </p>
          )}
        </div>
      )}
    </div>
  );
}
