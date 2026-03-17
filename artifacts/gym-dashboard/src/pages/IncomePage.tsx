import { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import { useStats, usePayments } from "../hooks/useFirebase";
import { formatCurrency, formatDate } from "../lib/utils";
import StatCard from "../components/StatCard";
import { TrendingUp, RefreshCw, Users, TrendingDown, CreditCard } from "lucide-react";

const weeklyData = [
  { day: "Mon", revenue: 5200, members: 42 },
  { day: "Tue", revenue: 4800, members: 38 },
  { day: "Wed", revenue: 7100, members: 57 },
  { day: "Thu", revenue: 6300, members: 50 },
  { day: "Fri", revenue: 8240, members: 65 },
  { day: "Sat", revenue: 6900, members: 55 },
  { day: "Sun", revenue: 4310, members: 35 },
];

const monthlyData = [
  { month: "Oct", revenue: 35200 },
  { month: "Nov", revenue: 37800 },
  { month: "Dec", revenue: 34100 },
  { month: "Jan", revenue: 39500 },
  { month: "Feb", revenue: 38258 },
  { month: "Mar", revenue: 42850 },
];

const planBreakdown = [
  { plan: "Elite Plan", value: 142, percent: 11, color: "#a855f7" },
  { plan: "Pro Plan", value: 418, percent: 33, color: "#3b82f6" },
  { plan: "Basic Plan", value: 724, percent: 56, color: "#c8f65d" },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-white/40 mb-1">{label}</p>
        <p className="text-sm font-bold text-[#c8f65d]">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function IncomePage() {
  const { data: stats, isLoading } = useStats();
  const { payments } = usePayments();

  useEffect(() => {
    AOS.init({ duration: 500, once: true, offset: 30 });
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Income Analytics</h1>
          <p className="text-sm text-white/40 mt-0.5">Financial overview & revenue trends</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-[#c8f65d] bg-[#c8f65d]/10 border border-[#c8f65d]/20 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8f65d] animate-pulse" />
          Live Growth +5.4%
        </span>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-aos="fade-up">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#161616] border border-white/5 rounded-2xl p-5 h-full">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-white">{isLoading ? "..." : formatCurrency(stats?.monthlyRevenue ?? 0)}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="flex items-center gap-1 text-xs text-[#c8f65d] bg-[#c8f65d]/10 px-2 py-0.5 rounded-lg font-semibold">
                <TrendingUp size={11} /> +{stats?.revenueGrowth ?? 0}%
              </span>
              <span className="text-xs text-white/30">vs last month ({formatCurrency(stats?.lastMonthRevenue ?? 0)})</span>
            </div>
          </motion.div>
        </div>
        <div data-aos="fade-up" data-aos-delay="80">
          <StatCard title="MRR" value={isLoading ? "..." : formatCurrency(stats?.mrr ?? 0)} icon={<RefreshCw size={16} className="text-[#c8f65d]" />} accent delay={0.08} />
        </div>
        <div data-aos="fade-up" data-aos-delay="120">
          <StatCard title="New Subs" value={isLoading ? "..." : stats?.newSignups ?? 0} subtitle="+8% weekly" subtitleColor="text-[#c8f65d] text-xs" icon={<Users size={16} className="text-blue-400" />} delay={0.12} />
        </div>
        <div data-aos="fade-up" data-aos-delay="160">
          <StatCard title="Churn Rate" value={isLoading ? "..." : `${stats?.churnRate ?? 0}%`} subtitle="-0.4% improvement" subtitleColor="text-green-400 text-xs" icon={<TrendingDown size={16} className="text-green-400" />} delay={0.16} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Weekly Performance</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(weeklyData[4].revenue)}</p>
              </div>
              <span className="text-xs text-[#c8f65d] font-semibold bg-[#c8f65d]/10 px-2 py-1 rounded-lg">LIVE GROWTH +5.4%</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c8f65d" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#c8f65d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#c8f65d" strokeWidth={2} fill="url(#revGrad)" dot={{ fill: "#c8f65d", r: 3 }} activeDot={{ r: 5, fill: "#c8f65d" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="250">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 h-full">
            <h3 className="font-semibold text-white mb-5">Membership Breakdown</h3>
            <div className="space-y-4">
              {planBreakdown.map((item, i) => (
                <div key={item.plan}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white/70">{item.plan}</span>
                    <span className="text-sm font-semibold" style={{ color: item.color }}>{item.percent}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <p className="text-xs text-white/30 mt-1">{item.value} members</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div data-aos="fade-up" data-aos-delay="300">
        <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-5">6-Month Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {monthlyData.map((_, i) => (
                  <Cell key={i} fill={i === monthlyData.length - 1 ? "#c8f65d" : "rgba(200,246,93,0.25)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div data-aos="fade-up" data-aos-delay="350">
        <h2 className="font-semibold text-white mb-4">Recent Transactions</h2>
        <div className="space-y-2">
          {payments.slice(0, 8).map((payment, i) => (
            <motion.div key={payment.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 bg-[#161616] border border-white/5 hover:border-white/10 rounded-xl p-4 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#c8f65d]/10 flex items-center justify-center flex-shrink-0">
                <CreditCard size={15} className="text-[#c8f65d]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{payment.memberName}</p>
                <p className="text-xs text-white/40">{payment.plan} • {payment.method} • {formatDate(payment.date)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#c8f65d]">{formatCurrency(payment.amount)}</p>
                <span className="text-xs text-[#c8f65d]/60 uppercase font-medium">paid</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
