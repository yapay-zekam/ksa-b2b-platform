import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkle, X, PaperPlaneRight, ArrowClockwise,
  ChartBar, Users, TrendUp, TrendDown,
  Robot, Lightning,
} from '@phosphor-icons/react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

/* ──────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────── */
const WEEKLY_SALES = [
  { day: 'Mon', revenue: 38200 },
  { day: 'Tue', revenue: 42100 },
  { day: 'Wed', revenue: 52600 },
  { day: 'Thu', revenue: 44900 },
  { day: 'Fri', revenue: 58100 },
  { day: 'Sat', revenue: 35800 },
  { day: 'Sun', revenue: 12950 },
];

const CATEGORY_PIE = [
  { name: 'Dairy',     pct: 38, color: '#3D005E' },
  { name: 'Poultry',   pct: 27, color: '#9d1fff' },
  { name: 'Beverages', pct: 18, color: '#FFD680' },
  { name: 'Other',     pct: 17, color: '#c084fc' },
];

const INVENTORY_PRED = [
  { product: 'Almarai Fresh Milk 2L',    current: 340,  predicted: 9200,  confidence: 94 },
  { product: 'Golden Chicken 1.2kg',     current: 80,   predicted: 6800,  confidence: 89 },
  { product: 'Saha Lutein Eggs 15pcs',   current: 24,   predicted: 5900,  confidence: 91 },
  { product: 'Puck Cream Cheese 500g',   current: 150,  predicted: 4600,  confidence: 87 },
];

const TOP_BUYERS = [
  { rank: 1, name: 'Al Noor Cafe',     city: 'Riyadh', logo: 'AN', color: '#3D005E', spend: 184300, orders: 312 },
  { rank: 2, name: 'Sultana Kitchen',  city: 'Jeddah', logo: 'SK', color: '#C8102E', spend: 142600, orders: 248 },
  { rank: 3, name: 'Pearl Restaurant', city: 'Dammam', logo: 'PR', color: '#006E33', spend: 118900, orders: 201 },
];

type RichType = 'weekly-sales' | 'profitable-product' | 'inventory-prediction' | 'top-buyers';

interface QuickAction {
  label: string;
  icon: React.ElementType;
  response: string;
  richType: RichType;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Analyze my sales for this week.',
    icon: ChartBar,
    richType: 'weekly-sales',
    response: `Here's your **weekly sales analysis**\n\nThis week your total revenue is **284,650 SAR**, up **18.1%** from last week.\n\nWednesday was your peak day at 52,600 SAR. Best-performing category: **Dairy** (38%), followed by **Poultry** (27%).\n\n💡 **Tip:** Replenish Almarai Fresh Milk before Thursday — weekend demand typically spikes 30%.`,
  },
  {
    label: 'Which product is most profitable?',
    icon: TrendUp,
    richType: 'profitable-product',
    response: `Your most profitable product this month is **Golden Chicken 1.2kg** 🏆\n\nIt generated **122,800 SAR** in revenue with an estimated margin of **42%**. You sold **6,140 units** with zero reported returns.\n\n📈 Month-over-month growth: **+8.4%**. I recommend negotiating a higher volume agreement to improve your cost basis.`,
  },
  {
    label: 'Predict my inventory needs for next month.',
    icon: Lightning,
    richType: 'inventory-prediction',
    response: `Based on your last 90 days of data, here are my **inventory predictions** for May 2025 🔮\n\nForecasts account for seasonal demand and your current growth rate of **+17%**. The confidence scores reflect historical accuracy.`,
  },
  {
    label: 'Show me my top 3 buyers.',
    icon: Users,
    richType: 'top-buyers',
    response: `Your **top 3 merchants** by total spend this month 🏅\n\nThese accounts collectively represent **48.3%** of your monthly revenue. Consider assigning a dedicated account manager to each to improve retention.`,
  },
];

/* ──────────────────────────────────────────────────
   TYPES
────────────────────────────────────────────────── */
interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  richType?: RichType;
}

/* ──────────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────────── */

/** Render **bold** markers as <strong> tags */
function FormatText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="font-bold">{p.slice(2, -2)}</strong>
          : p.split('\n').map((line, j, arr) => (
              <span key={`${i}-${j}`}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────
   TYPEWRITER TEXT
   Character-by-character with blinking cursor.
   Shows RichContent only after text is fully typed.
────────────────────────────────────────────────── */
function TypewriterText({
  text,
  richType,
  onDone,
}: {
  text: string;
  richType?: RichType;
  onDone?: () => void;
}) {
  const [displayed, setDisplayed] = useState('');
  const [done,      setDone]      = useState(false);

  useEffect(() => {
    let charIdx = 0;
    const total = text.length;
    setDisplayed('');
    setDone(false);

    const id = setInterval(() => {
      /* Advance 4 chars per tick for a snappy but visible effect */
      charIdx = Math.min(charIdx + 4, total);
      setDisplayed(text.slice(0, charIdx));
      if (charIdx >= total) {
        clearInterval(id);
        /* Small pause before revealing rich content */
        setTimeout(() => {
          setDone(true);
          onDone?.();
        }, 180);
      }
    }, 16);

    return () => clearInterval(id);
  }, [text, onDone]);

  return (
    <>
      <FormatText text={displayed} />
      {/* Blinking cursor while typing */}
      {!done && (
        <span className="inline-block w-[2px] h-3.5 bg-brand-700 dark:bg-brand-300 ml-0.5 align-middle animate-[cursorBlink_0.9s_ease-in-out_infinite]" />
      )}
      {/* Rich chart/table content appears after text finishes */}
      {done && richType && <RichContent type={richType} />}
    </>
  );
}

/* ──────────────────────────────────────────────────
   RICH CONTENT RENDERERS
────────────────────────────────────────────────── */
function WeeklySalesRich() {
  const tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#3D005E] text-white text-[10px] px-3 py-2 rounded-xl shadow-lg">
        <p className="font-semibold">{label}</p>
        <p>{Number(payload[0].value).toLocaleString('en')} SAR</p>
      </div>
    );
  };
  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-xl overflow-hidden bg-brand-700/5 p-3 border border-brand-700/10">
        <p className="text-[10px] font-semibold text-brand-700 dark:text-brand-300 mb-2 uppercase tracking-wide">
          Daily Revenue — This Week
        </p>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={WEEKLY_SALES} margin={{ top: 2, right: 2, left: -22, bottom: 0 }} barSize={16}>
            <defs>
              <linearGradient id="wkBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#3D005E" />
                <stop offset="100%" stopColor="#9d1fff" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
            <Tooltip content={tip} cursor={{ fill: 'rgba(61,0,94,0.06)' }} />
            <Bar dataKey="revenue" fill="url(#wkBar)" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl bg-brand-700/5 p-3 border border-brand-700/10">
        <p className="text-[10px] font-semibold text-brand-700 dark:text-brand-300 mb-2 uppercase tracking-wide">
          Revenue by Category
        </p>
        <div className="flex items-center gap-3">
          <ResponsiveContainer width={70} height={70}>
            <PieChart>
              <Pie data={CATEGORY_PIE} cx="50%" cy="50%" innerRadius={22} outerRadius={34} paddingAngle={3} dataKey="pct" strokeWidth={0}>
                {CATEGORY_PIE.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-1">
            {CATEGORY_PIE.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: c.color }} />
                <span className="text-[10px] text-muted-foreground flex-1">{c.name}</span>
                <span className="text-[10px] font-bold text-foreground">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfitableProductRich() {
  return (
    <div className="mt-3 rounded-xl border border-brand-700/20 bg-brand-700/5 overflow-hidden">
      <div className="flex gap-3 p-3">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm">
          <img
            src="/product-images/whole-chicken.png"
            alt="Golden Chicken"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground">Golden Chicken 1.2kg</p>
          <p className="text-[10px] text-muted-foreground">Poultry · Chilled</p>
          <div className="grid grid-cols-3 gap-1 mt-2">
            {[
              { label: 'Revenue',  value: '122.8K SAR' },
              { label: 'Units',    value: '6,140' },
              { label: 'Margin',   value: '42%' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-[10px] font-bold text-brand-700 dark:text-brand-300">{value}</p>
                <p className="text-[9px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
          <TrendUp size={11} weight="bold" />
          +8.4% month-over-month growth
        </div>
      </div>
    </div>
  );
}

function InventoryRich() {
  return (
    <div className="mt-3 rounded-xl border border-brand-700/20 overflow-hidden">
      <div className="bg-brand-700/5 px-3 py-2 border-b border-brand-700/10">
        <div className="grid grid-cols-4 gap-2 text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">
          <span className="col-span-2">Product</span>
          <span className="text-center">Need (units)</span>
          <span className="text-center">Confidence</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {INVENTORY_PRED.map((r) => (
          <div key={r.product} className="px-3 py-2 grid grid-cols-4 gap-2 items-center hover:bg-[#3D005E]/5">
            <p className="col-span-2 text-[10px] font-medium text-foreground truncate">{r.product}</p>
            <p className="text-[10px] font-bold text-brand-700 dark:text-brand-300 text-center">
              {r.predicted.toLocaleString('en')}
            </p>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] font-bold text-foreground">{r.confidence}%</span>
              <div className="w-10 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-700"
                  style={{ width: `${r.confidence}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopBuyersRich() {
  return (
    <div className="mt-3 space-y-2">
      {TOP_BUYERS.map((m) => (
        <div key={m.rank} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-muted/20 hover:bg-[#3D005E]/5 transition-colors">
          <div className="flex items-center justify-center w-5 h-5 text-[9px] font-bold text-muted-foreground shrink-0">
            {m.rank}
          </div>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[10px] font-bold shrink-0"
            style={{ background: m.color }}
          >
            {m.logo}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-foreground truncate">{m.name}</p>
            <p className="text-[9px] text-muted-foreground">{m.city} · {m.orders} orders</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[11px] font-bold text-foreground">{(m.spend / 1000).toFixed(1)}K</p>
            <p className="text-[9px] text-muted-foreground">SAR</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RichContent({ type }: { type?: RichType }) {
  if (type === 'weekly-sales')          return <WeeklySalesRich />;
  if (type === 'profitable-product')    return <ProfitableProductRich />;
  if (type === 'inventory-prediction')  return <InventoryRich />;
  if (type === 'top-buyers')            return <TopBuyersRich />;
  return null;
}

/* ──────────────────────────────────────────────────
   THINKING BUBBLE — wave-dot animation
────────────────────────────────────────────────── */
function ThinkingBubble() {
  return (
    <div className="flex items-start gap-2.5 animate-[fadeInUp_0.25s_ease]">
      <div className="w-7 h-7 rounded-xl bg-brand-700 flex items-center justify-center shrink-0 shadow-sm">
        <Robot size={14} weight="light" className="text-white" />
      </div>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
        <p className="text-[10px] text-muted-foreground mb-2.5 italic">
          Suptomer Co-pilot is thinking…
        </p>
        <div className="flex items-center gap-1.5">
          {[0, 0.16, 0.32].map((delay, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-brand-700/70"
              style={{ animation: `thinkingWave 1.4s ease-in-out ${delay}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────────── */
interface AiCopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiCopilot({ isOpen, onClose }: AiCopilotProps) {
  const [messages,     setMessages]     = useState<Message[]>([]);
  const [input,        setInput]        = useState('');
  const [thinking,     setThinking]     = useState(false);
  const [latestAiId,   setLatestAiId]   = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const genId = () => `${Date.now()}-${Math.random()}`;

  const sendMessage = useCallback(async (text: string, richType?: RichType, responseText?: string) => {
    if (!text.trim()) return;

    /* User message */
    setMessages((prev) => [...prev, { id: genId(), role: 'user', text }]);
    setInput('');
    setThinking(true);

    /* Thinking delay: 2–3 seconds */
    const delay = 2000 + Math.random() * 800;
    await new Promise((r) => setTimeout(r, delay));
    setThinking(false);

    /* AI message — assign ID first so we can track it for typewriter */
    const aiId = genId();
    const finalResponse = responseText ??
      `I analyzed the data based on your query: **"${text}"**\n\nHere's what I found: Based on your store performance over the last 30 days, all core metrics are trending positively. Your total revenue grew by 17.3% compared to the previous period. I recommend focusing on your top 3 categories to maintain momentum.\n\n💡 Ask me a specific question to get more targeted insights!`;

    setLatestAiId(aiId);
    setMessages((prev) => [
      ...prev,
      { id: aiId, role: 'ai', text: finalResponse, richType },
    ]);
  }, []);

  const handleQuick = (qa: QuickAction) => {
    sendMessage(qa.label, qa.richType, qa.response);
  };

  const handleSend = () => {
    if (input.trim()) sendMessage(input);
  };

  const handleReset = () => {
    setMessages([]);
    setThinking(false);
    setInput('');
    setLatestAiId(null);
  };

  const isEmpty = messages.length === 0 && !thinking;

  return (
    <>
      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes thinkingWave {
          0%, 70%, 100% { transform: translateY(0) scale(0.75); opacity: 0.45; }
          35%            { transform: translateY(-5px) scale(1);  opacity: 1;    }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes aiRipple {
          0%   { transform: scale(1);   opacity: 0.62; }
          100% { transform: scale(1.8); opacity: 0;    }
        }
        .ai-ripple {
          --ripple-color: rgba(61, 0, 94, 0.32);
          position: absolute; inset: 0;
          border-radius: inherit;
          background: var(--ripple-color);
          animation: aiRipple 4.4s ease-out infinite;
          pointer-events: none;
        }
        .ai-ripple-2 { animation-delay: 1.2s; }
        .dark .ai-ripple { --ripple-color: rgba(157, 31, 255, 0.6); }
      `}</style>

      {/* ── Backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[75] bg-black/20 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}

      {/* ── Panel ── */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-[80] h-full w-[400px] max-w-[calc(100vw-2rem)]',
          'bg-card border-l border-border shadow-2xl',
          'flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0"
          style={{ background: 'linear-gradient(135deg, #3D005E 0%, #5c0090 100%)' }}
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Robot size={18} weight="light" className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#3D005E]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-white leading-tight">Suptomer Co-pilot</h2>
            <p className="text-[10px] text-white/60">Your AI Sales Assistant · Online</p>
          </div>
          {/* AI badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gold-400/20 border border-gold-400/30">
            <Sparkle size={11} weight="fill" className="text-gold-300" />
            <span className="text-[10px] font-bold text-gold-300">AI</span>
          </div>
          {/* Reset + Close */}
          <button
            onClick={handleReset}
            title="Clear chat"
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowClockwise size={14} weight="light" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={15} weight="bold" />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">

          {/* Welcome / empty state */}
          {isEmpty && (
            <div className="animate-[fadeInUp_0.3s_ease]">
              <div className="flex items-start gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-xl bg-brand-700 flex items-center justify-center shrink-0">
                  <Robot size={14} weight="light" className="text-white" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%]">
                  <p className="text-xs text-foreground leading-relaxed">
                    Hello, Tariq! 👋 I'm your <strong>Suptomer Co-pilot</strong>.<br /><br />
                    I have access to your sales data, inventory levels, and merchant activity. Ask me anything or tap a quick action below.
                  </p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1">
                  Quick Actions
                </p>
                {QUICK_ACTIONS.map((qa) => (
                  <button
                    key={qa.label}
                    onClick={() => handleQuick(qa)}
                    className={cn(
                      'w-full flex items-start gap-3 text-left p-3 rounded-2xl border transition-all',
                      'border-brand-700/20 bg-brand-700/5 hover:bg-brand-700/10 hover:border-brand-700/40',
                      'group'
                    )}
                  >
                    <div className="w-7 h-7 rounded-xl bg-brand-700/15 flex items-center justify-center shrink-0 group-hover:bg-brand-700/25 transition-colors">
                      <qa.icon size={14} weight="light" className="text-brand-700 dark:text-brand-300" />
                    </div>
                    <span className="text-xs text-foreground leading-snug pt-0.5">{qa.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) =>
            msg.role === 'user' ? (
              /* User bubble */
              <div key={msg.id} className="flex justify-end animate-[fadeInUp_0.25s_ease]">
                <div className="bg-brand-700 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] shadow-sm">
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ) : (
              /* AI bubble */
              <div key={msg.id} className="flex items-start gap-2.5 animate-[fadeInUp_0.3s_ease]">
                <div className="w-7 h-7 rounded-xl bg-brand-700 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Robot size={14} weight="light" className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-full">
                    <p className="text-xs text-foreground leading-relaxed">
                      {msg.id === latestAiId ? (
                        /* Typewriter effect for the latest AI message */
                        <TypewriterText
                          text={msg.text}
                          richType={msg.richType}
                          onDone={() =>
                            setLatestAiId((cur) => (cur === msg.id ? null : cur))
                          }
                        />
                      ) : (
                        /* Static rendering for older messages */
                        <>
                          <FormatText text={msg.text} />
                          {msg.richType && <RichContent type={msg.richType} />}
                        </>
                      )}
                    </p>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1 pl-1">
                    Suptomer Co-pilot · {new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          )}

          {/* Thinking bubble */}
          {thinking && <ThinkingBubble />}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="shrink-0 p-4 border-t border-border bg-card">
          {/* Suggestion chips (shown after first message) */}
          {messages.length > 0 && !thinking && (
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-thin">
              {QUICK_ACTIONS.slice(0, 3).map((qa) => (
                <button
                  key={qa.label}
                  onClick={() => handleQuick(qa)}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full border border-brand-700/20 bg-brand-700/5 text-[10px] font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-700/15 transition-colors"
                >
                  <qa.icon size={10} weight="bold" />
                  {qa.label.length > 28 ? `${qa.label.slice(0, 28)}…` : qa.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-muted/30 focus-within:ring-2 focus-within:ring-brand-700/20 focus-within:border-brand-700/40 transition-all">
              <Sparkle size={14} weight="fill" className="text-brand-700/50 shrink-0" />
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                placeholder="Ask anything about your sales, products, or merchants…"
                rows={1}
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 outline-none resize-none leading-relaxed"
                style={{ maxHeight: '80px' }}
                disabled={thinking}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || thinking}
              className="w-10 h-10 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <PaperPlaneRight size={16} weight="fill" />
            </button>
          </div>
          <p className="text-[9px] text-muted-foreground text-center mt-2">
            AI responses are simulated for demo purposes.
          </p>
        </div>
      </aside>
    </>
  );
}

/* ──────────────────────────────────────────────────
   FLOATING TRIGGER — dark-mode aware pulse glow
────────────────────────────────────────────────── */
export function AiFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[70] w-14 h-14 rounded-2xl">
      {/* Ripple rings — expand outward like water droplets */}
      <span className="ai-ripple" />
      <span className="ai-ripple ai-ripple-2" />

      <button
        onClick={onClick}
        aria-label="Open AI Copilot"
        className={cn(
          'relative w-full h-full rounded-2xl',
          'flex items-center justify-center',
          'transition-all duration-200 hover:scale-110 active:scale-95',
          'bg-gradient-to-br from-brand-600 to-brand-800 shadow-lg',
        )}
      >
        <Sparkle size={24} weight="fill" className="text-gold-300" />
      </button>
    </div>
  );
}
