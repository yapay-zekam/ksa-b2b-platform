import { useNavigate } from 'react-router-dom';
import {
  FilePdf, FileXls, Pencil, PlusCircle, SealWarning,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  lowStockProducts, neverSoldProducts, emptyCategories,
} from '@/data/supplierReportsData';

/* ─── Export buttons ─── */
function ExportButtons() {
  return (
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        <FilePdf size={13} weight="light" className="text-red-500" />
        Export PDF
      </button>
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        <FileXls size={13} weight="light" className="text-emerald-600" />
        Export Excel
      </button>
    </div>
  );
}

/* ─── Section card wrapper ─── */
function SectionCard({
  title, count, children,
}: { title: string; count: number; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>{title}</CardTitle>
            <span className="text-xs font-bold text-foreground bg-muted px-2.5 py-0.5 rounded-full">
              {count}
            </span>
          </div>
          <ExportButtons />
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0 pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════
   SALES MONITORING PAGE
══════════════════════════════════════════════════════ */
export default function SupplierSalesMonitoring() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">

      {/* ─── Header ─── */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Sales Monitoring</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Inventory health, unsold products, and empty category alerts
        </p>
      </div>

      {/* ─── Low Stock Products ─── */}
      <SectionCard title="Low stock products" count={lowStockProducts.length}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-t border-border bg-muted/30">
                {['Product ID', 'Product', 'Brand', 'Category', 'Stock', 'Edit'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lowStockProducts.map((p) => {
                const pct   = Math.round((p.stock / p.minStock) * 100);
                const color = pct < 20 ? '#ef4444' : pct < 40 ? '#f97316' : '#eab308';
                return (
                  <tr key={p.id} className="hover:bg-[#3D005E]/5 transition-colors">
                    <td className="px-5 py-3">
                      <code className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {p.id}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img src={p.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-medium text-foreground max-w-[200px] truncate">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-foreground">{p.brand}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground max-w-[220px] truncate">
                      {p.categoryPath}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden shrink-0">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.min(pct, 100)}%`, background: color }}
                          />
                        </div>
                        <span className="text-xs font-bold" style={{ color }}>
                          {p.stock}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil size={14} weight="light" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ─── Never Sold Products ─── */}
      <SectionCard title="List of products never sold" count={neverSoldProducts.length}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-t border-border bg-muted/30">
                {['Product ID', 'Product', 'Brand', 'Category', 'Stock', 'Edit'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {neverSoldProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#3D005E]/5 transition-colors">
                  <td className="px-5 py-3">
                    <code className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {p.id}
                    </code>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-medium text-foreground max-w-[200px] truncate">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-foreground">{p.brand}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground max-w-[220px] truncate">
                    {p.categoryPath}
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold text-foreground">{p.stock}</td>
                  <td className="px-5 py-3">
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil size={14} weight="light" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ─── Empty Categories ─── */}
      <SectionCard title="List of empty categories" count={emptyCategories.length}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-t border-border bg-muted/30">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex-1">
                  Category
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {emptyCategories.map((cat) => (
                <tr key={cat} className="hover:bg-[#3D005E]/5 transition-colors">
                  <td className="px-5 py-3 text-xs text-foreground">{cat}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => navigate('/supplier/add-product')}
                      className="flex items-center gap-1 ml-auto text-xs font-semibold text-brand-700 dark:text-brand-300 hover:underline"
                    >
                      <PlusCircle size={13} weight="bold" /> Add Product
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ─── Upgrade Plan Banner ─── */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg, #3D005E 0%, #7c00d4 100%)' }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <SealWarning size={24} weight="light" className="text-gold-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">Upgrade to Pro Plan</h3>
              <p className="text-sm text-white/70">
                Get advanced analytics, unlimited product listings, and priority placement in the merchant catalog.
              </p>
            </div>
          </div>
          <button className="px-6 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-brand-900 text-sm font-bold transition-colors shadow-sm shrink-0">
            Upgrade Now — 50% Off
          </button>
        </div>
      </div>

    </div>
  );
}
