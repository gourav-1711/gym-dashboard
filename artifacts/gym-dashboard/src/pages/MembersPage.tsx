import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { useMembers, useDeleteMember } from "../hooks/useFirebase";
import { useUIStore } from "../store/uiStore";
import StatusBadge from "../components/StatusBadge";
import AddMemberModal from "../components/AddMemberModal";
import { Search, Filter, Plus, Trash2, ChevronRight, Loader2 } from "lucide-react";

const FILTERS = ["all", "active", "expiring", "inactive"] as const;

export default function MembersPage() {
  const [location] = useLocation();
  const { searchQuery, setSearchQuery, activeFilter, setActiveFilter } = useUIStore();
  const { members, isLoading } = useMembers();
  const deleteMember = useDeleteMember();
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 400, once: true });
    const params = new URLSearchParams(location.split("?")[1]);
    const f = params.get("filter");
    if (f && FILTERS.includes(f as typeof FILTERS[number])) setActiveFilter(f);
  }, [location, setActiveFilter]);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchFilter = activeFilter === "all" || m.status === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.plan.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [members, activeFilter, searchQuery]);

  const counts = useMemo(() => ({
    all: members.length,
    active: members.filter((m) => m.status === "active").length,
    expiring: members.filter((m) => m.status === "expiring").length,
    inactive: members.filter((m) => m.status === "inactive").length,
  }), [members]);

  const handleDelete = async (id: string) => {
    await deleteMember.mutateAsync(id);
    setDeleteId(null);
  };

  const planColor = (plan: string) => {
    switch (plan) {
      case "Elite": return "text-purple-400";
      case "Pro": return "text-blue-400";
      default: return "text-white/50";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">All Members</h1>
          <p className="text-sm text-white/40 mt-0.5">{members.length} total members</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#c8f65d] text-black text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#d4ff6a] transition-colors"
        >
          <Plus size={16} />
          Add Member
        </motion.button>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3" data-aos="fade-up">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full bg-[#161616] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#c8f65d]/40 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 bg-[#161616] border border-white/5 rounded-xl p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeFilter === f
                  ? "bg-[#c8f65d] text-black"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {f} {counts[f]}
            </button>
          ))}
        </div>
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#c8f65d]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-white/40">No members found</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((member, i) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className="group flex items-center gap-4 bg-[#161616] border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c8f65d]/20 to-[#c8f65d]/5 flex items-center justify-center text-[#c8f65d] font-bold text-sm flex-shrink-0">
                    {member.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{member.name}</p>
                    <p className={`text-xs font-medium uppercase tracking-wider ${planColor(member.plan)}`}>
                      {member.plan} Plan
                    </p>
                  </div>
                  <StatusBadge status={member.status} />
                  <div className="hidden sm:flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteId(member.id); }}
                      className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                    <Link href={`/members/${member.id}`}>
                      <motion.div
                        whileHover={{ x: 2 }}
                        className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </motion.div>
                    </Link>
                  </div>
                  <Link href={`/members/${member.id}`} className="sm:hidden">
                    <ChevronRight size={16} className="text-white/30" />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#161616] border border-white/10 rounded-2xl p-6 w-full max-w-sm"
            >
              <h3 className="text-white font-semibold mb-2">Delete Member?</h3>
              <p className="text-white/50 text-sm mb-6">This action cannot be undone. The member will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddMemberModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
