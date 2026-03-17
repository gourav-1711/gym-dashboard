import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  subtitleColor?: string;
  className?: string;
  accent?: boolean;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  subtitleColor,
  className,
  accent,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "rounded-2xl p-5 border",
        accent
          ? "bg-[#c8f65d] border-transparent"
          : "bg-[#161616] border-white/5 hover:border-white/10 transition-colors",
        className
      )}
    >
      {icon && (
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", accent ? "bg-black/10" : "bg-white/5")}>
          {icon}
        </div>
      )}
      <p className={cn("text-xs font-medium uppercase tracking-widest mb-1", accent ? "text-black/60" : "text-white/40")}>
        {title}
      </p>
      <p className={cn("text-2xl font-bold", accent ? "text-black" : "text-white")}>{value}</p>
      {subtitle && (
        <p className={cn("text-xs mt-1.5", subtitleColor ?? (accent ? "text-black/60" : "text-white/40"))}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
