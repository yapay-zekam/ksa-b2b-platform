import { useState, useMemo } from 'react';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import {
  CurrencyDollar,
  ShoppingCart,
  ChartLineUp,
  Tag,
  TrendUp,
  TrendDown,
  FilePdf,
  FileXls,
  CalendarBlank,
  Buildings,
  Funnel,
  Warning,
  ArrowClockwise,
  CaretRight,
  DownloadSimple,
  Package,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  categoryBreakdown,
  statisticsRows,
  topSuppliers,
  lowStockAlerts,
  kpiByPeriod,
  spendingTrendByPeriod,
  categoryByPeriod,
} from '@/data/reportsData';

type Period = 'Today' | 'Week' | 'Month' | 'Year';
type TableGranularity = 'Daily' | 'Weekly' | 'Monthly';

const BRANCHES = ['All Branches', 'Main Kitchen – Riyadh', 'Branch – Al Khobar', 'Branch – Jeddah'];
const SUPPLIERS_FILTER = ['All Suppliers', 'Miyad International', 'Tamimi Markets', 'Al Jazira', 'Almarai Co.'];

/* ─── Export buttons shared component ─── */
function ExportButtons() {
  return (
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
        <FilePdf size={12} weight="light" className="text-red-500" /> Export PDF
      </button>
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
        <FileXls size={12} weight="light" className="text-emerald-600" /> Export Excel
      </button>
    </div>
  );
}

/* ─── Horizontal KPI Card ─── */
function KpiCard({
  title,
  value,
  fullValue,
  change,
  icon: Icon,
  accent = false,
}: {
  title: string;
  value: string;
  fullValue: string;
  change: number | null;
  icon: React.ElementType;
  accent?: boolean;
}) {
  const good = change !== null ? change > 0 : false;
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-shadow hover:shadow-card-hover',
        accent && 'bg-brand-700 border-brand-800'
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className={cn(
              'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0',
              accent ? 'bg-white/15' : 'bg-brand-700/10 dark:bg-brand-700/20'
            )}
          >
            <Icon
              size={20}
              weight="light"
              className={cn(accent ? 'text-white' : 'text-brand-700 dark:text-brand-300')}
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className={cn('text-[10px] font-semibold uppercase tracking-widest mb-0.5', accent ? 'text-white/60' : 'text-muted-foreground')}>
              {title}
            </p>
            <p className={cn('text-lg font-bold tracking-tight truncate', accent ? 'text-white' : 'text-foreground')}>
              {value}
            </p>
            <p className={cn('text-[10px] mt-0.5 truncate', accent ? 'text-white/50' : 'text-muted-foreground')}>
              {fullValue}
            </p>
          </div>

          {/* Badge */}
          {change !== null && (
            <span className={cn(
              'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full shrink-0',
              good
                ? accent
                  ? 'bg-white/10 text-emerald-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : accent
                  ? 'bg-white/10 text-red-300'
                  : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
            )}>
              {change > 0 ? <TrendUp size={10} weight="bold" /> : <TrendDown size={10} weight="bold" />}
              {Math.abs(change).toFixed(1)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Custom Tooltip ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-card-hover px-4 py-3 text-xs">
      <p className="font-semibold text-muted-foreground mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-bold text-foreground">
            {entry.name === 'spend'
              ? `${Number(entry.value).toLocaleString('en')} SAR`
              : Number(entry.value).toLocaleString('en')}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function MerchantReports() {
  const [period, setPeriod]                   = useState<Period>('Week');
  const [tableGranularity, setTableGranularity] = useState<TableGranularity>('Daily');
  const [branch, setBranch]                   = useState(BRANCHES[0]);
  const [supplier, setSupplier]               = useState(SUPPLIERS_FILTER[0]);
  const [startDate, setStartDate]             = useState('07.04.2025');
  const [endDate, setEndDate]                 = useState('13.04.2025');

  const kpi = kpiByPeriod[period];
  const spendChange   = ((kpi.spending  - kpi.prevSpending) / kpi.prevSpending) * 100;
  const orderChange   = ((kpi.orders    - kpi.prevOrders)   / kpi.prevOrders)   * 100;
  const avgOrderValue = kpi.spending / kpi.orders;
  const prevAvg       = kpi.prevSpending / kpi.prevOrders;
  const avgChange     = ((avgOrderValue - prevAvg) / prevAvg) * 100;

  const chartData    = useMemo(() => spendingTrendByPeriod[period], [period]);
  const currentCats  = useMemo(() => categoryByPeriod[period],      [period]);
  const topCategory  = currentCats[0];

  const tableData      = statisticsRows;
  const tableTotal     = { orders: tableData.reduce((s, r) => s + r.orders, 0), items: tableData.reduce((s, r) => s + r.items, 0), expense: tableData.reduce((s, r) => s + r.expense, 0) };
  const tableAvgOrders = (tableTotal.orders / tableData.length).toFixed(2);
  const tableAvgExpense = (tableTotal.expense / tableData.length).toFixed(2);

  return (
    <div className="space-y-6">

      {/* ─── TOP: Controls ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* LEFT: "Showing data for" + Branch dropdown */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-muted-foreground hidden sm:block whitespace-nowrap">
            Showing data for
          </span>
          <div className="relative">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="appearance-none pl-8 pr-7 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground outline-none hover:border-brand-700/40 transition-colors cursor-pointer"
            >
              {BRANCHES.map((b) => <option key={b}>{b}</option>)}
            </select>
            <Buildings size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" weight="light" />
            <CaretRight size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
          </div>
        </div>

        {/* RIGHT: Period buttons + Date range + Export */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-muted rounded-xl p-0.5 gap-0.5">
            {(['Today', 'Week', 'Month', 'Year'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                  period === p
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Date range */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs text-muted-foreground">
            <CalendarBlank size={13} weight="light" />
            <span className="font-medium">Start</span>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-foreground font-semibold w-20 outline-none text-center"
            />
            <span className="font-medium">End</span>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-foreground font-semibold w-20 outline-none text-center"
            />
          </div>

          <ExportButtons />
        </div>
      </div>

      {/* ─── KPI CARDS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Spending"
          value={`${(kpi.spending / 1000).toFixed(1)}K SAR`}
          fullValue={kpi.spending.toLocaleString('en') + ' SAR'}
          change={spendChange}
          icon={CurrencyDollar}
          accent
        />
        <KpiCard
          title="Total Orders"
          value={kpi.orders.toLocaleString('en')}
          fullValue={`${kpi.orders} orders placed`}
          change={orderChange}
          icon={ShoppingCart}
        />
        <KpiCard
          title="Avg. Order Value"
          value={`${avgOrderValue.toFixed(0)} SAR`}
          fullValue={`${avgOrderValue.toFixed(2)} SAR per order`}
          change={avgChange}
          icon={ChartLineUp}
        />
        <KpiCard
          title="Top Category"
          value={topCategory.name.split(' & ')[0]}
          fullValue={`${topCategory.pct}% of total spend`}
          change={null}
          icon={Tag}
        />
      </div>

      {/* ─── CHARTS ROW ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Spending Trend — fills card height, no granularity toggle */}
        <Card className="xl:col-span-2 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Spending Trend</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Total expenditure{' '}
                  {period === 'Today' ? 'today (hourly)' :
                   period === 'Week'  ? 'this week (daily)' :
                   period === 'Month' ? 'this month' : 'this year (monthly)'}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded-full bg-brand-700 inline-block" />
                  <span className="text-muted-foreground">Spending (SAR)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded-full bg-gold-400 inline-block" />
                  <span className="text-muted-foreground">Orders</span>
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 pb-4">
            <div className="h-full" style={{ minHeight: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3D005E" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#3D005E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#FFD680" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#FFD680" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="spend" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area yAxisId="spend"  type="monotone" dataKey="spend"  stroke="#3D005E" strokeWidth={2.5} fill="url(#spendGrad)"  dot={false} activeDot={{ r: 4, fill: '#3D005E', stroke: '#fff', strokeWidth: 2 }} />
                  <Area yAxisId="orders" type="monotone" dataKey="orders" stroke="#FFD680" strokeWidth={2} fill="url(#ordersGrad)" dot={false} activeDot={{ r: 4, fill: '#FFD680', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Donut — synced with period */}
        <Card>
          <CardHeader>
            <CardTitle>Expenditure by Category</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Breakdown of total spend</p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={currentCats}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                    labelLine={false}
                  >
                    {currentCats.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number | string) => [`${Number(value).toLocaleString('en')} SAR`, 'Spend']}
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {currentCats.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: cat.color }} />
                  <span className="text-[11px] text-muted-foreground flex-1 truncate">{cat.name}</span>
                  <span className="text-[11px] font-semibold text-foreground">{cat.pct}%</span>
                  <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, background: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── STATISTICS TABLE ─── */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle>Statistics</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Time period — controls table only, not charts */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/40 text-xs text-muted-foreground">
                <span className="font-medium">Time Period</span>
                <select
                  value={tableGranularity}
                  onChange={(e) => setTableGranularity(e.target.value as TableGranularity)}
                  className="bg-transparent text-foreground font-semibold outline-none cursor-pointer"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              {/* Supplier */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/40 text-xs text-muted-foreground">
                <span className="font-medium">Supplier</span>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="bg-transparent text-foreground font-semibold outline-none cursor-pointer max-w-[110px] truncate"
                >
                  {SUPPLIERS_FILTER.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <ExportButtons />
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 pt-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Date', 'Placed Orders', 'Bought Items', 'Expense', 'Average of Expense'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tableData.map((row, i) => (
                  <tr key={i} className="hover:bg-[#3D005E]/5 transition-colors">
                    <td className="px-6 py-3 text-xs text-muted-foreground">{row.date}</td>
                    <td className="px-6 py-3 text-xs font-semibold text-foreground">{row.orders}</td>
                    <td className="px-6 py-3 text-xs text-foreground">{row.items.toLocaleString('en')}</td>
                    <td className="px-6 py-3 text-xs font-semibold text-foreground">
                      {row.expense.toLocaleString('en', { minimumFractionDigits: 2 })} SAR
                    </td>
                    <td className="px-6 py-3 text-xs text-foreground">{row.avgPct.toFixed(2)} %</td>
                  </tr>
                ))}

                {/* Total row */}
                <tr className="bg-brand-700/5 font-bold border-t-2 border-brand-700/20">
                  <td className="px-6 py-3 text-xs text-foreground font-bold">Total</td>
                  <td className="px-6 py-3 text-xs text-brand-700 dark:text-brand-300 font-bold">{tableTotal.orders}</td>
                  <td className="px-6 py-3 text-xs text-brand-700 dark:text-brand-300 font-bold">{tableTotal.items.toLocaleString('en')}</td>
                  <td className="px-6 py-3 text-xs text-brand-700 dark:text-brand-300 font-bold">
                    {tableTotal.expense.toLocaleString('en', { minimumFractionDigits: 2 })} SAR
                  </td>
                  <td className="px-6 py-3 text-xs text-brand-700 dark:text-brand-300 font-bold">100 %</td>
                </tr>

                {/* Average row */}
                <tr className="bg-muted/20">
                  <td className="px-6 py-3 text-xs text-muted-foreground font-semibold">Average</td>
                  <td className="px-6 py-3 text-xs text-foreground font-semibold">{tableAvgOrders}</td>
                  <td className="px-6 py-3 text-xs text-foreground font-semibold">
                    {(tableTotal.items / tableData.length).toFixed(0)}
                  </td>
                  <td className="px-6 py-3 text-xs text-foreground font-semibold">
                    {Number(tableAvgExpense).toLocaleString('en', { minimumFractionDigits: 2 })} SAR
                  </td>
                  <td className="px-6 py-3 text-xs text-foreground font-semibold">
                    {(100 / tableData.length).toFixed(2)} %
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ─── SUPPLIER SPEND DISTRIBUTION (moved below Statistics) ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Supplier Spend Distribution</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Visual breakdown of spend across top suppliers</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <DownloadSimple size={12} weight="light" /> Export
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={topSuppliers.slice(0, 6)}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 80, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.split(' ')[0]}
                width={78}
              />
              <Tooltip
                formatter={(value: number | string) => [`${Number(value).toLocaleString('en')} SAR`, 'Total Spend']}
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '11px' }}
              />
              <Bar dataKey="spend" radius={[0, 6, 6, 0]}>
                {topSuppliers.slice(0, 6).map((_entry, i) => {
                  const barColors = ['#3D005E', '#8933FF', '#FFD680', '#b852ff', '#f5c842', '#2a0042'];
                  return <Cell key={i} fill={barColors[i % barColors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ─── BOTTOM ROW: Top 10 Suppliers + Low Stock ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Top 10 Suppliers by Spend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top 10 Suppliers By Spend</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Ranked by total expenditure this {period.toLowerCase()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Supplier</th>
                    <th className="px-5 py-2.5 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Spend</th>
                    <th className="px-5 py-2.5 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Orders</th>
                    <th className="px-5 py-2.5 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topSuppliers.map((s) => (
                    <tr key={s.rank} className="hover:bg-[#3D005E]/5 transition-colors">
                      <td className="px-5 py-2.5 text-xs text-muted-foreground font-mono">{s.rank}</td>
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                            style={{ background: s.color }}
                          >
                            {s.logo}
                          </div>
                          <span className="text-xs font-medium text-foreground truncate max-w-[140px]">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <span className="text-xs font-bold text-foreground">
                          {(s.spend / 1000).toFixed(1)}K SAR
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-right text-xs text-muted-foreground">{s.orders}</td>
                      <td className="px-5 py-2.5 text-right">
                        <span className={cn(
                          'inline-flex items-center gap-0.5 text-[10px] font-bold',
                          s.trend > 0 ? 'text-emerald-600' : 'text-red-500'
                        )}>
                          {s.trend > 0 ? <TrendUp size={10} weight="bold" /> : <TrendDown size={10} weight="bold" />}
                          {Math.abs(s.trend)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Low Stock Alerts</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Products below reorder point — action required
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  <Warning size={10} weight="fill" />
                  {lowStockAlerts.filter((a) => a.severity === 'critical').length} Critical
                </span>
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                  <ArrowClockwise size={14} weight="light" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {lowStockAlerts.map((alert, i) => {
              const pct = Math.round((alert.stock / alert.reorderPoint) * 100);
              const barColor =
                alert.severity === 'critical' ? '#3D005E' :
                alert.severity === 'medium'   ? '#8933FF' : '#FFD680';
              const bgClass =
                alert.severity === 'critical' ? 'border-brand-700/20 bg-brand-700/5 dark:bg-brand-700/10' :
                alert.severity === 'medium'   ? 'border-purple-200 dark:border-purple-800/40 bg-purple-50/50 dark:bg-purple-900/10' :
                                               'border-gold-400/30 bg-gold-400/5 dark:bg-gold-400/10';

              return (
                <div key={i} className={cn('p-3 rounded-xl border transition-all hover:shadow-sm', bgClass)}>
                  <div className="flex items-start gap-3 mb-2">
                    {/* Product image */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                      {alert.image ? (
                        <img
                          src={alert.image}
                          alt={alert.product}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Package size={16} weight="light" className="text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{alert.product}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {alert.category} · Last ordered {alert.lastOrdered}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={cn(
                        'text-xs font-bold',
                        alert.severity === 'critical' ? 'text-brand-700 dark:text-brand-300' :
                        alert.severity === 'medium'   ? 'text-purple-600 dark:text-purple-400' : 'text-gold-500'
                      )}>
                        {alert.stock} units
                      </span>
                      <p className="text-[9px] text-muted-foreground">of {alert.reorderPoint} min</p>
                    </div>
                  </div>

                  {/* Stock bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.min(pct, 100)}%`, background: barColor }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground font-semibold shrink-0">{pct}%</span>
                    <button className="text-[10px] font-semibold text-brand-700 dark:text-brand-300 hover:underline shrink-0">
                      Reorder
                    </button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* ─── CATEGORY COMPARISON BAR CHART ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Category Comparison</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Total spend per category in SAR</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Funnel size={12} weight="light" /> Filter
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <DownloadSimple size={12} weight="light" /> Export
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryBreakdown} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.split(' ')[0]}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: number | string) => [`${Number(value).toLocaleString('en')} SAR`, 'Spend']}
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '11px' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {categoryBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
