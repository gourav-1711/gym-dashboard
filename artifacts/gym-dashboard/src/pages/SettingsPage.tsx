import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Bell, Shield, Dumbbell, User, Mail, Globe } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-0.5">Manage your account preferences</p>
      </motion.div>

      {[
        {
          title: "Account",
          icon: User,
          items: [
            { label: "Email Address", value: user?.email ?? "admin@gym.com", type: "text" as const },
            { label: "Display Name", value: "Admin", type: "text" as const },
          ],
        },
        {
          title: "Gym Profile",
          icon: Dumbbell,
          items: [
            { label: "Gym Name", value: "GymPro Fitness", type: "text" as const },
            { label: "Location", value: "New York, NY", type: "text" as const },
            { label: "Website", value: "https://gympro.com", type: "text" as const },
          ],
        },
      ].map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.1 }}
          className="bg-[#161616] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#c8f65d]/10 flex items-center justify-center">
              <section.icon size={15} className="text-[#c8f65d]" />
            </div>
            <h2 className="font-semibold text-white">{section.title}</h2>
          </div>
          <div className="space-y-4">
            {section.items.map((item) => (
              <div key={item.label}>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">{item.label}</label>
                <input
                  defaultValue={item.value}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f65d]/50 transition-colors"
                />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#161616] border border-white/5 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#c8f65d]/10 flex items-center justify-center">
            <Bell size={15} className="text-[#c8f65d]" />
          </div>
          <h2 className="font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "Expiring memberships (7 days)", defaultChecked: true },
            { label: "New member signups", defaultChecked: true },
            { label: "Payment confirmations", defaultChecked: true },
            { label: "Weekly revenue summary", defaultChecked: false },
          ].map((item) => (
            <label key={item.label} className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">{item.label}</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} />
                <div className="w-10 h-5 bg-white/10 peer-checked:bg-[#c8f65d] rounded-full transition-all" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5 shadow" />
              </div>
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-[#c8f65d] text-black font-semibold px-6 py-2.5 rounded-xl hover:bg-[#d4ff6a] transition-colors text-sm"
        >
          Save Changes
        </motion.button>
      </motion.div>
    </div>
  );
}
