import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid,
} from "recharts";
import { useT } from "../lang/LanguageContext";
import { fmtPrice } from "../utils/format";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ec4899"];

const BUCKET_COLORS = ["#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#3730a3"];

const PRICE_BUCKETS = [
  { label: "< 50k",    min: 0,      max: 50000 },
  { label: "50–100k",  min: 50000,  max: 100000 },
  { label: "100–200k", min: 100000, max: 200000 },
  { label: "200–300k", min: 200000, max: 300000 },
  { label: "300–500k", min: 300000, max: 500000 },
  { label: "> 500k",   min: 500000, max: Infinity },
];

const KPI_ACCENTS = [
  { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-600", dot: "bg-indigo-500" },
  { bg: "bg-amber-50",  border: "border-amber-100",  text: "text-amber-600",  dot: "bg-amber-500" },
  { bg: "bg-emerald-50",border: "border-emerald-100",text: "text-emerald-600",dot: "bg-emerald-500" },
  { bg: "bg-rose-50",   border: "border-rose-100",   text: "text-rose-600",   dot: "bg-rose-500" },
];

function KpiCard({ label, value, sub, accent }) {
  const a = accent || KPI_ACCENTS[0];
  return (
    <div className={`${a.bg} rounded-xl border ${a.border} p-5`}>
      <div className={`w-2 h-2 rounded-full ${a.dot} mb-3`} />
      <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#888] mb-1 mt-0">{label}</p>
      <p className={`text-[26px] font-semibold tracking-tight m-0 leading-none ${a.text}`}>{value}</p>
      {sub && <p className="text-[12px] text-[#888] mt-1 mb-0">{sub}</p>}
    </div>
  );
}

function Section({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl border border-[#E8E8E3] p-5 ${className}`}>
      <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#aaa] mb-4 mt-0">{title}</p>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8E8E3] rounded-lg px-3 py-2 text-[12px] shadow-sm">
      <p className="font-semibold m-0">{label}</p>
      <p className="text-[#555] m-0">{payload[0].value} ann.</p>
    </div>
  );
};

export default function StatsPage({ listings, loading }) {
  const { t } = useT();

  const stats = useMemo(() => {
    if (!listings.length) return null;

    const withPrice = listings.filter((l) => l.price);
    const prices = withPrice.map((l) => l.price);
    const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const minPrice = prices.length ? Math.min(...prices) : 0;

    const sourceCounts = listings.reduce((acc, l) => {
      acc[l.source] = (acc[l.source] || 0) + 1;
      return acc;
    }, {});
    const sourceData = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    const regionCounts = listings.reduce((acc, l) => {
      if (l.region) acc[l.region] = (acc[l.region] || 0) + 1;
      return acc;
    }, {});
    const regionData = Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    const bucketData = PRICE_BUCKETS.map((b) => ({
      name: b.label,
      value: withPrice.filter((l) => l.price >= b.min && l.price < b.max).length,
    }));

    // Timeline: last 30 days grouped by day
    const now = Date.now();
    const days = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
      days[key] = 0;
    }
    listings.forEach((l) => {
      const d = new Date(l.created_at);
      if (now - d < 30 * 86400000) {
        const key = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (key in days) days[key]++;
      }
    });
    const timelineData = Object.entries(days).map(([name, value]) => ({ name, value }));

    const last7  = listings.filter((l) => now - new Date(l.created_at) < 7  * 86400000).length;
    const last30 = listings.filter((l) => now - new Date(l.created_at) < 30 * 86400000).length;
    const pricePct = Math.round((withPrice.length / listings.length) * 100);

    return { withPrice, avgPrice, maxPrice, minPrice, sourceData, regionData, bucketData, timelineData, last7, last30, pricePct };
  }, [listings]);

  if (loading) return <div className="text-center py-20 text-[#aaa] text-[13px] font-mono">{t.loading}</div>;
  if (!stats) return null;

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label={t.statTotal}     value={listings.length}          sub={`+${stats.last7} ${t.statLast7}`}   accent={KPI_ACCENTS[0]} />
        <KpiCard label={t.statWithPrice} value={`${stats.pricePct}%`}     sub={`${stats.withPrice.length} ${t.statAnn}`} accent={KPI_ACCENTS[1]} />
        <KpiCard label={t.statAvgPrice}  value={fmtPrice(stats.avgPrice)} sub={`min ${fmtPrice(stats.minPrice)}`}  accent={KPI_ACCENTS[2]} />
        <KpiCard label={t.statMaxPrice}  value={fmtPrice(stats.maxPrice)} sub={`+${stats.last30} ${t.statLast30}`} accent={KPI_ACCENTS[3]} />
      </div>

      {/* Timeline */}
      <Section title={t.statTimeline}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={stats.timelineData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#aaa" }} tickLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: "#aaa" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: "#6366f1", r: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Prix distribution */}
        <Section title={t.statPriceDist}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.bucketData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#aaa" }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#aaa" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f7f7f5" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {stats.bucketData.map((_, i) => (
                  <Cell key={i} fill={BUCKET_COLORS[i % BUCKET_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>

        {/* Top régions */}
        <Section title={t.statByRegion}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.regionData} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "#aaa" }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#555" }} tickLine={false} axisLine={false} width={110} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f7f7f5" }} />
              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        {/* Sources pie */}
        <Section title={t.statSrcShare}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={stats.sourceData}
                cx="50%" cy="45%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {stats.sourceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Section>
      </div>
    </div>
  );
}
