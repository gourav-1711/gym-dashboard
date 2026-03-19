import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAddMember } from "../hooks/useFirebase";
import { X, Loader2, Check } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PLANS = ["Basic", "Pro", "Elite"] as const;

function getExpiryDate(months: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

export default function AddMemberModal({ open, onClose }: Props) {
  const addMember = useAddMember();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "Basic" as typeof PLANS[number],
    address: "",
    duration: 12,
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string | number) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) { setError("Name and email are required."); return; }
    setError("");
    setLoading(true);
    try {
      await addMember.mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        plan: form.plan,
        address: form.address,
        status: "active",
        joinDate: new Date().toISOString().split("T")[0],
        expiryDate: getExpiryDate(form.duration),
      });
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setForm({ name: "", email: "", phone: "", plan: "Basic", address: "", duration: 12 });
        onClose();
      }, 1200);
    } catch {
      setError("Failed to add member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
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
            className="bg-[#161616] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Add New Member</h3>
              <button onClick={onClose} className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { field: "name", label: "Full Name", placeholder: "John Doe", required: true },
                { field: "email", label: "Email", placeholder: "john@example.com", required: true },
                { field: "phone", label: "Phone", placeholder: "+1 (555) 000-0000" },
                { field: "address", label: "Address", placeholder: "123 Main St, City" },
              ].map(({ field, label, placeholder, required }) => (
                <div key={field}>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                    {label} {required && <span className="text-[#c8f65d]">*</span>}
                  </label>
                  <input
                    value={form[field as keyof typeof form] as string}
                    onChange={(e) => set(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c8f65d]/50 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLANS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => set("plan", p)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all ${form.plan === p ? "bg-[#c8f65d] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Duration</label>
                <select
                  value={form.duration}
                  onChange={(e) => set("duration", Number(e.target.value))}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f65d]/50 transition-colors"
                >
                  {[1, 3, 6, 12, 24].map((m) => <option key={m} value={m}>{m} {m === 1 ? "month" : "months"}</option>)}
                </select>
              </div>

              {error && (
                <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || done}
                className="w-full bg-[#c8f65d] hover:bg-[#d4ff6a] text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {done ? <Check size={16} /> : loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {done ? "Member Added!" : loading ? "Adding..." : "Add Member"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
