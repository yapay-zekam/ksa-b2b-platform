import { useState, useRef, useEffect } from 'react';
import {
  MagnifyingGlass,
  Barcode,
  Package,
  PlusCircle,
  CheckCircle,
  X,
  Star,
  StarHalf,
  Truck,
  Warehouse,
  Upload,
  ArrowRight,
  Warning,
  CaretLeft,
  CaretRight,
  Pencil,
  ToggleLeft,
  Check,
  SealCheck,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import {
  masterCatalog,
  seedInventory,
  type CatalogProduct,
  type InventoryEntry,
} from '@/data/masterCatalogData';

/* ─── Types ─── */
interface ProductForm {
  productCost: string;
  salePrice:   string;
  discountPrice: string;
  stockAmount:   string;
  sku:           string;
  notifyBelow:   string;
  minCartQty:    string;
  maxCartQty:    string;
  deliveryDate:  string;
  shippingCharge: string;
}

const BLANK_FORM: ProductForm = {
  productCost:   '',
  salePrice:     '',
  discountPrice: '',
  stockAmount:   '',
  sku:           '',
  notifyBelow:   '0',
  minCartQty:    '1',
  maxCartQty:    '100000',
  deliveryDate:  '',
  shippingCharge: 'Default',
};

const DELIVERY_OPTIONS  = ['Same Day', '1 Day', '2–3 Days', '4–5 Days', '1 Week'];
const SHIPPING_OPTIONS  = ['Default', 'Free Shipping', 'Fixed Rate – 15 SAR', 'Fixed Rate – 25 SAR'];
const PER_PAGE = 9;

/* ─── Star row ─── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const full = i <= Math.floor(rating);
        const half = !full && i - 0.5 <= rating;
        return full
          ? <Star   key={i} size={10} weight="fill" className="text-gold-400" />
          : half
          ? <StarHalf key={i} size={10} weight="fill" className="text-gold-400" />
          : <Star   key={i} size={10} weight="regular" className="text-muted-foreground/40" />;
      })}
    </div>
  );
}

/* ─── Toast ─── */
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-[slideUp_0.3s_ease]">
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-brand-700 text-white shadow-glow text-sm font-medium">
        <CheckCircle size={18} weight="fill" className="text-gold-400 shrink-0" />
        {message}
      </div>
    </div>
  );
}

/* ─── Field label + input ─── */
function Field({
  label, value, onChange, placeholder = '', type = 'text',
  required = false, suffix, readOnly = false,
}: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
  suffix?: string; readOnly?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || label}
          className={cn(
            'w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background',
            'text-foreground placeholder:text-muted-foreground/50 outline-none transition',
            'focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700/50',
            readOnly && 'bg-muted/40 cursor-not-allowed',
            suffix && 'pr-14',
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Select field ─── */
function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700/50 transition"
      >
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function AddProduct() {
  const [query,    setQuery]    = useState('');
  const [searched, setSearched] = useState(false);
  const [results,  setResults]  = useState<CatalogProduct[]>([]);
  const [page,     setPage]     = useState(1);

  const [selected,    setSelected]    = useState<CatalogProduct | null>(null);
  const [form,        setForm]        = useState<ProductForm>(BLANK_FORM);
  const [showModal,   setShowModal]   = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [inventory, setInventory] = useState<InventoryEntry[]>(seedInventory);
  const [toast,     setToast]     = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Search ── */
  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? masterCatalog.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.barcode.includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
      : masterCatalog;
    setResults(filtered.length ? filtered : masterCatalog);
    setSearched(true);
    setPage(1);
  };

  /* ── Select to sell ── */
  const openModal = (product: CatalogProduct) => {
    setSelected(product);
    const prefix = product.brand.replace(/\s+/g, '').slice(0, 3).toUpperCase();
    setForm({
      ...BLANK_FORM,
      salePrice:    product.suggestedRetailPrice.toFixed(2),
      productCost:  (product.suggestedRetailPrice * 0.65).toFixed(2),
      discountPrice: (product.suggestedRetailPrice * 0.9).toFixed(2),
      sku:          `${prefix}${Date.now().toString().slice(-7)}`,
      stockAmount:  '500',
      notifyBelow:  '50',
    });
    setShowModal(true);
  };

  /* ── Save ── */
  const handleSave = () => {
    if (!selected) return;
    setShowModal(false);
    setShowSuccess(true);
    const stockNum = parseInt(form.stockAmount) || 0;
    const entry: InventoryEntry = {
      product:       selected,
      salePrice:     parseFloat(form.salePrice) || selected.suggestedRetailPrice,
      originalPrice: parseFloat(form.discountPrice) || 0,
      stock:         stockNum,
      sku:           form.sku,
      deliveryDate:  form.deliveryDate || '2–3 Days',
      addedAt:       new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status:        stockNum === 0 ? 'out_of_stock' : stockNum < parseInt(form.notifyBelow || '50') ? 'low_stock' : 'active',
    };
    setInventory((prev) => [entry, ...prev]);
  };

  /* ── Close success ── */
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSelected(null);
    setToast('Product successfully added to your inventory!');
  };

  /* ── Pagination ── */
  const totalPages = Math.ceil(results.length / PER_PAGE);
  const paginated  = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const setField = (key: keyof ProductForm) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  /* ── Status badge color ── */
  const statusStyle = (s: InventoryEntry['status']) =>
    s === 'active'       ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
    s === 'low_stock'    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                           'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
  const statusLabel = (s: InventoryEntry['status']) =>
    s === 'active' ? 'Active' : s === 'low_stock' ? 'Low Stock' : 'Out of Stock';

  return (
    <>
      {/* ─── Toast ─── */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* ─── Adding Modal ─── */}
      {showModal && selected && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-[640px] max-h-[92vh] overflow-y-auto bg-card rounded-3xl shadow-card-hover border border-border animate-[scaleIn_0.2s_ease]">

            {/* Header */}
            <div className="px-7 pt-7 pb-5 border-b border-border">
              <h2 className="text-base font-bold text-foreground">Product Detail</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Please enter the information about the product to be listed for sale.
              </p>
            </div>

            {/* Product info strip */}
            <div className="mx-7 my-5 flex items-start gap-4 p-4 rounded-2xl border border-border bg-muted/30">
              <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-white shrink-0 shadow-sm">
                <img src={selected.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{selected.name}</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 mt-2">
                  {[
                    ['Barcode',  selected.barcode],
                    ['Brand',    selected.brand],
                    ['Size',     selected.size],
                    ['Category', `${selected.category} > ${selected.subCategory}`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-muted-foreground w-14 shrink-0">{k}</span>
                      <span className="text-foreground font-medium truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-7 pb-7 space-y-5">
              {/* Prices */}
              <div className="grid grid-cols-3 gap-4">
                <Field label="Product Cost"   value={form.productCost}   onChange={setField('productCost')}   suffix="SAR" placeholder="0.00" required />
                <Field label="Sale Price"     value={form.salePrice}     onChange={setField('salePrice')}     suffix="SAR" placeholder="0.00" required />
                <Field label="Discount Price" value={form.discountPrice} onChange={setField('discountPrice')} suffix="SAR" placeholder="0.00" />
              </div>
              {/* Stock */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Stock Amount"     value={form.stockAmount} onChange={setField('stockAmount')} placeholder="0" required />
                <Field label="Stock Keeping Unit (SKU)" value={form.sku} onChange={setField('sku')} />
              </div>
              {/* Qty limits */}
              <div className="grid grid-cols-3 gap-4">
                <Field label="Notify for Quantity Below" value={form.notifyBelow} onChange={setField('notifyBelow')} placeholder="0" />
                <Field label="Minimum Cart Quantity"     value={form.minCartQty}  onChange={setField('minCartQty')}  placeholder="1" />
                <Field label="Maximum Cart Quantity"     value={form.maxCartQty}  onChange={setField('maxCartQty')}  placeholder="100000" />
              </div>
              {/* Delivery */}
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Delivery Date"   value={form.deliveryDate}    onChange={setField('deliveryDate')}    options={DELIVERY_OPTIONS} />
                <SelectField label="Shipping Charge" value={form.shippingCharge}  onChange={setField('shippingCharge')}  options={SHIPPING_OPTIONS} />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.salePrice || !form.stockAmount}
                  className="flex-[2] py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Confirm and open for sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Success Modal ─── */}
      {showSuccess && selected && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-[420px] bg-card rounded-3xl shadow-card-hover border border-border animate-[scaleIn_0.25s_ease] overflow-hidden">

            <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full border-2 border-brand-700 flex items-center justify-center mb-5">
                <Check size={32} weight="bold" className="text-brand-700" />
              </div>

              <h2 className="text-2xl font-extrabold text-brand-700 mb-1">Congratulations</h2>
              <p className="text-sm text-muted-foreground mb-7">Your product has been successfully listed.</p>

              {/* Mini product card — matches merchant product card style */}
              <div className="w-full max-w-[230px] rounded-2xl border border-border bg-background overflow-hidden shadow-card text-left">
                <div className="h-36 overflow-hidden bg-muted">
                  <img src={selected.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-3.5 space-y-2">
                  <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">{selected.name}</p>
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    <Stars rating={3.5} />
                    <span className="text-[10px] text-muted-foreground">(22 Reviews)</span>
                  </div>
                  {/* Supplier strip */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-border">
                    <div className="w-5 h-5 rounded-md bg-brand-700 flex items-center justify-center text-white text-[8px] font-bold shrink-0">
                      M
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate leading-tight flex-1">
                      Miyad International Food Co.
                    </span>
                    <span className="text-[9px] font-semibold text-brand-700 whitespace-nowrap">+ 6 Suppliers</span>
                  </div>
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-muted-foreground">Start from</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-extrabold text-foreground">
                          {parseFloat(form.salePrice || '0').toFixed(2)} SAR
                        </span>
                        {form.discountPrice && parseFloat(form.discountPrice) > parseFloat(form.salePrice) && (
                          <span className="text-[10px] text-muted-foreground line-through">
                            {parseFloat(form.discountPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center">
                      <ArrowRight size={13} weight="bold" className="text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-8 w-full">
                <button
                  onClick={handleCloseSuccess}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
                >
                  <Pencil size={14} weight="light" /> Edit
                </button>
                <button
                  onClick={handleCloseSuccess}
                  className="flex-[2] py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          PAGE CONTENT
      ═══════════════════════════════════════════════ */}
      <div className="space-y-6">

        {/* ─── Search Bar (always on top) ─── */}
        <div className={cn(
          'flex items-stretch gap-3 transition-all',
          !searched && 'hidden'
        )}>
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-card shadow-sm">
            <MagnifyingGlass size={18} weight="light" className="text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for product name or barcode"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
            />
            {query && (
              <button onClick={() => { setQuery(''); setSearched(false); setResults([]); }}>
                <X size={15} className="text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Search
          </button>
          <button
            onClick={() => {/* simulate barcode scan */}}
            className="px-4 py-3 rounded-2xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"
          >
            <Barcode size={18} weight="light" />
            <span className="hidden sm:inline">Scan</span>
          </button>
        </div>

        {/* ─── HERO / INITIAL VIEW ─── */}
        {!searched && (
          <div className="space-y-5">
            {/* Hero banner */}
            <div
              className="relative overflow-hidden rounded-3xl p-8 md:p-12"
              style={{ background: 'linear-gradient(135deg, #3D005E 0%, #6200a0 60%, #7c00d4 100%)' }}
            >
              {/* Background geometric decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
                <div className="absolute top-8 right-32 w-32 h-32 rounded-full bg-white/5" />
                <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/[0.03]" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                {/* Text */}
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3">
                    Add your products faster<br />using the Suptomer catalog!
                  </h1>
                  <p className="text-white/70 text-sm leading-relaxed max-w-md">
                    You can search the products in the Suptomer catalog using Barcode or Product Name
                    and open them for sale. If your product is not in the catalog, you can enter a
                    new product with the Add Product button.
                  </p>

                  {/* Search bar inside hero */}
                  <div className="mt-7 flex items-stretch gap-3 max-w-xl">
                    <div className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white shadow-sm">
                      <MagnifyingGlass size={18} weight="light" className="text-gray-400 shrink-0" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search for product name or barcode"
                        className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="px-6 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold transition-colors shadow-sm border-2 border-white/20"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Illustration placeholder */}
                <div className="hidden md:flex items-center justify-center shrink-0">
                  <div className="relative w-48 h-48">
                    {/* Warehouse / shelves illustration with icons */}
                    <div className="absolute inset-0 rounded-3xl bg-white/10 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-3 p-4">
                        {[Package, Warehouse, Barcode, SealCheck].map((Icon, i) => (
                          <div key={i} className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
                            <Icon size={28} weight="light" className="text-gold-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Floating badge */}
                    <div className="absolute -top-2 -right-2 bg-gold-400 text-brand-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                      30+ Products
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-5 p-7 rounded-2xl border border-border bg-card hover:shadow-card-hover transition-shadow group">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground mb-1">Add your own product</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Add your product that is not in the Suptomer catalog.
                  </p>
                  <button className="mt-4 px-5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5">
                    <PlusCircle size={14} weight="bold" /> Add Product
                  </button>
                </div>
                <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                  {/* Simple illustration */}
                  <div className="w-20 h-20 rounded-2xl bg-brand-700/8 flex items-center justify-center">
                    <Package size={40} weight="light" className="text-brand-700" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 p-7 rounded-2xl border border-border bg-card hover:shadow-card-hover transition-shadow group">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground mb-1">Add your own products in bulk</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Add your products that are not in the Suptomer catalog in bulk.
                  </p>
                  <button className="mt-4 px-5 py-2 rounded-xl border border-brand-700 text-brand-700 dark:text-brand-300 hover:bg-brand-700/10 text-xs font-semibold transition-colors flex items-center gap-1.5">
                    <Upload size={14} weight="bold" /> Add Bulk Product
                  </button>
                </div>
                <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-brand-700/8 flex items-center justify-center">
                    <Warehouse size={40} weight="light" className="text-brand-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── SEARCH RESULTS ─── */}
        {searched && (
          <div className="space-y-4">
            {/* Result meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">{results.length}</span> products found
                </span>
                <button
                  onClick={() => { setSearched(false); setQuery(''); setResults([]); }}
                  className="text-xs text-brand-700 dark:text-brand-300 hover:underline"
                >
                  ← Clear search
                </button>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-muted-foreground">Didn't find what you were looking for?</span>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold transition-colors shadow-sm">
                  <PlusCircle size={13} weight="bold" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginated.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 rounded-2xl border border-border bg-card hover:shadow-card-hover transition-shadow"
                >
                  {/* Product image */}
                  <div className="w-[124px] h-[132px] shrink-0 rounded-xl overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 mb-2">
                        {product.name}
                      </p>
                      <div className="space-y-0.5">
                        {[
                          ['Barcode',  product.barcode],
                          ['Brand',    product.brand],
                          ['Size',     product.size],
                          ['Category', product.category],
                        ].map(([k, v]) => (
                          <div key={k} className="flex items-center gap-1.5 text-[10px]">
                            <span className="text-muted-foreground w-12 shrink-0">{k}</span>
                            <span className="text-foreground font-medium truncate">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => openModal(product)}
                      className="mt-3 w-full py-1.5 rounded-lg border border-brand-700 text-brand-700 dark:text-brand-300 hover:bg-brand-700 hover:text-white text-[11px] font-semibold transition-all"
                    >
                      Select To Sell
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Items per page:</span>
                  <span className="font-semibold text-foreground">{PER_PAGE}</span>
                  <span>·</span>
                  <span>
                    {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, results.length)} of{' '}
                    <span className="font-semibold text-foreground">{results.length}</span> items
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {page} of {totalPages} pages
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <CaretLeft size={13} weight="bold" className="text-foreground" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <CaretRight size={13} weight="bold" className="text-foreground" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── LAST ADDED PRODUCTS (Inventory preview) ─── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Last Added Products</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your recently listed products — visible to merchants in the catalog.
              </p>
            </div>
            <button className="text-xs text-brand-700 dark:text-brand-300 font-medium hover:underline flex items-center gap-1">
              View all inventory <ArrowRight size={11} />
            </button>
          </div>

          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Product', 'Category', 'Sale Price', 'Stock', 'SKU', 'Delivery', 'Status', 'Added', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inventory.slice(0, 8).map((entry, idx) => (
                  <tr key={idx} className="hover:bg-[#3D005E]/5 transition-colors group">
                    {/* Product */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img src={entry.product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs font-semibold text-foreground line-clamp-2 max-w-[180px]">
                          {entry.product.name}
                        </p>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                      {entry.product.category}
                    </td>
                    {/* Price */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-bold text-foreground">
                        {entry.salePrice.toFixed(2)} SAR
                      </span>
                      {entry.originalPrice > entry.salePrice && (
                        <span className="text-[10px] text-muted-foreground line-through ml-1.5">
                          {entry.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    {/* Stock */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {entry.status === 'low_stock' && (
                          <Warning size={12} weight="fill" className="text-amber-500 shrink-0" />
                        )}
                        <span className={cn(
                          'text-xs font-semibold',
                          entry.status === 'low_stock' ? 'text-amber-600' :
                          entry.status === 'out_of_stock' ? 'text-red-500' : 'text-foreground'
                        )}>
                          {entry.stock.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    {/* SKU */}
                    <td className="px-4 py-3.5">
                      <code className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {entry.sku}
                      </code>
                    </td>
                    {/* Delivery */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <Truck size={11} weight="light" />
                        {entry.deliveryDate}
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className={cn(
                        'text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap',
                        statusStyle(entry.status)
                      )}>
                        {statusLabel(entry.status)}
                      </span>
                    </td>
                    {/* Added */}
                    <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                      {entry.addedAt}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil size={13} weight="light" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <ToggleLeft size={14} weight="light" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
