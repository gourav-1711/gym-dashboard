import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useMember, useUpdateMember, useDeleteMember, usePayments } from "../hooks/useFirebase";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency, formatDate, daysUntilExpiry } from "../lib/utils";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  RefreshCw,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  Check,
} from "lucide-react";

export default function MemberDetailPage() {
  const [, params] = useRoute("/members/:id");
  const [, navigate] = useLocation();
  const id = params?.id ?? "";
  const { member, isLoading } = useMember(id);
  const { payments } = usePayments();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

  const [showEdit, setShowEdit] = useState(false);
  const [showRenew, setShowRenew] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", phone: "", plan: "Basic" as "Basic" | "Pro" | "Elite", address: "" });
  const [renewMonths, setRenewMonths] = useState(12);
  const [saving, setSaving] = useState(false);
  const [renewed, setRenewed] = useState(false);

  const memberPayments = payments.filter((p) => p.memberId === id);

  const openEdit = () => {
    if (!member) return;
    setEditData({ name: member.name, email: member.email, phone: member.phone, plan: member.plan, address: member.address ?? "" });
    setShowEdit(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateMember.mutateAsync({ id, data: editData });
    setSaving(false);
    setShowEdit(false);
  };

  const handleRenew = async () => {
    if (!member) return;
    setSaving(true);
    const newExpiry = new Date(member.expiryDate);
    newExpiry.setMonth(newExpiry.getMonth() + renewMonths);
    await updateMember.mutateAsync({ id, data: { expiryDate: newExpiry.toISOString().split("T")[0] } });
    setSaving(false);
    setRenewed(true);
    setTimeout(() => { setRenewed(false); setShowRenew(false); }, 1500);
  };

  const handleDelete = async () => {
    await deleteMember.mutateAsync(id);
    navigate("/members");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#c8f65d]" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40 mb-4">Member not found</p>
        <button onClick={() => navigate("/members")} className="text-[#c8f65d] text-sm hover:underline">Back to Members</button>
      </div>
    );
  }

  const days = daysUntilExpiry(member.expiryDate);
  const planColors: Record<string, string> = { Elite: "text-purple-400 bg-purple-500/10 border-purple-500/20", Pro: "text-blue-400 bg-blue-500/10 border-blue-500/20", Basic: "text-white/60 bg-white/5 border-white/10" };

  return (
    <div className="max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <button onClick={() => navigate("/members")} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} />
          Back to Members
        </button>
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openEdit} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors">
            <Edit3 size={14} />
            Edit
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowDelete(true)} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium px-3 py-2 rounded-xl transition-colors">
            <Trash2 size={14} />
            Delete
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#161616] border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c8f65d]/30 to-[#c8f65d]/10 flex items-center justify-center text-3xl font-bold text-[#c8f65d]">
              {member.name[0]}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#161616] ${member.status === "active" ? "bg-[#c8f65d]" : member.status === "expiring" ? "bg-orange-400" : "bg-white/20"}`} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white">{member.name}</h1>
            <p className="text-white/40 text-sm mt-0.5">Member since {formatDate(member.joinDate)}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
              <StatusBadge status={member.status} />
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${planColors[member.plan]}`}>
                {member.plan} Plan
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
          {[
            { icon: Mail, label: "Email", value: member.email },
            { icon: Phone, label: "Phone", value: member.phone },
            { icon: MapPin, label: "Address", value: member.address ?? "—" },
            { icon: Calendar, label: "Expires", value: formatDate(member.expiryDate) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={14} className="text-white/40" />
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider">{label}</p>
                <p className="text-sm text-white mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#161616] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Current Plan</h2>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${days <= 0 ? "bg-red-500/15 text-red-400" : days <= 7 ? "bg-orange-500/15 text-orange-400" : "bg-[#c8f65d]/15 text-[#c8f65d]"}`}>
            {days <= 0 ? "Expired" : `${days} days left`}
          </span>
        </div>
        <p className="text-lg font-bold text-white mb-1">{member.plan} Membership</p>
        <p className="text-sm text-white/40 mb-4">Expires {formatDate(member.expiryDate)}</p>
        <div className="w-full bg-white/5 rounded-full h-1.5 mb-5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, (365 - days) / 365 * 100))}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-1.5 rounded-full ${days <= 7 ? "bg-orange-400" : "bg-[#c8f65d]"}`}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowRenew(true)}
          className="flex items-center justify-center gap-2 w-full bg-[#c8f65d] text-black font-semibold py-3 rounded-xl hover:bg-[#d4ff6a] transition-colors"
        >
          <RefreshCw size={16} />
          Renew Membership
        </motion.button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[#161616] border border-white/5 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4">Subscription History</h2>
        {memberPayments.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-4">No payment history</p>
        ) : (
          <div className="space-y-3">
            {memberPayments.map((payment, i) => (
              <motion.div key={payment.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                <div className="w-9 h-9 rounded-xl bg-[#c8f65d]/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={14} className="text-[#c8f65d]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{payment.plan}</p>
                  <p className="text-xs text-white/40">{formatDate(payment.date)} • {payment.method}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatCurrency(payment.amount)}</p>
                  <span className="text-xs text-[#c8f65d] font-medium uppercase">PAID</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showEdit && (
          <Modal onClose={() => setShowEdit(false)} title="Edit Member">
            <div className="space-y-4">
              {(["name", "email", "phone", "address"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5 capitalize">{field}</label>
                  <input
                    value={editData[field]}
                    onChange={(e) => setEditData((d) => ({ ...d, [field]: e.target.value }))}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f65d]/50 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Plan</label>
                <select value={editData.plan} onChange={(e) => setEditData((d) => ({ ...d, plan: e.target.value as typeof d.plan }))} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f65d]/50 transition-colors">
                  {["Basic", "Pro", "Elite"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowEdit(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm py-2.5 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#c8f65d] hover:bg-[#d4ff6a] text-black font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </div>
          </Modal>
        )}

        {showRenew && (
          <Modal onClose={() => setShowRenew(false)} title="Renew Membership">
            <div className="space-y-4">
              <p className="text-sm text-white/50">Select renewal duration for <span className="text-white font-medium">{member.name}</span></p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 3, 6, 12, 24, 36].map((m) => (
                  <button key={m} onClick={() => setRenewMonths(m)} className={`py-2.5 rounded-xl text-sm font-medium transition-all ${renewMonths === m ? "bg-[#c8f65d] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
                    {m} {m === 1 ? "month" : "months"}
                  </button>
                ))}
              </div>
              <button onClick={handleRenew} disabled={saving || renewed} className="w-full bg-[#c8f65d] hover:bg-[#d4ff6a] text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                {renewed ? <Check size={16} /> : saving ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                {renewed ? "Renewed!" : `Renew for ${renewMonths} month${renewMonths > 1 ? "s" : ""}`}
              </button>
            </div>
          </Modal>
        )}

        {showDelete && (
          <Modal onClose={() => setShowDelete(false)} title="Delete Member">
            <p className="text-sm text-white/50 mb-5">Are you sure you want to delete <span className="text-white font-medium">{member.name}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm py-2.5 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors">Delete</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#161616] border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-white font-semibold mb-5">{title}</h3>
        {children}
      </motion.div>
    </motion.div>
  );
}
