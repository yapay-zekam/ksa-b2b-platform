import { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  CurrencyDollar, ShoppingCart, Clock, ArrowUUpLeft,
  TrendUp, TrendDown, FilePdf, FileXls, CalendarBlank,
  MapPin,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  dailyStats,
  orderHistory,
  supplierKpiByPeriod,
  salesGrowthByPeriod,
  topSellingByPeriod,
  regionalSalesByPeriod,
  topMerchantsByPeriod,
  type SupplierPeriod,
} from '@/data/supplierReportsData';

type TimePeriod = 'Daily' | 'Weekly' | 'Monthly';

const STATUS_BADGE: Record<string, string> = {
  Delivered:  'success',
  Processing: 'default',
  Pending:    'warning',
  Cancelled:  'danger',
  Shipped:    'info',
};

/* ─── Shared export buttons ─── */
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

/* ─── KPI card ─── */
function KpiCard({
  title, value, sub, change, icon: Icon, accent = false,
}: {
  title: string; value: string; sub?: string;
  change: number; icon: React.ElementType; accent?: boolean;
}) {
  const pos = change >= 0;
  return (
    <Card className={cn('transition-all hover:shadow-card-hover', accent && 'bg-brand-700 border-brand-800')}>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center shrink-0',
            accent ? 'bg-white/15' : 'bg-brand-700/10 dark:bg-brand-700/20')}>
            <Icon size={20} weight="light" className={accent ? 'text-white' : 'text-brand-700 dark:text-brand-300'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn('text-[10px] font-semibold uppercase tracking-widest mb-0.5',
              accent ? 'text-white/60' : 'text-muted-foreground')}>
              {title}
            </p>
            <p className={cn('text-lg font-bold tracking-tight truncate',
              accent ? 'text-white' : 'text-foreground')}>
              {value}
            </p>
            {sub && <p className={cn('text-[10px] mt-0.5 truncate', accent ? 'text-white/50' : 'text-muted-foreground')}>{sub}</p>}
          </div>
          <span className={cn(
            'flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full shrink-0',
            pos
              ? accent ? 'bg-white/15 text-emerald-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : accent ? 'bg-white/15 text-red-300'     : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
          )}>
            {pos ? <TrendUp size={9} weight="bold" /> : <TrendDown size={9} weight="bold" />}
            {Math.abs(change).toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Custom tooltip ─── */
const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-card-hover text-xs min-w-[130px]">
      <p className="font-semibold text-muted-foreground mb-2">{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: e.color || e.fill }} />
            <span className="text-muted-foreground capitalize">{e.name}</span>
          </div>
          <span className="font-bold text-foreground">
            {e.name === 'revenue'
              ? `${Number(e.value).toLocaleString('en')} SAR`
              : Number(e.value).toLocaleString('en')}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function SupplierReports() {
  const [period, setPeriod]           = useState<SupplierPeriod>('Month');
  const [timePeriod, setTimePeriod]   = useState<TimePeriod>('Daily');
  const [startDate, setStartDate]     = useState('01.04.2025');
  const [endDate,   setEndDate]       = useState('30.04.2025');

  /* Period-synced data */
  const kpi           = supplierKpiByPeriod[period];
  const salesData     = salesGrowthByPeriod[period];
  const topProducts   = topSellingByPeriod[period];
  const regional      = regionalSalesByPeriod[period];
  const merchants     = topMerchantsByPeriod[period];

  /* Statistics table aggregation */
  const tableRows = useMemo(() => {
    if (timePeriod === 'Daily') return dailyStats;
    if (timePeriod === 'Weekly') {
      const weeks: typeof dailyStats = [];
      for (let i = 0; i < dailyStats.length; i += 7) {
        const slice = dailyStats.slice(i, i + 7);
        weeks.push({
          date: `${slice[0].date.slice(0, 5)} – ${slice[slice.length - 1].date.slice(0, 5)}`,
          visitors:     slice.reduce((s, r) => s + r.visitors, 0),
          followers:    slice.reduce((s, r) => s + r.followers, 0),
          placedOrders: slice.reduce((s, r) => s + r.placedOrders, 0),
          boughtItems:  slice.reduce((s, r) => s + r.boughtItems, 0),
          orderPct:     slice.reduce((s, r) => s + r.orderPct, 0) / slice.length,
          revenue:      slice.reduce((s, r) => s + r.revenue, 0),
        });
      }
      return weeks;
    }
    return [dailyStats.reduce((acc, r) => ({
      date: 'April 2025',
      visitors:     acc.visitors     + r.visitors,
      followers:    acc.followers    + r.followers,
      placedOrders: acc.placedOrders + r.placedOrders,
      boughtItems:  acc.boughtItems  + r.boughtItems,
      orderPct:     kpi.orderRate,
      revenue:      acc.revenue      + r.revenue,
    }), { date: '', visitors: 0, followers: 0, placedOrders: 0, boughtItems: 0, orderPct: 0, revenue: 0 })];
  }, [timePeriod, kpi.orderRate]);

  const totalRow = {
    visitors:     tableRows.reduce((s, r) => s + r.visitors, 0),
    followers:    tableRows.reduce((s, r) => s + r.followers, 0),
    placedOrders: tableRows.reduce((s, r) => s + r.placedOrders, 0),
    boughtItems:  tableRows.reduce((s, r) => s + r.boughtItems, 0),
    revenue:      tableRows.reduce((s, r) => s + r.revenue, 0),
  };
  const avgRow = {
    visitors:     +(totalRow.visitors     / tableRows.length).toFixed(2),
    followers:    +(totalRow.followers    / tableRows.length).toFixed(2),
    placedOrders: +(totalRow.placedOrders / tableRows.length).toFixed(2),
    boughtItems:  +(totalRow.boughtItems  / tableRows.length).toFixed(2),
    revenue:      +(totalRow.revenue      / tableRows.length).toFixed(2),
  };

  return (
    <div className="space-y-5">

      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Reports</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Sales performance, inventory health, and merchant insights</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Period buttons */}
          <div className="flex items-center bg-muted rounded-xl p-0.5 gap-0.5">
            {(['Today', 'Week', 'Month', 'Year'] as SupplierPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                  period === p ? 'bg-brand-700 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card">
              <span className="text-[10px] font-medium text-muted-foreground">Start</span>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-20 bg-transparent outline-none text-[11px] text-foreground font-medium"
              />
              <CalendarBlank size={13} weight="light" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card">
              <span className="text-[10px] font-medium text-muted-foreground">End</span>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-20 bg-transparent outline-none text-[11px] text-foreground font-medium"
              />
              <CalendarBlank size={13} weight="light" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Revenue"          value={`${(kpi.revenue / 1000).toFixed(0)}K SAR`}  sub={kpi.revenue.toLocaleString('en') + ' SAR'} change={kpi.revChange}  icon={CurrencyDollar} accent />
        <KpiCard title="Avg Order Value"         value={`${kpi.avgOrder.toFixed(2)} SAR`}           sub="Per merchant order"                         change={kpi.avgChange}  icon={ShoppingCart} />
        <KpiCard title="Pending Orders"          value={kpi.pending.toString()}                      sub="Awaiting dispatch"                           change={kpi.pendChange} icon={Clock} />
        <KpiCard title="Returns / Cancellations" value={`${kpi.returns.toFixed(1)}%`}               sub="Of total orders"                             change={kpi.retChange}  icon={ArrowUUpLeft} />
      </div>

      {/* ─── Sales Growth + Regional Sales ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* Sales Growth area chart */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Growth</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {period === 'Today' ? 'Hourly revenue today' :
                   period === 'Week'  ? 'Daily revenue this week' :
                   period === 'Month' ? 'Monthly revenue trend' : 'Revenue by month this year'}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-brand-700 inline-block" />Revenue</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gold-400 inline-block" />Orders</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={salesData} margin={{ top: 4, right: -30, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="sgRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3D005E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3D005E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sgOrd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#FFD680" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FFD680" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="rev" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Area yAxisId="rev" type="monotone" dataKey="revenue" name="revenue" stroke="#3D005E" strokeWidth={2.5} fill="url(#sgRev)" dot={false} activeDot={{ r: 4, fill: '#3D005E', stroke: '#fff', strokeWidth: 2 }} />
                <Area yAxisId="ord" type="monotone" dataKey="orders"  name="orders"  stroke="#FFD680" strokeWidth={2}   fill="url(#sgOrd)" dot={false} activeDot={{ r: 4, fill: '#FFD680', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Sales pie */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Regional Sales</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Revenue by city / region</p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <ResponsiveContainer width={150} height={150}>
                  <PieChart>
                    <Pie data={regional} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={3} dataKey="pct" strokeWidth={0}>
                      {regional.map((r, i) => <Cell key={i} fill={r.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-extrabold text-foreground">5</span>
                  <span className="text-[9px] text-muted-foreground">Regions</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {regional.map((r) => (
                <div key={r.region} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: r.color }} />
                  <MapPin size={10} weight="fill" className="text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground flex-1">{r.region}</span>
                  <span className="text-[10px] font-semibold text-foreground">{(r.revenue / 1000).toFixed(0)}K SAR</span>
                  <span className="text-[10px] text-muted-foreground w-8 text-right">{r.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Top Selling Products + Top Merchants ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Selling Products</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Revenue by product this period</p>
              </div>
              <ExportButtons />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }} barSize={20}>
                <defs>
                  <linearGradient id="prodBar" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#3D005E" />
                    <stop offset="100%" stopColor="#9d1fff" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="revenue" fill="url(#prodBar)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Merchants */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Merchants</CardTitle>
              <ExportButtons />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {merchants.map((m) => (
              <div key={m.rank} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground font-mono w-4 text-center">{m.rank}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ background: m.color }}>
                  {m.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{m.name}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin size={9} weight="fill" />{m.city} · {m.orders} orders
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-foreground">
                    {m.revenue >= 100000
                      ? `${(m.revenue / 1000).toFixed(0)}K SAR`
                      : `${(m.revenue / 1000).toFixed(1)}K SAR`}
                  </p>
                  <span className={cn('text-[10px] font-semibold flex items-center gap-0.5 justify-end',
                    m.change > 0 ? 'text-emerald-600' : 'text-red-500')}>
                    {m.change > 0 ? <TrendUp size={8} weight="bold" /> : <TrendDown size={8} weight="bold" />}
                    {Math.abs(m.change)}%
                  </span>
                </div>
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(m.revenue / merchants[0].revenue) * 100}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ─── Statistics Detail Table ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <CardTitle>Statistics</CardTitle>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Time Period</span>
                <select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                  className="text-xs rounded-lg border border-border bg-background text-foreground px-2 py-1 outline-none focus:ring-2 focus:ring-brand-700/20"
                >
                  {(['Daily', 'Weekly', 'Monthly'] as TimePeriod[]).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <ExportButtons />
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-t border-border bg-muted/30">
                  {['Date', 'Visitors', 'Followers', 'Placed Orders', 'Bought Items', 'Percentage of Orders', 'Revenue'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tableRows.map((row, i) => (
                  <tr key={i} className="hover:bg-[#3D005E]/5 transition-colors">
                    <td className="px-5 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{row.date}</td>
                    <td className="px-5 py-2.5 text-xs text-foreground">{row.visitors.toLocaleString('en')}</td>
                    <td className="px-5 py-2.5 text-xs text-foreground">{row.followers}</td>
                    <td className="px-5 py-2.5 text-xs text-foreground">{row.placedOrders}</td>
                    <td className="px-5 py-2.5 text-xs text-foreground">{row.boughtItems.toLocaleString('en')}</td>
                    <td className="px-5 py-2.5 text-xs text-foreground">{row.orderPct.toFixed(2)} %</td>
                    <td className="px-5 py-2.5 text-xs font-semibold text-foreground">{row.revenue.toLocaleString('en', { minimumFractionDigits: 2 })} SAR</td>
                  </tr>
                ))}
                <tr className="border-t border-border bg-muted/40 font-bold">
                  <td className="px-5 py-2.5 text-xs text-foreground">Total</td>
                  <td className="px-5 py-2.5 text-xs text-foreground">{totalRow.visitors.toLocaleString('en')}</td>
                  <td className="px-5 py-2.5 text-xs text-foreground">{totalRow.followers}</td>
                  <td className="px-5 py-2.5 text-xs text-foreground">{totalRow.placedOrders}</td>
                  <td className="px-5 py-2.5 text-xs text-foreground">{totalRow.boughtItems.toLocaleString('en')}</td>
                  <td className="px-5 py-2.5 text-xs text-foreground">{kpi.orderRate.toFixed(2)} %</td>
                  <td className="px-5 py-2.5 text-xs text-brand-700 dark:text-brand-300">{totalRow.revenue.toLocaleString('en', { minimumFractionDigits: 2 })} SAR</td>
                </tr>
                <tr className="bg-muted/20 font-medium">
                  <td className="px-5 py-2.5 text-xs text-foreground">Average</td>
                  <td className="px-5 py-2.5 text-xs text-muted-foreground">{avgRow.visitors.toLocaleString('en')}</td>
                  <td className="px-5 py-2.5 text-xs text-muted-foreground">{avgRow.followers.toFixed(2)}</td>
                  <td className="px-5 py-2.5 text-xs text-muted-foreground">{avgRow.placedOrders.toFixed(2)}</td>
                  <td className="px-5 py-2.5 text-xs text-muted-foreground">{avgRow.boughtItems.toLocaleString('en')}</td>
                  <td className="px-5 py-2.5 text-xs text-muted-foreground">{kpi.orderRate.toFixed(2)} %</td>
                  <td className="px-5 py-2.5 text-xs text-muted-foreground">{avgRow.revenue.toLocaleString('en', { minimumFractionDigits: 2 })} SAR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ─── Order History Table ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order History Detail</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">All orders by date, merchant, amount and status</p>
            </div>
            <ExportButtons />
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-t border-border bg-muted/30">
                  {['Order ID', 'Date', 'Merchant', 'City', 'Product', 'Qty', 'Amount', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orderHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-[#3D005E]/5 transition-colors">
                    <td className="px-5 py-3">
                      <code className="text-[10px] font-mono text-brand-700 dark:text-brand-300 bg-brand-700/5 px-2 py-0.5 rounded">
                        {row.id}
                      </code>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">{row.date}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[8px] font-bold shrink-0" style={{ background: row.merchantColor }}>
                          {row.merchantLogo}
                        </div>
                        <span className="text-xs font-medium text-foreground whitespace-nowrap">{row.merchant}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={10} weight="fill" />{row.city}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-foreground max-w-[200px] truncate">{row.product}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{row.qty}</td>
                    <td className="px-5 py-3 text-xs font-bold text-foreground whitespace-nowrap">
                      {row.amount.toLocaleString('en', { minimumFractionDigits: 2 })} SAR
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={STATUS_BADGE[row.status] as any}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
