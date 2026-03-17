import { cn } from "../lib/utils";

interface StatusBadgeProps {
  status: "active" | "expiring" | "inactive";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    active: { label: "ACTIVE", classes: "bg-[#c8f65d]/10 text-[#c8f65d] border border-[#c8f65d]/20" },
    expiring: { label: "EXPIRING", classes: "bg-orange-500/10 text-orange-400 border border-orange-500/20" },
    inactive: { label: "INACTIVE", classes: "bg-white/5 text-white/30 border border-white/10" },
  };
  const { label, classes } = config[status];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold tracking-wider", classes, className)}>
      {label}
    </span>
  );
}
