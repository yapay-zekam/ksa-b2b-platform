import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShoppingCart,
  CurrencyDollar,
  TrendUp,
  TrendDown,
  Buildings,
  Package,
  CaretLeft,
  CaretRight,
  CalendarBlank,
  ArrowUpRight,
  Funnel,
  MagnifyingGlass,
  Eye,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ordersByBranchData,
  recentOrders,
  supplierTrackingStats,
  merchantKpiByPeriod,
  orderTrendByPeriod,
  stockStatusByPeriod,
} from '@/data/dashboardData';

type Period = 'Today' | 'Week' | 'Month' | 'Year';
type OrderTab = 'Recent Orders' | 'Best Branches' | 'Best Suppliers';

const STATUS_STYLES: Record<string, string> = {
  Pending: 'warning',
  Delivered: 'success',
  Cancelled: 'danger',
  Processing: 'info',
};

/* ─── Horizontal StatCard ─── */
function StatCard({
  title,
  value,
  sub,
  change,
  icon: Icon,
  accent = false,
}: {
  title: string;
  value: string;
  sub?: string;
  change?: { value: string; positive: boolean };
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-shadow hover:shadow-card-hover',
        accent && 'bg-brand-700 border-brand-800'
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          {/* Icon — left */}
          <div
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
              accent ? 'bg-white/15' : 'bg-brand-700/10 dark:bg-brand-700/20'
            )}
          >
            <Icon
              size={22}
              weight="light"
              className={cn(accent ? 'text-white' : 'text-brand-700 dark:text-brand-300')}
            />
          </div>

          {/* Text — middle */}
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                'text-[10px] font-semibold uppercase tracking-widest mb-0.5',
                accent ? 'text-white/60' : 'text-muted-foreground'
              )}
            >
              {title}
            </p>
            <p
              className={cn(
                'text-lg font-bold tracking-tight truncate',
                accent ? 'text-white' : 'text-foreground'
              )}
            >
              {value}
            </p>
            {sub && (
              <p
                className={cn(
                  'text-[10px] mt-0.5 truncate',
                  accent ? 'text-white/50' : 'text-muted-foreground'
                )}
              >
                {sub}
              </p>
            )}
          </div>

          {/* Badge — right */}
          {change && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0',
                change.positive
                  ? accent
                    ? 'bg-white/10 text-emerald-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : accent
                  ? 'bg-white/10 text-red-300'
                  : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              {change.positive ? (
                <TrendUp size={12} weight="bold" />
              ) : (
                <TrendDown size={12} weight="bold" />
              )}
              {change.value}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-card-hover px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CAROUSEL_VISIBLE = 5;

export default function MerchantDashboard() {
  const [period, setPeriod] = useState<Period>('Month');
  const [activeTab, setActiveTab] = useState<OrderTab>('Recent Orders');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [selectedSupplier, setSelectedSupplier] = useState(0);
  const [carouselStart, setCarouselStart] = useState(0);

  const kpi              = merchantKpiByPeriod[period];
  const currentTrendData = orderTrendByPeriod[period];
  const currentStockData = stockStatusByPeriod[period];
  const totalStock       = currentStockData.reduce((s, d) => s + d.value, 0);
  const currentTracking  = supplierTrackingStats[selectedSupplier];
  const canceledPct = Math.round((currentTracking.canceled / currentTracking.totalOrders) * 100);

  return (
    <div className="space-y-6">

      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Branch count + dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Buildings size={15} weight="fill" className="text-brand-700 dark:text-brand-300" />
            <span className="text-sm font-bold text-foreground">8 Branches</span>
          </div>
          <div className="relative">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 rounded-xl border border-border bg-card text-xs font-medium text-foreground outline-none hover:border-brand-700/40 transition-colors cursor-pointer"
            >
              <option>All Branches</option>
              {ordersByBranchData.map((b) => (
                <option key={b.branch}>{b.branch}</option>
              ))}
            </select>
            <CaretRight
              size={11}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90"
            />
          </div>
        </div>

        {/* Right: Period + Date */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-muted rounded-xl p-0.5 gap-0.5">
            {(['Today', 'Week', 'Month', 'Year'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  period === p
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
            <CalendarBlank size={14} weight="light" />
            <span>From 11/29/2023 – 12/29/2023</span>
          </div>
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Orders"
          value={kpi.orders}
          sub={kpi.ordersSub}
          change={kpi.ordersChange}
          icon={ShoppingCart}
          accent
        />
        <StatCard
          title="Total Spend"
          value={kpi.spend}
          sub={kpi.spendSub}
          change={kpi.spendChange}
          icon={CurrencyDollar}
        />
        <StatCard
          title="Avg. Spending"
          value={kpi.avg}
          sub={kpi.avgSub}
          change={kpi.avgChange}
          icon={TrendUp}
        />
      </div>

      {/* ─── Order Trend + Stock Status ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Order Trend Chart — fills container */}
        <Card className="xl:col-span-2 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order Trend</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Total orders over the selected period
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-700 inline-block" />
                  Total Orders
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ResponsiveContainer width="100%" height="100%" minHeight={220}>
              <AreaChart data={currentTrendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3D005E" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#3D005E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#3D005E"
                  strokeWidth={2.5}
                  fill="url(#ordersGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#3D005E', strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Status — Pie left, legend right */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Status</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Current inventory overview</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {/* Pie — left (242×212) */}
              <div className="relative shrink-0">
                <PieChart width={242} height={212}>
                  <Pie
                    data={currentStockData}
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={82}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {currentStockData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold text-foreground">{currentStockData[1].value}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {((currentStockData[1].value / totalStock) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Legend — right */}
              <div className="flex-1 space-y-2.5">
                {currentStockData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: item.color }}
                      />
                      <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-foreground shrink-0">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Order Tracking + Orders by Branch ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Order Tracking — 2-column internal layout */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order Tracking</CardTitle>
              <Button variant="ghost" size="sm">
                View all <ArrowUpRight size={13} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[1fr_180px] gap-6">

              {/* Left column */}
              <div className="min-w-0">
                {/* Supplier carousel */}
                <div className="flex items-center gap-2 mb-5">
                  <button
                    onClick={() => setCarouselStart((s) => Math.max(0, s - 1))}
                    disabled={carouselStart === 0}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-30"
                  >
                    <CaretLeft size={14} weight="bold" />
                  </button>

                  <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    {supplierTrackingStats
                      .slice(carouselStart, carouselStart + CAROUSEL_VISIBLE)
                      .map((s, i) => {
                        const globalIdx = carouselStart + i;
                        const isActive = globalIdx === selectedSupplier;
                        return (
                          <button
                            key={s.name}
                            onClick={() => setSelectedSupplier(globalIdx)}
                            className="flex flex-col items-center gap-1.5 shrink-0 group"
                          >
                            <div
                              className={cn(
                                'w-11 h-11 rounded-full flex items-center justify-center text-white text-[10px] font-bold transition-all',
                                isActive
                                  ? 'ring-2 ring-offset-2 ring-brand-700 dark:ring-offset-card scale-110'
                                  : 'ring-2 ring-border group-hover:ring-brand-700/40'
                              )}
                              style={{ background: s.color }}
                            >
                              {s.logo}
                            </div>
                            <span
                              className={cn(
                                'text-[9px] text-center leading-tight max-w-[52px] truncate font-medium',
                                isActive
                                  ? 'text-brand-700 dark:text-brand-300'
                                  : 'text-muted-foreground'
                              )}
                            >
                              {s.name.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                  </div>

                  <button
                    onClick={() =>
                      setCarouselStart((s) =>
                        Math.min(supplierTrackingStats.length - CAROUSEL_VISIBLE, s + 1)
                      )
                    }
                    disabled={carouselStart >= supplierTrackingStats.length - CAROUSEL_VISIBLE}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-30"
                  >
                    <CaretRight size={14} weight="bold" />
                  </button>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-muted/50 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Total Order</p>
                    <p className="text-2xl font-bold text-foreground leading-none mb-1">
                      {currentTracking.totalOrders.toLocaleString()}
                    </p>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 text-xs font-semibold',
                        currentTracking.orderTrend >= 0 ? 'text-emerald-600' : 'text-red-500'
                      )}
                    >
                      {currentTracking.orderTrend >= 0 ? (
                        <TrendUp size={11} weight="bold" />
                      ) : (
                        <TrendDown size={11} weight="bold" />
                      )}
                      {Math.abs(currentTracking.orderTrend)}%
                    </span>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Total Spend</p>
                    <p className="text-xl font-bold text-foreground leading-none mb-1">
                      {currentTracking.totalSpend.toLocaleString('en', { minimumFractionDigits: 2 })}{' '}
                      <span className="text-xs font-medium text-muted-foreground">SAR</span>
                    </p>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 text-xs font-semibold',
                        currentTracking.spendTrend >= 0 ? 'text-emerald-600' : 'text-red-500'
                      )}
                    >
                      {currentTracking.spendTrend >= 0 ? (
                        <TrendUp size={11} weight="bold" />
                      ) : (
                        <TrendDown size={11} weight="bold" />
                      )}
                      {Math.abs(currentTracking.spendTrend)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Right column — Pie chart */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie
                        data={[
                          { value: currentTracking.canceled },
                          { value: currentTracking.totalOrders - currentTracking.canceled },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        strokeWidth={0}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <Cell fill="#FFD680" />
                        <Cell fill="#3D005E" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-foreground leading-none">
                      {currentTracking.canceled}
                    </span>
                    <span className="text-[9px] text-muted-foreground leading-tight">Cancelled</span>
                    <span className="text-xs font-semibold text-gold-500 leading-tight">
                      {canceledPct}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs mt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-700 shrink-0" />
                    <span className="text-muted-foreground">Total Order</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold-400 shrink-0" />
                    <span className="text-muted-foreground">Cancelled ({canceledPct}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Branch */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Branch</CardTitle>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Riyadh</span>
              <span className="text-xs text-muted-foreground">
                Total Order:{' '}
                <span className="font-bold text-foreground">748</span>
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ordersByBranchData.map((b) => (
                <div key={b.branch}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground truncate max-w-[130px]">
                      {b.branch}
                    </span>
                    <span className="text-xs font-semibold text-foreground ml-2">{b.orders}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-700 transition-all"
                      style={{ width: `${(b.orders / b.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Recent Orders Table ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1 bg-muted rounded-xl p-0.5">
              {(['Recent Orders', 'Best Branches', 'Best Suppliers'] as OrderTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                    activeTab === tab
                      ? 'bg-card shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-xs text-muted-foreground cursor-pointer hover:bg-muted">
                <MagnifyingGlass size={13} weight="light" />
                Search
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-xs text-muted-foreground cursor-pointer hover:bg-muted">
                <Funnel size={13} weight="light" />
                Filter
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Product', 'Amount', 'Total', 'Order ID', 'Date', 'Status', 'Branch', 'Supplier', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-[#3D005E]/5 transition-colors group">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Package size={14} className="text-muted-foreground" weight="light" />
                        </div>
                        <span className="font-medium text-foreground text-xs whitespace-nowrap">
                          {order.product}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-muted-foreground">{order.amount}</td>
                    <td className="px-6 py-3.5 text-xs font-semibold text-foreground">
                      {order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <code className="text-xs text-brand-700 dark:text-brand-300 font-mono bg-brand-700/5 px-2 py-0.5 rounded">
                        {order.id}
                      </code>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={STATUS_STYLES[order.status] as any}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                      {order.branch}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                      {order.supplier}
                    </td>
                    <td className="px-6 py-3.5">
                      <button className="p-1.5 rounded-lg hover:bg-muted opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-foreground">
                        <Eye size={14} weight="light" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Items per page:</span>
              <select className="bg-muted border border-border rounded-lg px-2 py-1 text-foreground outline-none text-xs">
                <option>100</option>
                <option>50</option>
                <option>25</option>
              </select>
              <span>1–100 of 100 items</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>1 of 10 pages</span>
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">‹</button>
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">›</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
