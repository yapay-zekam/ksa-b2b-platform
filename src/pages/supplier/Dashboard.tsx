import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import {
  CurrencyDollar,
  ShoppingCart,
  Package,
  Truck,
  TrendUp,
  TrendDown,
  Eye,
  CalendarBlank,
  ArrowUpRight,
  Warning,
  Buildings,
  X,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  supplierKpiByPeriod,
  recentSupplierOrders,
  topMerchants,
  topProducts,
  inventoryAlerts,
  salesTrendByPeriod,
  revenueByPeriod,
  orderStatusByPeriod,
} from '@/data/supplierData';

type Period = 'Today' | 'Week' | 'Month' | 'Year';

const STATUS_VARIANT: Record<string, string> = {
  Delivered:  'success',
  Processing: 'default',
  Pending:    'warning',
  Cancelled:  'danger',
  Shipped:    'info',
};

const PERIOD_CHART_SUBTITLE: Record<Period, string> = {
  Today: 'Hourly revenue breakdown for today',
  Week:  'Daily revenue for the past 7 days',
  Month: 'Weekly revenue over the last 12 weeks',
  Year:  'Monthly revenue for the current year',
};

const PERIOD_REVENUE_SUBTITLE: Record<Period, string> = {
  Today: 'Hourly revenue trend for today',
  Week:  'Daily revenue trend this week',
  Month: 'Last 14 days revenue in SAR',
  Year:  'Monthly revenue trend this year',
};

/* ─── Tooltip ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-card-hover px-4 py-3 text-xs min-w-[130px]">
      <p className="font-semibold text-muted-foreground mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.name}</span>
          </div>
          <span className="font-bold text-foreground">
            {entry.name === 'sales' || entry.name === 'revenue'
              ? `${Number(entry.value).toLocaleString('en')} SAR`
              : Number(entry.value).toLocaleString('en')}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── Horizontal KPI Card ─── */
function KpiCard({
  title, value, sub, change, icon: Icon, accent = false, onClick,
}: {
  title: string;
  value: string;
  sub: string;
  change: { value: number } | null;
  icon: React.ElementType;
  accent?: boolean;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'relative overflow-hidden transition-all hover:shadow-card-hover',
        accent && 'bg-brand-700 border-brand-800',
        onClick && 'cursor-pointer'
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          {/* Icon — left */}
          <div className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
            accent ? 'bg-white/15' : 'bg-brand-700/10 dark:bg-brand-700/20'
          )}>
            <Icon size={22} weight="light" className={cn(accent ? 'text-white' : 'text-brand-700 dark:text-brand-300')} />
          </div>

          {/* Text — middle */}
          <div className="flex-1 min-w-0">
            <p className={cn('text-[10px] font-semibold uppercase tracking-widest mb-0.5', accent ? 'text-white/60' : 'text-muted-foreground')}>
              {title}
            </p>
            <p className={cn('text-lg font-bold tracking-tight truncate', accent ? 'text-white' : 'text-foreground')}>
              {value}
            </p>
            <p className={cn('text-[10px] mt-0.5 truncate', accent ? 'text-white/50' : 'text-muted-foreground')}>
              {sub}
            </p>
          </div>

          {/* Badge — right */}
          {change !== null && (
            <span className={cn(
              'inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0',
              change.value > 0
                ? accent
                  ? 'bg-white/15 text-emerald-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : accent
                ? 'bg-white/15 text-red-300'
                : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
            )}>
              {change.value > 0
                ? <TrendUp size={10} weight="bold" />
                : <TrendDown size={10} weight="bold" />}
              {Math.abs(change.value).toFixed(1)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Date picker helper ─── */
function formatDisplayDate(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod]             = useState<Period>('Month');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate]       = useState('2026-02-21');
  const [endDate, setEndDate]           = useState('2026-02-28');
  const datePickerRef                   = useRef<HTMLDivElement>(null);

  /* Close date picker on outside click */
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const kpi              = supplierKpiByPeriod[period];
  const salesChange      = ((kpi.sales  - kpi.prevSales)  / kpi.prevSales)  * 100;
  const ordersChange     = ((kpi.orders - kpi.prevOrders) / kpi.prevOrders) * 100;
  const currentOrderStatus = orderStatusByPeriod[period];
  const totalDonut         = currentOrderStatus.reduce((s, d) => s + d.value, 0);
  const currentSalesTrend  = salesTrendByPeriod[period];
  const currentRevenue     = revenueByPeriod[period];

  return (
    <div className="space-y-6">

      {/* ─── PAGE HEADER ─── */}
      {/* Always a single row: period buttons left, date picker right — scrollable on narrow screens */}
      <div className="flex flex-row items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        {/* Left: Period buttons */}
        <div className="flex items-center bg-muted rounded-xl p-0.5 gap-0.5 shrink-0">
          {(['Today', 'Week', 'Month', 'Year'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                period === p
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Right: Date picker */}
        <div className="relative shrink-0" ref={datePickerRef}>
          <button
            onClick={() => setShowDatePicker((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl border bg-card text-xs text-muted-foreground transition-all',
              showDatePicker
                ? 'border-brand-700/50 ring-2 ring-brand-700/10 text-foreground'
                : 'border-border hover:border-brand-700/40'
            )}
          >
            <CalendarBlank size={13} weight="light" className="text-brand-700 dark:text-brand-300 shrink-0" />
            <span className="font-semibold text-foreground whitespace-nowrap text-[11px] sm:text-xs">
              {formatDisplayDate(startDate)} – {formatDisplayDate(endDate)}
            </span>
          </button>

          {/* Date picker dropdown */}
          {showDatePicker && (
            <div className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-2xl shadow-card-hover p-4 flex flex-col gap-3 min-w-[280px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground">Select Date Range</span>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
                >
                  <X size={13} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    max={endDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-muted/40 text-xs text-foreground outline-none focus:border-brand-700/50 focus:ring-2 focus:ring-brand-700/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-muted/40 text-xs text-foreground outline-none focus:border-brand-700/50 focus:ring-2 focus:ring-brand-700/10 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowDatePicker(false)}
                className="w-full py-2 rounded-xl bg-brand-700 text-white text-xs font-semibold hover:bg-brand-800 transition-colors"
              >
                Apply Range
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── KPI CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Sales"
          value={`${kpi.sales.toLocaleString('en')} SAR`}
          sub={`vs ${kpi.prevSales.toLocaleString('en')} SAR last period`}
          change={{ value: salesChange }}
          icon={CurrencyDollar}
          accent
        />
        <KpiCard
          title="Total Orders"
          value={kpi.orders.toLocaleString('en')}
          sub={`vs ${kpi.prevOrders.toLocaleString('en')} last period`}
          change={{ value: ordersChange }}
          icon={ShoppingCart}
          onClick={() => navigate('/supplier/orders')}
        />
        <KpiCard
          title="Active Products"
          value={kpi.products.toLocaleString('en')}
          sub="Listed on Suptomer catalog"
          change={null}
          icon={Package}
          onClick={() => navigate('/supplier/products')}
        />
        <KpiCard
          title="Pending Deliveries"
          value={kpi.pending.toLocaleString('en')}
          sub="Awaiting dispatch or pickup"
          change={null}
          icon={Truck}
        />
      </div>

      {/* ─── CHARTS ROW ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Sales Performance — fill container */}
        <Card className="xl:col-span-2 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Performance</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {PERIOD_CHART_SUBTITLE[period]}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-brand-700 inline-block" />
                  Revenue (SAR)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-gold-400 inline-block" />
                  Orders
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            <ResponsiveContainer width="100%" height="100%" minHeight={220}>
              <BarChart data={currentSalesTrend} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barGap={3}>
                <defs>
                  <linearGradient id="revenueBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#3D005E" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7c00d4" stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="ordersBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#FFD680" stopOpacity={1} />
                    <stop offset="100%" stopColor="#f5a623" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="sales"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <YAxis
                  yAxisId="orders"
                  orientation="right"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', radius: 8 }} />
                <Bar yAxisId="sales"  dataKey="sales"  fill="url(#revenueBarGrad)" radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Bar yAxisId="orders" dataKey="orders" fill="url(#ordersBarGrad)"  radius={[6, 6, 0, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status — Pie left, legend right */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Breakdown of all time orders</p>
          </CardHeader>
          <CardContent>
            {/* Mobile: pie above legend, both centered. Desktop: pie left, legend right */}
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-3">
              {/* Pie */}
              <div className="relative shrink-0">
                <PieChart width={232} height={212}>
                  <Pie
                    data={currentOrderStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {currentOrderStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-extrabold text-foreground">{totalDonut.toLocaleString('en')}</span>
                  <span className="text-[9px] text-muted-foreground">Total</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 w-full sm:w-auto space-y-2.5">
                {currentOrderStatus.map((s) => (
                  <div key={s.name} className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color }} />
                      <span className="text-xs text-muted-foreground truncate">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs font-semibold text-foreground">{s.value.toLocaleString('en')}</span>
                      <span className="text-[10px] text-muted-foreground">
                        ({((s.value / totalDonut) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── REVENUE TREND (dynamic) ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue Trend</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {PERIOD_REVENUE_SUBTITLE[period]}
              </p>
            </div>
            <button
              onClick={() => navigate('/supplier/reports')}
              className="flex items-center gap-1 text-xs text-brand-700 dark:text-brand-300 font-medium hover:underline"
            >
              Full Report <ArrowUpRight size={12} weight="bold" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={currentRevenue} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3D005E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3D005E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#3D005E" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#3D005E', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ─── RECENT ORDERS TABLE ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Latest orders from merchants across all branches</p>
            </div>
            <button
              onClick={() => navigate('/supplier/orders')}
              className="flex items-center gap-1 text-xs text-brand-700 dark:text-brand-300 font-medium hover:underline"
            >
              View all <ArrowUpRight size={12} weight="bold" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Order ID', 'Product', 'Merchant', 'Branch', 'Qty', 'Amount', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentSupplierOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#3D005E]/5 transition-colors group">
                    <td className="px-5 py-3.5">
                      <code className="text-[10px] font-mono text-brand-700 dark:text-brand-300 bg-brand-700/5 px-2 py-0.5 rounded">
                        {order.id}
                      </code>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img src={order.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate max-w-[160px]">{order.product}</p>
                          <p className="text-[10px] text-muted-foreground">{order.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[8px] font-bold shrink-0"
                          style={{ background: order.merchantColor }}
                        >
                          {order.merchantLogo}
                        </div>
                        <span className="text-xs text-foreground font-medium whitespace-nowrap">{order.merchantName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <Buildings size={11} weight="light" />
                        {order.branchName}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{order.qty}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-foreground">
                        {order.amount.toLocaleString('en', { minimumFractionDigits: 2 })} SAR
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={STATUS_VARIANT[order.status] as any}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{order.date}</td>
                    <td className="px-5 py-3.5">
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                        <Eye size={14} weight="light" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ─── BOTTOM 3-COLUMN: Top Merchants | Best Selling | Inventory Alerts ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Top Merchants */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Merchants</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Highest-value merchant clients</p>
              </div>
              <button
                onClick={() => navigate('/supplier/reports')}
                className="flex items-center gap-1 text-xs text-brand-700 dark:text-brand-300 font-medium hover:underline"
              >
                View all <ArrowUpRight size={11} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topMerchants.map((m) => (
              <div key={m.rank} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-mono w-4 text-center">{m.rank}</span>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  style={{ background: m.color }}
                >
                  {m.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{m.name}</p>
                  <p className="text-[10px] text-muted-foreground">{m.orders} orders</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-foreground">
                    {(m.revenue / 1000).toFixed(1)}K SAR
                  </p>
                  <span className={cn(
                    'text-[10px] font-semibold flex items-center gap-0.5 justify-end',
                    m.trend > 0 ? 'text-emerald-600' : 'text-red-500'
                  )}>
                    {m.trend > 0 ? <TrendUp size={9} weight="bold" /> : <TrendDown size={9} weight="bold" />}
                    {Math.abs(m.trend)}%
                  </span>
                </div>
                <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden shrink-0">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(m.revenue / topMerchants[0].revenue) * 100}%`,
                      background: m.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Best Selling Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Best Selling</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Ranked by units sold this {period.toLowerCase()}</p>
              </div>
              <button
                onClick={() => navigate('/supplier/products')}
                className="flex items-center gap-1 text-xs text-brand-700 dark:text-brand-300 font-medium hover:underline shrink-0"
              >
                View all <ArrowUpRight size={11} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {topProducts.map((p) => (
              <div key={p.rank} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-mono w-4 text-center shrink-0">{p.rank}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.category} · {p.unitsSold.toLocaleString()} units</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-foreground">{(p.revenue / 1000).toFixed(1)}K</p>
                  <span className={cn(
                    'text-[10px] font-semibold flex items-center gap-0.5 justify-end',
                    p.trend > 0 ? 'text-emerald-600' : 'text-red-500'
                  )}>
                    {p.trend > 0 ? <TrendUp size={9} weight="bold" /> : <TrendDown size={9} weight="bold" />}
                    {Math.abs(p.trend)}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card className="border-amber-200 dark:border-amber-800/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Inventory Alerts</CardTitle>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Warning size={10} weight="fill" />
                {inventoryAlerts.length} items
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {inventoryAlerts.map((alert, i) => {
              const pct = Math.round((alert.stock / alert.minStock) * 100);
              const color =
                alert.severity === 'critical' ? '#ef4444' :
                alert.severity === 'medium'   ? '#f97316' : '#eab308';
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-foreground truncate max-w-[160px]">{alert.product}</p>
                    <span className="text-xs font-bold shrink-0 ml-2" style={{ color }}>
                      {alert.stock} / {alert.minStock}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(pct, 100)}%`, background: color }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{pct}%</span>
                    <button className="text-[10px] font-semibold text-brand-700 dark:text-brand-300 hover:underline shrink-0">
                      Restock
                    </button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
