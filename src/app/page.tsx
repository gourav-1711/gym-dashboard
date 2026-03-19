"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { useStats, useExpiringMembers, useActivities } from "@/hooks/useFirebase";
import { seedFirebaseData } from "@/lib/seedData";
import StatCard from "@/components/StatCard";
import { formatCurrency, daysUntilExpiry } from "@/lib/utils";
import {
  Users,
  Zap,
  TrendingUp,
  CreditCard,
  UserPlus,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const expiringMembers = useExpiringMembers();
  const { activities } = useActivities();

  const [now, setNow] = useState<number | null>(null);
  const [currentHour, setCurrentHour] = useState<number | null>(null);

  useEffect(() => {
    AOS.init({ duration: 500, once: true, offset: 50 });
    seedFirebaseData();
    setNow(Date.now());
    setCurrentHour(new Date().getHours());
    
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const activityIcon = (type: string) => {
    switch (type) {
      case "payment": return <div className="w-9 h-9 rounded-xl bg-[#c8f65d]/10 flex items-center justify-center"><CreditCard size={16} className="text-[#c8f65d]" /></div>;
      case "new_member": return <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center"><UserPlus size={16} className="text-blue-400" /></div>;
      case "renewal": return <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center"><TrendingUp size={16} className="text-purple-400" /></div>;
      default: return <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center"><AlertTriangle size={16} className="text-orange-400" /></div>;
    }
  };

  const timeAgo = (ts: string) => {
    if (!now) return "...";
    const diff = now - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "Just now";
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Welcome Back</p>
          <h1 className="text-2xl font-bold text-white">
            Good {currentHour === null ? "..." : currentHour < 12 ? "morning" : currentHour < 18 ? "afternoon" : "evening"}, Admin
          </h1>
 Broadway
        </div>
        <Link href="/members?add=true">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-[#c8f65d] text-black text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#d4ff6a] transition-colors"
          >
            <UserPlus size={16} />
            Add Member
          </motion.button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-2" data-aos="fade-up">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#161616] border border-white/5 rounded-2xl p-5 h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest">Monthly Revenue</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {statsLoading ? "..." : formatCurrency(stats?.monthlyRevenue ?? 0)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#c8f65d]/10 flex items-center justify-center">
                <DollarSign size={18} className="text-[#c8f65d]" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 bg-[#c8f65d]/10 text-[#c8f65d] text-xs font-semibold px-2 py-0.5 rounded-lg">
                <TrendingUp size={11} />
                +{stats?.revenueGrowth ?? 0}%
              </span>
              <span className="text-xs text-white/40">vs last month</span>
            </div>
          </motion.div>
        </div>

        <div data-aos="fade-up" data-aos-delay="100">
          <StatCard
            title="Total Members"
            value={statsLoading ? "..." : (stats?.totalMembers ?? 0).toLocaleString()}
            icon={<Users size={18} className="text-[#c8f65d]" />}
            delay={0.1}
          />
        </div>
        <div data-aos="fade-up" data-aos-delay="150">
          <StatCard
            title="Active Today"
            value={statsLoading ? "..." : stats?.activeToday ?? 0}
            icon={<Zap size={18} className="text-blue-400" />}
            delay={0.15}
          />
        </div>
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-orange-400" />
            <h2 className="font-semibold text-white">Expiring Soon</h2>
          </div>
          <Link href="/members?filter=expiring">
            <span className="text-xs text-[#c8f65d] font-medium hover:text-[#d4ff6a] transition-colors cursor-pointer">
              VIEW ALL →
            </span>
          </Link>
        </div>

        {expiringMembers.length === 0 ? (
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-8 text-center">
            <p className="text-white/40 text-sm">No members expiring in the next 7 days</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {expiringMembers.map((member, i) => {
              const days = daysUntilExpiry(member.expiryDate);
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/members/${member.id}`}>
                    <div className="shrink-0 w-44 bg-[#161616] border border-white/5 hover:border-orange-500/20 rounded-2xl p-4 text-center cursor-pointer transition-all group">
                      <div className="w-14 h-14 rounded-full bg-linear-to-br from-orange-500/20 to-orange-600/10 border-2 border-orange-500/20 flex items-center justify-center text-xl font-bold text-orange-400 mx-auto mb-3 group-hover:border-orange-500/40 transition-colors">
                        {member.name[0]}
                      </div>
                      <p className="text-sm font-semibold text-white truncate">{member.name}</p>
                      <span className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${days <= 2 ? "bg-red-500/15 text-red-400" : "bg-orange-500/15 text-orange-400"}`}>
                        {days <= 0 ? "Expired" : `${days} ${days === 1 ? "day" : "days"} left`}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div data-aos="fade-up" data-aos-delay="250">
          <h2 className="font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.slice(0, 6).map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 bg-[#161616] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors"
              >
                {activityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  <p className="text-xs text-white/40 truncate">{activity.description}</p>
                </div>
                <div className="text-right shrink-0">
                  {activity.amount ? (
                    <p className="text-sm font-semibold text-[#c8f65d]">+{formatCurrency(activity.amount)}</p>
                  ) : null}
                  <p className="text-xs text-white/30">{timeAgo(activity.timestamp)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="300">
          <h2 className="font-semibold text-white mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard title="MRR" value={statsLoading ? "..." : formatCurrency(stats?.mrr ?? 0)} accent delay={0.2} />
            <StatCard
              title="New Signups"
              value={statsLoading ? "..." : stats?.newSignups ?? 0}
              subtitle="+8% weekly"
              subtitleColor="text-[#c8f65d] text-xs"
              delay={0.25}
            />
            <StatCard
              title="Churn Rate"
              value={statsLoading ? "..." : `${stats?.churnRate ?? 0}%`}
              subtitle="-0.4% improvement"
              subtitleColor="text-green-400 text-xs"
              delay={0.3}
            />
            <StatCard
              title="Active Members"
              value={statsLoading ? "..." : stats?.activeMembers ?? 0}
              subtitle={`of ${stats?.totalMembers ?? 0} total`}
              delay={0.35}
            />
          </div>

          <div className="mt-4">
            <Link href="/income">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center justify-between bg-[#c8f65d]/5 border border-[#c8f65d]/10 hover:border-[#c8f65d]/25 rounded-xl p-4 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-[#c8f65d]" size={18} />
                  <span className="text-sm font-medium text-white">View Income Analytics</span>
                </div>
                <ArrowRight size={16} className="text-[#c8f65d]" />
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
